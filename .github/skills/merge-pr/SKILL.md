# Skill: Merge Pull Request

## Description

Safely merge a pull request after verifying all checks pass. This skill handles the final gate before code reaches `main` — it enforces CI green, approval status, conflict-free state, and conventional commit formatting on squash merge.

## Prerequisites

- All CI checks passing
- At least one approval (or self-review for solo dev)
- No merge conflicts
- PR diff reviewed per [REVIEW-CHECKLIST.md](../../../REVIEW-CHECKLIST.md)

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `pr_number` | yes | The pull request number |
| `repo` | yes | Repository name (under `idealase/` org) |
| `type` | yes | Conventional commit type: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `style`, `perf` |
| `summary` | yes | One-line summary for the squash commit |

## Steps

### 1. Verify CI status

```bash
gh pr checks {pr_number} --repo idealase/{repo}
```

All checks must show ✓. If any are pending, wait. If any failed, stop — do not merge.

### 2. Review diff size

```bash
gh pr diff {pr_number} --repo idealase/{repo} | wc -l
```

Cross-reference against the size label:
- `size/XS`: < 50 lines
- `size/S`: < 200 lines
- `size/M`: < 500 lines
- `size/L`: < 1000 lines
- `size/XL`: should have been decomposed — flag for review

If diff significantly exceeds label, pause and verify scope.

### 3. Check for merge conflicts

```bash
gh pr view {pr_number} --repo idealase/{repo} --json mergeable
```

Must return `"mergeable": "MERGEABLE"`. If `CONFLICTING`, the branch needs a rebase first.

### 4. Verify approvals

```bash
gh pr view {pr_number} --repo idealase/{repo} --json reviewDecision
```

Must be `APPROVED`. For solo dev repos, self-review is acceptable — verify the review checklist was completed.

### 5. Squash merge with conventional commit

```bash
gh pr merge {pr_number} --repo idealase/{repo} --squash --delete-branch \
  --subject "{type}: {summary}" \
  --body "Closes #{pr_number}"
```

The `--delete-branch` flag cleans up the feature branch automatically.

### 6. Verify merge

```bash
gh pr view {pr_number} --repo idealase/{repo} --json state
```

Must return `"state": "MERGED"`.

### 7. Verify deployment (if applicable)

For repos with live deployments, confirm the site still works:
```bash
curl -s -o /dev/null -w '%{http_code}' https://{subdomain}.sandford.systems
```

## Conventional Commit Reference

| Type | When to use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Maintenance, deps, config |
| `refactor` | Code change that neither fixes nor adds |
| `test` | Adding or correcting tests |
| `ci` | CI/CD pipeline changes |
| `style` | Formatting, whitespace, semicolons |
| `perf` | Performance improvement |

## Rollback

If issues discovered post-merge:

```bash
# Identify the merge commit
git log --oneline -5

# Revert it
git revert {merge_commit_sha}

# Push the revert
git push origin main

# Create a PR for the revert (for audit trail)
gh pr create --repo idealase/{repo} \
  --title "revert: {type}: {summary}" \
  --body "Reverts #{pr_number} due to {reason}"
```

## Common Failure Modes

| Failure | Cause | Resolution |
|---------|-------|------------|
| CI pending indefinitely | Runner offline or job queued | Check `~/actions-runners/` status |
| Merge conflict appeared | `main` advanced while PR was open | Rebase: `git rebase main` and force-push |
| Wrong commit type | Hasty merge | Doesn't affect code — note for future |
| Tests pass locally but fail in CI | Environment drift | Check runner logs, compare Node/Python versions |
