# Feature Implementation

> Dispatch this prompt to an agent tasked with implementing a new feature.

## Issue

{issue_url}

## Repository

{repo_name} — clone at `~/Desktop/Repos/{repo_name}`

## Summary

{one_line_summary}

## Files to Modify

{file_list}

## Files for Context

<!-- Agent reads these but does NOT edit them -->

{context_file_list}

## Acceptance Criteria

<!-- Binary pass/fail — agent must verify each before committing -->

{criteria_list}

## Out of Scope

- Do not modify files not listed above
- Do not add new dependencies without justification
- Do not refactor adjacent code
- Do not change test infrastructure or CI config

## Build & Test

```bash
{build_command}
{test_command}
```

## Constraints

- Follow existing code patterns in the repo
- Refer to `.github/copilot-instructions.md` for repo-specific conventions
- Run the full test suite before marking complete
- Commit with a conventional commit message: `feat({scope}): {description}`
- If acceptance criteria are ambiguous, implement the narrowest reasonable interpretation
- Keep the diff minimal — solve the stated problem, nothing more

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] Tests pass (existing + any new ones)
- [ ] Build succeeds with no warnings
- [ ] Lint passes
- [ ] Changes limited to listed files
- [ ] Commit message references the issue number
