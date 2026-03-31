# Skill: Run Tests

## Description

Execute the test suite for a repository and report structured results. This skill auto-detects the test runner from project configuration and produces a consistent output format regardless of framework.

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `repo_name` | yes | — | Repository name (directory under `~/Desktop/Repos/`) |
| `test_filter` | no | all | Specific test file or pattern to run |
| `coverage` | no | `false` | Whether to collect coverage data |

## Test Runner Detection

Check project files in this order to determine the test runner:

### JavaScript / TypeScript

1. Check `package.json` for test script: `cat package.json | python3 -c "import sys,json; print(json.load(sys.stdin).get('scripts',{}).get('test',''))"` 
2. Check for framework-specific configs:
   - `vitest.config.ts` or `vite.config.ts` with test config → **Vitest**
   - `jest.config.js` or `jest.config.ts` → **Jest**
   - `package.json` has `"jest"` key → **Jest**

### Python

1. `pyproject.toml` with `[tool.pytest]` → **pytest**
2. `pytest.ini` or `setup.cfg` with `[tool:pytest]` → **pytest**
3. `requirements.txt` or `requirements-dev.txt` contains `pytest` → **pytest**

### Rust

1. `Cargo.toml` exists → **cargo test**

## Portfolio Test Runner Map

| Repo | Runner | Command | Coverage Command | Has Tests |
|------|--------|---------|-----------------|-----------|
| minclo | Vitest | `npm test` | `npm run test:coverage` | ✅ |
| me-net | Vitest | `npm test` | `npm run test:coverage` | ✅ |
| ant-size-simulator | Vitest | `npm test` | — | ✅ |
| eagle-size-simulator | Vitest | `npm test` | — | ✅ |
| elephant-size-simulator | Vitest | `npm test` | — | ✅ |
| geeraff | TBD | TBD | — | Needs setup |
| PulseQuiz | TBD | TBD | — | Needs setup |
| spider-size-simulator | — | — | — | Needs setup |
| dc-sim | — | — | — | Needs setup |
| bucket-flow-calculus | — | — | — | Needs setup |
| bolsard | TBD | TBD | — | Needs setup |
| fam-arch | TBD | TBD | — | Needs setup |
| greyzone | TBD | TBD | — | Needs setup |
| rot-garden | Cargo | `cargo test` | — | TBD |

## Steps

### 1. Navigate to repo

```bash
cd ~/Desktop/Repos/{repo_name}
```

### 2. Install dependencies

**JavaScript/TypeScript:**
```bash
npm ci
```

**Python:**
```bash
pip install -e ".[dev]"
# or
pip install -r requirements.txt -r requirements-dev.txt
```

**Rust:**
No install step needed — `cargo test` handles compilation.

### 3. Run tests

**Vitest:**
```bash
npx vitest run
```

Or with a filter:
```bash
npx vitest run {test_filter}
```

**Jest:**
```bash
npx jest --no-cache
```

Or with a filter:
```bash
npx jest --no-cache {test_filter}
```

**pytest:**
```bash
pytest -q
```

Or with a filter:
```bash
pytest -q -k "{test_filter}"
```

**Cargo:**
```bash
cargo test
```

Or with a filter:
```bash
cargo test {test_filter}
```

### 4. Collect coverage (if requested)

**Vitest:**
```bash
npm run test:coverage
# or
npx vitest run --coverage
```

**Jest:**
```bash
npx jest --coverage
```

**pytest:**
```bash
pytest --cov=src --cov-report=term-missing -q
```

**Cargo:**
```bash
cargo tarpaulin --out Stdout
```

### 5. Parse and report results

Extract these metrics from the test output:

```
## Test Results: {repo_name}

- **Runner**: {vitest|jest|pytest|cargo}
- **Total tests**: {n}
- **Passed**: {n} ✅
- **Failed**: {n} ❌ {list failure names if any}
- **Skipped**: {n} ⏭️
- **Coverage**: {n}% (if collected)
- **Duration**: {n}s

### Failed Tests
{For each failure: test name, assertion error, file:line}

### Verdict
{PASS — all tests green | FAIL — {n} failures need attention}
```

## Running Tests for a Specific Change

When verifying an agent's PR, run tests scoped to the changed area:

```bash
# Get list of changed files
gh pr diff {pr_number} --repo idealase/{repo_name} --name-only

# Run only related test files (Vitest)
npx vitest run src/components/MyComponent.test.ts

# Run only related test files (pytest)
pytest tests/test_my_module.py -q

# Run full suite to catch regressions
npx vitest run
```

## Interpreting Results

### All pass → Merge candidate

Proceed to review. Tests passing is necessary but not sufficient — still review the diff.

### Some failures → Diagnose

1. **Were these tests failing before the change?** Check `main` branch:
   ```bash
   git stash && npx vitest run && git stash pop
   ```
2. **Is it a flaky test?** Run the failing test 3 times:
   ```bash
   npx vitest run --reporter=verbose {failing_test} && \
   npx vitest run --reporter=verbose {failing_test} && \
   npx vitest run --reporter=verbose {failing_test}
   ```
3. **Is it an environment issue?** Check Node/Python version, missing env vars.

### No tests exist → Flag it

If the repo has no tests, add `needs-tests` label to the issue and note it in the PR review. Don't let absence of tests be confused with tests passing.

## Common Failure Modes

| Failure | Cause | Resolution |
|---------|-------|------------|
| `vitest: command not found` | Not in devDependencies | `npm ci` or `npm install -D vitest` |
| Import errors | Missing dep or wrong path | Check the import, run `npm ci` |
| Timeout | Test hits network or slow computation | Check for missing mocks, increase timeout |
| Snapshot mismatch | UI change without snapshot update | `npx vitest run --update` if change is intentional |
| `pytest: no tests ran` | Wrong test directory or naming | Check `pytest.ini` or `pyproject.toml` for `testpaths` |
| Flaky pass/fail | Race condition or time-dependent test | Isolate and fix the test, don't just re-run |
