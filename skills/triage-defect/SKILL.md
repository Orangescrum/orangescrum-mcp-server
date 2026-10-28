---
name: triage-defect
description: "Triage a bug report or error message against Orangescrum Test Case Management: search for duplicates, check whether it was fixed before, then file a well-structured defect or add details to an existing one. When an agent needs to: (1) Triage a bug report or error, (2) Check if a defect is a duplicate, (3) Find similar past defects and how they were resolved, (4) Create a new defect with severity, steps to reproduce, and environment, or (5) Link related defects."
---

# Triage Defect

## Keywords
triage bug, report bug, file a defect, is this a duplicate, similar defects, create defect, log bug, error message, regression, has this been reported, test case management defect, link duplicate

## Overview

Avoid duplicate defects and make every new one actionable. Search Test Case Management first, then either update the existing defect or create a new one with full context.

**Use this skill when:** the user shares an error, stack trace, or bug description and wants it tracked.

---

## Workflow

### Step 1: Extract key information

From the report, pull out:
- **Error signature**: exception name, error code, or exact message fragment
- **Component**: the screen, service, or feature affected
- **Environment**: production, staging, browser, device, app version
- **Symptoms and impact**: what the user sees and who is affected

### Step 2: Search for duplicates

Run several narrow searches with `list_defects`, since duplicates often use different wording:

```
list_defects(project_id="<project>", search="timeout checkout", limit=20)
list_defects(project_id="<project>", search="<error code>", limit=20)
list_defects(project_id="<project>", search="<component>", open_only=true, limit=20)
```

Include closed defects in at least one search: a closed match can mean a regression. Use `get_defect` to read the promising matches. See [references/search-patterns.md](references/search-patterns.md).

### Step 3: Decide

| Confidence | Signal | Action |
| --- | --- | --- |
| Duplicate | Same error and component, recent | Recommend updating the existing defect |
| Likely duplicate | Similar error, slightly different context | Show it and let the user decide |
| Regression | Matches a closed defect | New defect, related to the old one |
| New | No meaningful match | New defect |

Present the matches with their BUG number, title, status, and why they match. Wait for the user's choice.

### Step 4a: Update the existing defect

Add the new occurrence with `add_test_comment`, including environment, timestamp, and any new reproduction detail. Update fields with `update_defect` only if the user asks (for example, raising severity).

### Step 4b: Create a new defect

Draft it and confirm with the user, then call `create_defect`:

```
create_defect(
  project_id="<project>",
  title="Checkout times out after 30s when the cart has more than 50 items",
  description="<summary and impact>",
  steps_to_reproduce="1. ...\n2. ...",
  expected="Order is placed",
  actual="Spinner for 30s, then 'Request timed out'",
  severity="critical",
  priority="high",
  environment="staging, Chrome 130",
  found_in_version="4.2.0"
)
```

Use the workspace's own severity and priority values; `list_test_lookups` returns them.

### Step 5: Link related defects

For a regression or near-duplicate, call `add_defect_relation` with `relation` set to `duplicate_of`, `relates`, `blocks`, or `blocked_by`.

### Step 6: Summarize

Report the defect's BUG number and title, what you created or updated, and any related defects you linked.
