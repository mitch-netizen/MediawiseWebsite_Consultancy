"""Checks every generated flow zip. Run after build.py:

    python3 validate.py [dist_dir]

Checks: valid JSON, unique action names, runAfter targets exist in the same scope, every
outputs()/body()/actions()/items()/variables() reference points at something that exists,
no createArray() with no arguments, brackets and quotes balance in expressions, the Column_map
is used (no hard coded field_N names), and nothing that looks like a secret or signed URL.
Exit code 1 on any problem.
"""
import json, os, re, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "dist")
problems = []


def walk(actions, scope, names, parent_path):
    """Yield (name, action) for every action, checking runAfter within each scope."""
    for name, a in actions.items():
        names.setdefault(name, []).append(parent_path)
        for dep in a.get("runAfter", {}):
            if dep not in actions:
                problems.append(f"{scope}: {parent_path}/{name} runs after '{dep}' which is not in the same scope")
        yield name, a
        for key in ("actions",):
            if isinstance(a.get(key), dict):
                yield from walk(a[key], scope, names, f"{parent_path}/{name}")
        if isinstance(a.get("else"), dict):
            yield from walk(a["else"].get("actions", {}), scope, names, f"{parent_path}/{name}/else")
        for cname, c in (a.get("cases") or {}).items():
            yield from walk(c.get("actions", {}), scope, names, f"{parent_path}/{name}/{cname}")
        if isinstance(a.get("default"), dict):
            yield from walk(a["default"].get("actions", {}), scope, names, f"{parent_path}/{name}/default")


def expressions(s):
    """The expression parts of a template string: all of it if it starts with @, else each @{...} piece."""
    if s.startswith("@") and not s.startswith("@{"):
        yield s[1:]
        return
    i = 0
    while True:
        i = s.find("@{", i)
        if i < 0:
            return
        j, depth, q = i + 2, 1, False
        while j < len(s) and depth:
            c = s[j]
            if c == "'":
                q = not q
            elif not q and c == "{":
                depth += 1
            elif not q and c == "}":
                depth -= 1
            j += 1
        yield s[i + 2:j - 1]
        i = j


def strings(o):
    if isinstance(o, str):
        yield o
    elif isinstance(o, dict):
        for k, v in o.items():
            yield from strings(k)
            yield from strings(v)
    elif isinstance(o, list):
        for v in o:
            yield from strings(v)


def check_zip(path):
    scope = os.path.relpath(path, DIST)
    z = zipfile.ZipFile(path)
    for n in z.namelist():
        if n.endswith(".json"):
            json.loads(z.read(n))
    defn = [n for n in z.namelist() if n.endswith("definition.json")][0]
    flow = json.loads(z.read(defn))["properties"]["definition"]
    names = {}
    allacts = dict(walk(flow["actions"], scope, names, ""))
    for n, locs in names.items():
        if len(locs) > 1:
            problems.append(f"{scope}: action name '{n}' used {len(locs)} times")
    variables = set()
    for n, a in allacts.items():
        if a.get("type") == "InitializeVariable":
            variables |= {v["name"] for v in a["inputs"]["variables"]}
    text = json.dumps(flow)
    if "createArray()" in text:
        problems.append(f"{scope}: createArray() with no arguments")
    if re.search(r"field_\d+", text):
        problems.append(f"{scope}: hard coded internal column name (field_N)")
    if re.search(r"(sig=|sv=20|password|api[_-]?key|secret|prod-\d+\.\w+\.logic\.azure)", text, re.I):
        problems.append(f"{scope}: something that looks like a secret or signed URL")
    for s in strings(flow):
        if "@" not in s:
            continue
        for ex in expressions(s):
            bare = re.sub(r"'(?:[^']|'')*'", "''", ex)
            if bare.count("(") != bare.count(")"):
                problems.append(f"{scope}: unbalanced parentheses in: {ex[:120]}")
            if bare.count("[") != bare.count("]"):
                problems.append(f"{scope}: unbalanced brackets in: {ex[:120]}")
        for fn, ref in re.findall(r"\b(outputs|body|actions|variables)\('([^']+)'\)", s):
            if fn == "variables":
                if ref not in variables:
                    problems.append(f"{scope}: variables('{ref}') is never initialised")
            elif ref not in allacts and ref != "Column_map":
                problems.append(f"{scope}: {fn}('{ref}') points at no action")
        for ref in re.findall(r"\bitems\('([^']+)'\)", s):
            if ref not in allacts or allacts[ref].get("type") != "Foreach":
                problems.append(f"{scope}: items('{ref}') is not a Foreach")
    print(f"ok  {scope}: {len(allacts)} actions")


zips = [os.path.join(r, f) for r, _, fs in os.walk(DIST) for f in fs if f.endswith(".zip")]
if not zips:
    problems.append("no zips found in " + DIST)
for z in sorted(zips):
    check_zip(z)
if problems:
    print("\nPROBLEMS:")
    for p in dict.fromkeys(problems):
        print(" -", p)
    sys.exit(1)
print("all flows pass")
