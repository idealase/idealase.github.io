# Dependency Upgrade

> Dispatch this prompt to an agent upgrading one or more dependencies.

## Issue

{issue_url}

## Repository

{repo_name} — clone at `~/Desktop/Repos/{repo_name}`

## Summary

{one_line_summary}

## Dependencies to Upgrade

| Package | Current Version | Target Version | Changelog |
|---------|----------------|----------------|-----------|
| {package_name} | {current_version} | {target_version} | {changelog_url} |

## Breaking Changes to Check

<!-- Review the changelog and list known breaking changes -->

{breaking_changes_list}

## Files Likely Affected

<!-- Files that import or configure these dependencies -->

{affected_file_list}

## Upgrade Steps

```bash
cd ~/Desktop/Repos/{repo_name}

# 1. Update the dependency
{upgrade_command}
# e.g., npm install {package}@{version}
# e.g., pip install {package}=={version}
# e.g., cargo update -p {package}

# 2. Check for peer dependency warnings
{peer_check_command}

# 3. Build
{build_command}

# 4. Run tests
{test_command}

# 5. Run lint
{lint_command}
```

## Migration Checklist

<!-- Steps to adapt code if the upgrade includes breaking changes -->

{migration_steps}

## Build & Test

```bash
{build_command}
{test_command}
```

## Constraints

- Upgrade only the listed dependencies — do not bump unrelated packages
- If `npm install` or equivalent modifies the lockfile, that is expected and should be committed
- If a breaking change requires code modifications, keep them minimal and focused
- Do not change test infrastructure (framework version, config) unless that is the upgrade target
- Check `.github/copilot-instructions.md` for repo-specific dependency policies

## Verification

```bash
# Confirm the correct version is installed
{version_check_command}
# e.g., npm ls {package}
# e.g., pip show {package}
# e.g., cargo tree -p {package}

# Confirm no duplicate/conflicting versions
{duplicate_check_command}
```

## Rollback

If the upgrade breaks things beyond a reasonable fix:

```bash
git checkout -- {lockfile}
git checkout -- {manifest_file}
{install_command}
```

## Completion Checklist

- [ ] Dependencies upgraded to target versions
- [ ] Breaking changes addressed (if any)
- [ ] Build succeeds
- [ ] All tests pass
- [ ] Lint passes
- [ ] No unexpected peer dependency warnings
- [ ] Lockfile committed
- [ ] Commit with: `chore(deps): upgrade {package} to {version}`
