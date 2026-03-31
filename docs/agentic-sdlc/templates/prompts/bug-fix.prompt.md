# Bug Fix

> Dispatch this prompt to an agent tasked with diagnosing and fixing a bug.

## Issue

{issue_url}

## Repository

{repo_name} — clone at `~/Desktop/Repos/{repo_name}`

## Summary

{one_line_summary}

## Reproduction Steps

<!-- Exact steps to trigger the bug — agent will verify before fixing -->

{reproduction_steps}

## Expected Behavior

{expected_behavior}

## Actual Behavior

{actual_behavior}

## Root Cause Hint

<!-- Optional: narrow the search if you already suspect the cause -->

{root_cause_hint}

## Fix Location

<!-- Files where the fix should live -->

{fix_file_list}

## Files for Context

{context_file_list}

## Test Expectation

<!-- What a passing test looks like after the fix -->

{test_expectation}

## Build & Test

```bash
{build_command}
{test_command}
```

## Constraints

- Reproduce the bug first — confirm the failure before writing any fix
- Write a failing test that captures the bug, then make it pass
- Do not fix adjacent bugs discovered during investigation
- Keep the fix minimal and surgical
- Follow existing patterns in `.github/copilot-instructions.md`
- Commit with: `fix({scope}): {description}`

## Regression Check

<!-- After fixing, verify these related paths still work -->

{regression_check_list}

## Completion Checklist

- [ ] Bug reproduced and root cause identified
- [ ] Failing test written that captures the bug
- [ ] Fix applied — test now passes
- [ ] All existing tests still pass (no regressions)
- [ ] Build succeeds
- [ ] Lint passes
- [ ] Commit message references the issue number
