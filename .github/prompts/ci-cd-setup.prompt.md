# CI/CD Setup

> Dispatch this prompt to an agent creating or modifying GitHub Actions workflows.

## Issue

{issue_url}

## Repository

{repo_name} — clone at `~/Desktop/Repos/{repo_name}`

## Summary

{one_line_summary}

## Workflow File

<!-- Path to the workflow file to create or modify -->

`.github/workflows/{workflow_name}.yml`

## Trigger Events

<!-- When should this workflow run? -->

{trigger_events}

Example triggers:
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

## Jobs & Steps

<!-- Describe each job and its steps -->

{jobs_description}

## Runner Configuration

<!-- All sandford.systems repos use self-hosted runners -->

```yaml
runs-on: self-hosted
```

Runner locations:
- General: `~/actions-runners/{repo_name}/`
- PulseQuiz: `~/actions-runner-pulsequiz/`

## Secrets & Environment Variables

<!-- List any secrets the workflow needs — do NOT include actual values -->

{secrets_list}

Configure via: Repository → Settings → Secrets and variables → Actions

## Reference Workflows

<!-- Existing workflows in other repos to use as patterns -->

{reference_workflow_list}

Check these repos for working examples:
- `bolsard` — full CI with lint, test, build
- `me-net` — Vite + Vitest pipeline
- `PulseQuiz` — dedicated runner setup

## Success Criteria

- [ ] Workflow triggers on the specified events
- [ ] All jobs complete successfully on a clean run
- [ ] Self-hosted runner label is correct
- [ ] Secrets are referenced (not hardcoded)
- [ ] Workflow file passes `actionlint` validation (if available)
- [ ] Status badges work: `![CI](https://github.com/idealase/{repo_name}/actions/workflows/{workflow_name}.yml/badge.svg)`

## Constraints

- Use `self-hosted` runners — no GitHub-hosted runners
- Pin action versions to specific SHAs or major versions (e.g., `actions/checkout@v4`)
- Cache dependencies where possible (`actions/cache` or built-in caching)
- Keep workflow files under 200 lines — split into reusable workflows if larger
- Follow existing naming conventions in the repo's `.github/workflows/`

## Build & Test Verification

```bash
# Verify the workflow file is valid YAML
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/{workflow_name}.yml'))"

# Dry-run the build/test steps locally
{build_command}
{test_command}
```

## Completion Checklist

- [ ] Workflow file created/modified at the correct path
- [ ] Triggers configured correctly
- [ ] Runner set to `self-hosted`
- [ ] All secrets referenced, none hardcoded
- [ ] Local build/test steps verified
- [ ] Commit with: `ci({scope}): {description}`
