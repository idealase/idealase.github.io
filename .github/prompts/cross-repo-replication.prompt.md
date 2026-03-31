# Cross-Repo Replication

> Dispatch this prompt to an agent applying the same change across multiple repositories.

## Issue

{issue_url}

## Summary

{one_line_summary}

## Reference Implementation

<!-- The repo + file(s) where this change was first implemented correctly -->

Repository: `{reference_repo}` — `~/Desktop/Repos/{reference_repo}`
Files:

{reference_file_list}

## Target Repositories

<!-- All repos receiving this change -->

| # | Repo | Clone Path | Customizations |
|---|------|-----------|----------------|
| 1 | {repo_1} | `~/Desktop/Repos/{repo_1}` | {customization_1} |
| 2 | {repo_2} | `~/Desktop/Repos/{repo_2}` | {customization_2} |

Available repos on sandford.systems:
- `bolsard` — React + FastAPI
- `me-net` — TypeScript + Vite + D3
- `geeraff` — (check stack)
- `PulseQuiz` — (check stack)
- `minclo` — (check stack)
- `rot-garden` — (check stack)
- `bucket-flow-calculus` — (check stack)
- `dc-sim` — (check stack)
- `fam-arch` — (check stack)
- `ant-size-simulator` — (check stack)
- `eagle-size-simulator` — (check stack)
- `elephant-size-simulator` — (check stack)
- `spider-size-simulator` — (check stack)
- `idealase.github.io` — React + HTML hybrid

## Change Description

<!-- What the change does and why every repo needs it -->

{change_description}

## Per-Repo Adaptation Rules

<!-- How to customize the change for each repo's stack/conventions -->

{adaptation_rules}

Common adaptations:
- Package manager: `npm` vs `pip` vs `cargo`
- Config file format: `package.json` vs `pyproject.toml` vs `Cargo.toml`
- Test framework: `vitest` vs `pytest` vs `cargo test`
- Check each repo's `.github/copilot-instructions.md` for conventions

## Verification Steps (per repo)

```bash
cd ~/Desktop/Repos/{repo_name}

# 1. Apply the change
{apply_steps}

# 2. Build
{build_command}

# 3. Test
{test_command}

# 4. Verify the change is correct
{verify_command}
```

## Execution Order

<!-- Process repos in this order (dependency-aware) -->

{execution_order}

Default: apply to the simplest repo first as a validation pass, then fan out.

## Constraints

- Do not modify files beyond what the replication requires
- Respect each repo's existing conventions — don't force the reference repo's style
- If a repo doesn't have the prerequisite structure, skip it and note why
- Check `.github/copilot-instructions.md` in each repo before making changes
- One commit per repo with: `chore: {description} (replicated from {reference_repo})`

## Progress Tracking

| Repo | Applied | Builds | Tests Pass | Committed |
|------|---------|--------|------------|-----------|
| {repo_1} | ☐ | ☐ | ☐ | ☐ |
| {repo_2} | ☐ | ☐ | ☐ | ☐ |

## Completion Checklist

- [ ] Reference implementation reviewed and understood
- [ ] Change applied to all target repos
- [ ] Per-repo customizations applied where needed
- [ ] All repos build successfully
- [ ] All repos pass tests
- [ ] Each repo has a clean commit referencing the issue
- [ ] Repos that were skipped are documented with reasons
