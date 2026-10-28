---
name: capture-tasks-from-meeting-notes
description: "Turn meeting notes, transcripts, or a list of action items into Orangescrum tasks with owners, due dates, and priorities. When an agent needs to: (1) Extract action items from meeting notes, (2) Create tasks for each one in the right project, (3) Assign them to the people named, or (4) Set due dates mentioned in the discussion. Matches names to workspace members, confirms the plan with the user, and creates the tasks in one pass."
---

# Capture Tasks from Meeting Notes

## Keywords
meeting notes, action items, create tasks from notes, follow ups, todo from meeting, minutes, transcript to tasks, assign action items, capture tasks, standup notes

## Overview

Read meeting notes, pull out every action item, match each owner to a real Orangescrum user, and create the tasks in the right project. The user reviews the full list before anything is written.

**Use this skill when:** the user pastes notes or a transcript and wants the follow-ups tracked in Orangescrum.

---

## Workflow

### Step 1: Extract action items

Read the notes and list every commitment. See [references/action-item-patterns.md](references/action-item-patterns.md) for the phrasing to look for.

For each item capture:
- **Title**: a short imperative phrase, under 100 characters ("Draft the pricing FAQ")
- **Owner**: the person named, if any
- **Due date**: an explicit date, or a relative one ("by Friday") converted to `YYYY-MM-DD`
- **Priority**: `high` if the notes call it urgent or blocking, otherwise `medium`
- **Context**: one or two sentences from the notes, for the description

Skip discussion points that have no owner and no action.

### Step 2: Find the project

If the user named a project, call `search_projects` with `q` set to that name. Otherwise call `list_projects` and ask which one to use. Keep the project's numeric id.

### Step 3: Match owners to users

Call `list_users` with `search` set to each owner's name or email. Use the returned user id as `assigned_to`.

- Exactly one match: use it.
- Several matches: ask the user which one.
- No match: leave the task unassigned and say so in the summary.

### Step 4: Confirm the plan

Show a table of every task you are about to create:

| # | Title | Owner | Due | Priority |
| --- | --- | --- | --- | --- |

Ask the user to confirm, edit, or drop rows. Do not create anything until they say yes.

### Step 5: Create the tasks

For each confirmed row call `create_task`:

```
create_task(
  project_id="<project id>",
  title="Draft the pricing FAQ",
  description="<context from the notes>",
  assigned_to=<user id>,
  priority="medium",
  due_date="2026-11-06"
)
```

If the user wants the meeting itself recorded, add the full notes as a comment on the first task with `add_task_comment`.

### Step 6: Summarize

Report each created task with its title, owner, due date, and task id. List anything you skipped and why.

---

## Tips

- Run `get_current_user` once when the notes say "I" or "me", so those items go to the user.
- Keep one task per action. Split "Priya and Sam will update the deck and email the client" into two tasks.
- If an item depends on another, offer to link them with `add_task_dependency` after creation.
