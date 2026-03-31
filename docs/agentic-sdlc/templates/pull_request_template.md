## Summary

<!-- What changed and why? Link to the issue. -->

Closes #{issue_number}

## Changes

<!-- List what was added, modified, or removed -->

- [ ] {change_description}

## Testing

- [ ] Tests pass: `{test_command}`
- [ ] Build succeeds: `{build_command}`
- [ ] Lint passes: `{lint_command}`

## Agent Evidence

<!-- Fill this section if this PR was created by an AI agent. Delete if human-authored. -->

- [ ] Agent: {agent_name}
- [ ] Prompt template used: {prompt_template}
- [ ] Issue fully addressed (all acceptance criteria met)
- [ ] No scope creep (only files in "Files to Modify" changed)
- [ ] No phantom dependencies added
- [ ] No hallucinated APIs or imports

## Review Checklist

- [ ] **Correctness**: Solves the stated problem
- [ ] **Security**: No secrets, no eval, proper input validation
- [ ] **Architecture**: Follows existing patterns in the repo
- [ ] **Tests**: Meaningful assertions, not theater
- [ ] **Docs**: Updated if behavior changed

## Deployment

<!-- Fill if this PR triggers a deployment. Delete if not applicable. -->

- [ ] Deployment target: `{subdomain}.sandford.systems`
- [ ] Nginx config updated (if needed)
- [ ] Systemd service updated (if needed)
- [ ] Cloudflare tunnel ingress updated (if needed)
- [ ] Health check verified post-deploy
