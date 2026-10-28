---
name: generate-status-report
description: "Generate a project status report from live Orangescrum data: progress, completed and open work, overdue items, the active sprint, and time logged. When an agent needs to: (1) Write a weekly or sprint status update, (2) Summarize progress for stakeholders, (3) List overdue or blocked work, or (4) Report hours logged on a project. Pulls tasks, sprints, and timelogs, then writes a concise report in the format the user asks for."
---

# Generate Status Report

## Keywords
status report, weekly update, project status, progress report, stakeholder update, what got done, overdue tasks, project health, sprint summary, hours logged

## Overview

Build an accurate status report from current project data rather than memory. The report covers what was completed, what is in progress, what is late, and what is at risk.

**Use this skill when:** the user asks for a status update, progress summary, or report on a project.

---

## Workflow

### Step 1: Identify the project and period

Find the project with `search_projects` (by name) or `list_projects`. Ask for the reporting period if it is not clear; default to the last 7 days. Call `get_project` for the project's name, owner, and dates.

### Step 2: Gather tasks

Call `list_tasks_v2` with the numeric `project_id` and page through results with `page` and `limit`:

- `status="completed,closed"` for finished work
- `status="open,in_progress,pending"` for work still open

For keyword-focused reports ("status of the payments work"), use `search_tasks` with `q` and `project_id`.

From the open tasks, flag:
- **Overdue**: `due_date` before today
- **High priority** still open
- **Unassigned** work

### Step 3: Check the active sprint

Call `list_sprints` with the `project_id` (default `status` is active). If there is one, call `get_sprint` for its dates and description. Skip this step if the project does not use sprints or the tool reports Sprints are not on the workspace plan.

### Step 4: Add time logged (optional)

Call `list_timelogs` with `project_id`, `from`, and `to` set to the period. Total the hours and note the top contributors.

### Step 5: Write the report

Use the template the user asks for. Default to the one in [references/report-templates.md](references/report-templates.md). Keep it short: stakeholders read the first five lines.

### Step 6: Offer next steps

Offer to post the report as a comment on a tracking task with `add_task_comment`, or to save it as project context with `add_project_context`.

---

## Rules

- Quote numbers from tool results only. Never estimate counts.
- Call out data you could not fetch (for example, a missing `mcp:timelogs.read` scope) instead of leaving a silent gap.
- Do not change any task while building a report.
