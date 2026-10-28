---
name: spec-to-backlog
description: "Break a product spec, PRD, or feature description into an Orangescrum backlog: one epic, its features, user stories with acceptance criteria, and subtasks. When an agent needs to: (1) Turn a spec into structured work items, (2) Write user stories with acceptance criteria, (3) Create an epic and its features and stories in one go, or (4) Estimate and order the resulting backlog. Proposes the breakdown for review first, then creates the hierarchy top-down."
---

# Spec to Backlog

## Keywords
spec to backlog, PRD to stories, break down feature, create epic, user stories, acceptance criteria, backlog grooming, feature breakdown, work breakdown, plan this feature

## Overview

Turn a spec into a clean epic, feature, story, and subtask hierarchy in Orangescrum. The user approves the full breakdown before anything is created.

**Use this skill when:** the user shares a spec, PRD, or feature idea and wants it planned as backlog items.

---

## Workflow

### Step 1: Understand the spec

Identify the goal, the users, the main capabilities, constraints, and anything explicitly out of scope. Ask about gaps that would change the breakdown; don't invent requirements.

### Step 2: Draft the breakdown

Follow [references/breakdown-guide.md](references/breakdown-guide.md):

- **1 epic** for the whole outcome
- **2 to 6 features** for distinct capabilities
- **Stories** per feature, each deliverable in one sprint, written as "As a <user>, I want <capability> so that <benefit>", with acceptance criteria
- **Subtasks** only where a story needs clear technical steps

### Step 3: Review with the user

Show the tree with titles, a one-line summary for each story, and suggested story points. Apply their edits. Do not create anything until they approve.

### Step 4: Find the project

Use `search_projects` or `list_projects` and keep the project id.

### Step 5: Create top-down

1. `create_epic(project_id, title, description, priority)` and keep the returned epic id.
2. For each feature: `create_feature(epic_id, title, description)` and keep each feature id.
3. For each story: `create_story(project_id, title, feature_id, description, story_point)`. Put the acceptance criteria in the description.
4. For each subtask: `create_subtask(parent_task_id=<story id>, title, description, estimated_hours)`.

Create in this order so every child has its parent id. If one call fails, stop, report what was created, and ask how to continue rather than retrying blindly.

### Step 6: Summarize

Return the hierarchy with each item's id. Offer to:
- add dependencies between stories with `add_task_dependency`
- place stories in a sprint with `assign_task_to_sprint`
