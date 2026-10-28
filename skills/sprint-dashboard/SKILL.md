---
name: sprint-dashboard
description: "Show how the active Orangescrum sprint is tracking: days left, work done versus remaining, unassigned and overdue tasks, and what is likely to slip. When an agent needs to: (1) Check sprint progress, (2) Find sprint risks before standup or review, (3) Rebalance work across the team, or (4) Move tasks into or out of a sprint. Reads the sprint and its tasks and, on request, reassigns tasks between sprints."
---

# Sprint Dashboard

## Keywords
sprint status, sprint progress, current sprint, sprint health, burndown, will we finish the sprint, sprint risks, carry over, move to next sprint, sprint board

## Overview

Give a quick, honest picture of the active sprint and flag the work most likely to slip. Sprints are available on Orangescrum projects whose workspace plan includes the Sprints module.

**Use this skill when:** the user asks how a sprint is going, prepares for standup or sprint review, or wants to move work between sprints.

---

## Workflow

### Step 1: Find the sprint

1. Find the project with `search_projects` or `list_projects`.
2. Call `list_sprints` with the `project_id`. The default returns active sprints.
3. If there is more than one, ask which. If there is none, offer `list_sprints` with `status="all"` to show the next planned sprint.
4. Call `get_sprint` with the `sprint_id` for its title, description, dates, and state.

### Step 2: Collect the sprint's tasks

Call `list_tasks_v2` with the `sprint_id`, paging with `page` and `limit` (up to 100) until `has_more` is false. Each item carries its workflow `status`, `status_bucket`, assignee, and due date, which is enough for the next steps. Call `get_task` only for the tasks you need more detail on, such as story points or estimates.

### Step 3: Measure progress

From the sprint's tasks compute:

- **Done vs total** (count, and story points when the tasks have them)
- **Days elapsed vs days total**
- **Expected done by today** = total x (days elapsed / days total)

If done is well below expected, the sprint is at risk.

### Step 4: Flag risks

For each open sprint task, flag:

- **Overdue**: due date in the past
- **Unassigned**
- **Blocked**: `list_task_dependencies` shows an unfinished prerequisite
- **Large and not started**: high estimate or story points, still in the first status

### Step 5: Present the dashboard

```md
## <Sprint name> (<start> to <end>), day <n> of <total>

Progress: <done>/<total> tasks (<pct>%), expected about <expected> by today. <On track | At risk>

### At risk
| Task | Owner | Why |
| --- | --- | --- |

### Unassigned
- ...

### Suggested actions
- ...
```

### Step 6: Act on request only

If the user asks to move work, confirm the list, then call `assign_task_to_sprint` with the `task_id` and target `sprint_id` (leave `sprint_id` empty to move a task back to the backlog). To close the sprint, use `complete_sprint` only after the user confirms.

---

## Tips

- `assign_task_to_sprint` takes top-level tasks only. Move a subtask by moving its parent.
- Use `list_task_statuses` for the project's real workflow names before describing a status.
