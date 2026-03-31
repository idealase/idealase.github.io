# Code Review

> Dispatch this prompt to a review agent evaluating a PR or agent output.

## Pull Request

{pr_url}

## Issue

{issue_url}

## Repository

{repo_name} — clone at `~/Desktop/Repos/{repo_name}`

## Summary of Changes

{change_summary}

## Review Checklist

### Correctness

- [ ] Solves the stated problem in the linked issue
- [ ] All acceptance criteria from the issue are met
- [ ] Edge cases handled (nulls, empty inputs, boundary values)
- [ ] Error handling is explicit, not swallowed
- [ ] No off-by-one errors in loops or slices

### Security

- [ ] No secrets, tokens, or credentials in code or comments
- [ ] No `eval()`, `dangerouslySetInnerHTML`, or equivalent
- [ ] User input is validated and sanitized
- [ ] No new attack surface (XSS, injection, path traversal)
- [ ] Dependencies are from trusted sources

### Architecture

- [ ] Follows existing patterns in the codebase
- [ ] No unnecessary abstractions or premature generalization
- [ ] Changes are in the correct layer (data / logic / presentation)
- [ ] No tight coupling introduced between unrelated modules
- [ ] File organization matches repo conventions

### Tests

- [ ] Tests are meaningful — assert behavior, not implementation
- [ ] Tests would fail if the feature were removed
- [ ] Edge cases are tested, not just the happy path
- [ ] No flaky patterns (timers, network calls, random values)
- [ ] Test names describe the scenario, not the method

### Performance

- [ ] No N+1 queries or unbounded loops
- [ ] No blocking calls on the main thread / event loop
- [ ] Large lists are paginated or virtualized
- [ ] No unnecessary re-renders (React) or recomputation

## Common Agent Failure Modes

Watch specifically for these patterns in agent-generated code:

- **Scope creep**: Files modified that weren't in the issue's "Files to Modify"
- **Phantom dependencies**: `npm install` or `pip install` for packages not justified by the issue
- **Test theater**: Tests that always pass regardless of implementation
- **Hallucinated APIs**: Calling methods or endpoints that don't exist in the codebase
- **Copy-paste drift**: Code duplicated instead of extracting shared logic
- **Incomplete error paths**: Happy path works but errors crash or hang
- **Stale imports**: Importing from moved/renamed modules

## Verdict Format

Respond with one of:

### ✅ PASS

All checklist items satisfied. Note any minor suggestions (non-blocking).

### 🔄 NEEDS CHANGES

For each required change, provide:

```
File: {path}
Line: {line_number}
Issue: {description of the problem}
Fix: {what should change}
Severity: blocking | important | minor
```

### ❌ REJECT

Fundamental problems requiring a rework. Explain why and reference the specific acceptance criteria that are unmet.

## Context Files

<!-- Files the reviewer should read to understand conventions -->

{context_file_list}
