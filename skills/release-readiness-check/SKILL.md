---
name: release-readiness-check
description: "Decide whether an Orangescrum release is ready to ship and list every blocker: unfinished items, open critical defects, unresolved dependencies, unchecked go-live checklist items, pending approvals, and blackout windows. When an agent needs to: (1) Answer 'is this release ready?', (2) Prepare a go or no-go summary, (3) Find what is blocking a release, or (4) Check the planned date against blackout windows. Read-only by default."
---

# Release Readiness Check

## Keywords
release readiness, is the release ready, go no go, ship it, release blockers, can we release, release checklist, approvals pending, blackout window, release status

## Overview

Produce a clear go or no-go answer for a release, backed by the server's own readiness calculation and the checks around it. This skill only reads data unless the user asks for a change.

**Use this skill when:** the user asks whether a release can go out, or what is holding it back.

---

## Workflow

### Step 1: Find the release

Call `list_releases` with `search` set to the release name or number (add `project_id` if known). If several match, ask which one. Keep the `release_id`, then call `get_release` for its type, status, and planned date.

### Step 2: Run the readiness check

Call `get_release_readiness(release_id)`. It returns:
- percent of items done against the threshold for the release type (Major and Minor need 100, others 90)
- open stories, tasks, and defects
- open critical or blocker defects (any one makes it not ready)
- items blocked by an unfinished predecessor
- unresolved dependencies
- required checklist items still unchecked

`ready` is false when the release has no items.

### Step 3: Check what readiness does not cover

Run these in parallel where your client allows:

- `get_release_approval_chain(release_id)`: steps still waiting and who they wait on
- `list_release_dependencies(release_id)`: other releases this one waits on
- `list_release_checklist(release_id)`: the full go-live checklist
- `check_release_blackout(release_id)`: whether the planned date falls in a blackout window

### Step 4: Present the verdict

```md
## <Release name> (<type>), planned <date>

**Verdict: Ready | Not ready**

| Check | Result |
| --- | --- |
| Items done | <pct>% (needs <threshold>%) |
| Critical or blocker defects | <count> |
| Blocked items | <count> |
| Dependencies | <resolved>/<total> resolved |
| Required checklist items | <done>/<total> |
| Approvals | <approved>/<total> steps |
| Blackout window | Clear | Conflicts with <window> |

### Blockers
1. <blocker>: <owner>, <what unblocks it>
```

List blockers in the order they should be cleared: critical defects first, then dependencies, then checklist and approvals.

### Step 5: Offer next steps (only with confirmation)

- `generate_release_notes(release_id)` to draft notes. It fails if someone wrote notes by hand unless `confirm=true`, so ask before overwriting.
- `set_release_checklist_item` to tick an item the user confirms is done.
- `transition_release` to move the release to Ready, only when the verdict is Ready and the user asks.
