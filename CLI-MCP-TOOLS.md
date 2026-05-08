# CLI & MCP Tools Collection

A curated collection of practical CLI tools and MCP (Model Context Protocol) servers that enhance Claude Code's capabilities. Each tool is installed locally and configured for global access.

---

## Browser Harness

**Repo**: [browser-use/browser-harness](https://github.com/browser-use/browser-harness)
**Version**: 0.1.0 | **Status**: Installed & Active

### What It Does

Browser Harness gives Claude direct control over your real browser via Chrome DevTools Protocol (CDP). Unlike Playwright/Puppeteer, it has no predefined action library — the agent writes missing helper functions at runtime into `agent_helpers.py`, making it self-improving with every run.

### Installation

```bash
# Clone to a persistent directory
git clone https://github.com/browser-use/browser-harness ~/Developer/browser-harness
cd ~/Developer/browser-harness

# Install as global editable tool (requires uv)
uv tool install -e .

# Verify
browser-harness --version
```

### Global Claude Code Integration

Added to `~/.claude/CLAUDE.md`:

```markdown
@~/Developer/browser-harness/SKILL.md
```

This makes every Claude Code session automatically load browser-harness instructions.

### Unattended Mode (Way 2)

For long-running autonomous browser tasks without popup interruptions:

```bat
:: start-browser-daemon.bat
set BU_CDP_URL=http://127.0.0.1:9222
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir="%USERPROFILE%\Developer\browser-harness\edge-profile"
```

Environment variable `BU_CDP_URL` is set persistently at the user level.

### Architecture

```
Edge/Browser -> CDP WebSocket -> browser_harness.daemon -> IPC -> browser_harness.run
```

### Key Commands

| Command | Purpose |
|---------|---------|
| `browser-harness --doctor` | Diagnose installation and connection status |
| `browser-harness -c 'print(page_info())'` | Test browser connection |
| `browser-harness --update -y` | Self-update to latest version |
| `browser-harness --version` | Show installed version |

### Connection Modes

| Mode | Use Case | Login State | Popups |
|------|----------|-------------|--------|
| **Way 1** (chrome://inspect) | Daily use, need your logins | Inherited | Yes (Chrome 144+) |
| **Way 2** (--remote-debugging-port) | Unattended automation | Isolated profile | None |
| **Cloud** (Browser Use API) | Stealth, sub-agents | Via profile-use sync | None |

### Domain Skills

Community-contributed per-site playbooks available in `agent-workspace/domain-skills/`:
- `github/` — PR creation, code review, issue management
- `linkedin/` — Connection requests, messaging
- `amazon/` — Product search, price comparison

Enable with `BH_DOMAIN_SKILLS=1`.

### Resources

- [Install Guide](https://github.com/browser-use/browser-harness/blob/main/install.md)
- [Skill Reference (SKILL.md)](https://github.com/browser-use/browser-harness/blob/main/SKILL.md)
- [Browser Use Cloud](https://cloud.browser-use.com/) — Free tier: 3 concurrent browsers

---

## Installed MCP Servers

| Server | Source | Purpose |
|--------|--------|---------|
| Playwright | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | Browser automation for visual testing |
| GitHub | [github/github-mcp-server](https://github.com/github/github-mcp-server) | GitHub API integration, workflow triggers |

---

## Installed Claude Code Skills

| Skill | Source | Purpose |
|-------|--------|---------|
| guizang-ppt-skill | [op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) | HTML presentation generation with WebGL effects |
| nothing-design-skill | [dominikmartn/nothing-design-skill](https://github.com/dominikmartn/nothing-design-skill) | Industrial monochrome design system |

---

*Last updated: 2026-05-08*
