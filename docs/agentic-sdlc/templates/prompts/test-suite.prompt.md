# Test Suite Creation

> Dispatch this prompt to an agent creating or expanding a test suite.

## Issue

{issue_url}

## Repository

{repo_name} — clone at `~/Desktop/Repos/{repo_name}`

## Summary

{one_line_summary}

## Test Framework

<!-- Pick the framework already in use for this repo -->

- **JavaScript/TypeScript**: Vitest (`npx vitest run`)
- **Python**: pytest (`pytest -q`)
- **Rust**: cargo test (`cargo test`)

Framework for this repo: `{test_framework}`

## Coverage Target

Current coverage: {current_coverage}%
Target coverage: {target_coverage}%

Focus on: {coverage_focus_areas}

## Files to Test

<!-- Source files that need test coverage -->

{source_file_list}

## Test File Locations

<!-- Where to create or modify test files -->

{test_file_list}

Convention: `{test_file_convention}`

Examples:
- Co-located: `src/utils/parse.ts` → `src/utils/parse.test.ts`
- Separate directory: `src/utils/parse.ts` → `tests/utils/parse.test.ts`

## Test Scenarios

### Happy Path

<!-- Core functionality that must work -->

{happy_path_scenarios}

### Edge Cases

<!-- Boundary conditions, empty inputs, error states -->

{edge_case_scenarios}

### Error Handling

<!-- What happens when things go wrong -->

{error_scenarios}

## Assertion Style Guidelines

- Use specific matchers: `toBe()` for primitives, `toEqual()` for objects, `toContain()` for arrays
- Test behavior, not implementation — assert on outputs, not internal state
- One logical assertion per test (multiple `expect` calls are fine if testing one behavior)
- Name tests as sentences: `it('returns empty array when no items match filter')`
- Avoid `toMatchSnapshot()` unless testing serialization output

## Anti-Patterns to Avoid

- **Test theater**: Tests that pass even if the feature is removed
- **Mocking everything**: Only mock external I/O (network, filesystem, timers)
- **Flaky tests**: No `setTimeout`, no real network calls, no random data
- **Testing framework code**: Don't test that React renders or that Express routes
- **Brittle selectors**: Use `data-testid` attributes, not CSS classes or DOM structure

## Build & Test

```bash
# Run the specific test file
{test_single_command}

# Run the full suite
{test_command}

# Coverage report (if available)
{coverage_command}
```

## Constraints

- Follow testing patterns already established in the repo
- Check `.github/copilot-instructions.md` for repo-specific test conventions
- Do not add test utilities or helpers unless the repo already has a test utils pattern
- Do not modify source code — only create/modify test files
- Keep test files under 300 lines — split into multiple files if larger

## Completion Checklist

- [ ] All specified source files have corresponding tests
- [ ] Happy path scenarios covered
- [ ] Edge cases covered
- [ ] Error handling scenarios covered
- [ ] All tests pass
- [ ] No flaky tests (run suite 3x to confirm)
- [ ] Coverage meets or exceeds target
- [ ] Commit with: `test({scope}): {description}`
