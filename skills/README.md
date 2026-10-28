# Orangescrum MCP Server skills

The skills in this directory target the Orangescrum MCP endpoint,
`https://mcp.orangescrum.com/mcp/partner`. They are what every packaged plugin installs, and each one
lives at `skills/<name>/SKILL.md` per the [Agent Skills](https://agent-plugins.org/) convention.

| Skill | What it does | Scopes it uses |
| --- | --- | --- |
| [`capture-tasks-from-meeting-notes`](capture-tasks-from-meeting-notes/SKILL.md) | Turns meeting notes into assigned tasks | `mcp:projects.read`, `mcp:users.read`, `mcp:tasks.write` |
| [`generate-status-report`](generate-status-report/SKILL.md) | Builds a project status report from live tasks, sprints, and timelogs | `mcp:projects.read`, `mcp:tasks.read`, `mcp:sprints.read`, `mcp:timelogs.read` |
| [`sprint-dashboard`](sprint-dashboard/SKILL.md) | Shows how the active sprint is tracking and what is at risk | `mcp:sprints.read`, `mcp:tasks.read` |
| [`spec-to-backlog`](spec-to-backlog/SKILL.md) | Breaks a spec into an epic, features, stories, and subtasks | `mcp:epics.write`, `mcp:tasks.write` |
| [`triage-defect`](triage-defect/SKILL.md) | Checks a bug report for duplicates, then files or updates a defect in Test Case Management | `mcp:tests.read`, `mcp:tests.write` |
| [`release-readiness-check`](release-readiness-check/SKILL.md) | Decides whether a release can go out and lists every blocker | `mcp:releases.read` |

## Conventions every skill follows

* **Exact tool names.** Tools are called by their `snake_case` names (`create_task`, `get_release_readiness`).
  `npm run validate` fails if a skill references a name the server does not expose.
* **IDs come from the server.** Projects, tasks, and sprints accept a numeric id or a `uniq_id`; both are
  returned by the list and search tools. Never guess an id.
* **Confirm before writing.** Each skill shows the user what it plans to create or change and waits for a
  yes before calling a write tool. Nothing is deleted without an explicit request.
* **Missing scope is not an error to work around.** A `403` naming a scope means the user did not grant it.
  Tell them which scope to approve and stop.

For the current tool reference, see
[Tools](https://helpdesk.orangescrum.com/guide/mcp/tools).
