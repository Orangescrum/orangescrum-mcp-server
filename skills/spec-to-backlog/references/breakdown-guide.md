# Breakdown guide

## Sizing

| Level | Size | Test |
| --- | --- | --- |
| Epic | Weeks to a quarter | Describes an outcome a stakeholder cares about |
| Feature | One to three sprints | A capability a user would notice |
| Story | Fits in one sprint | Demonstrable on its own |
| Subtask | Hours to two days | One person, one clear step |

## Story template

```md
As a <type of user>, I want <capability> so that <benefit>.

### Acceptance criteria
- Given <context>, when <action>, then <result>.
- ...

### Notes
- Out of scope: ...
- Depends on: ...
```

## Good acceptance criteria

- Testable: someone can say pass or fail
- Specific: names the screen, field, or response
- Covers the unhappy path: invalid input, empty states, permissions

## Story points (suggested scale)

| Points | Meaning |
| --- | --- |
| 1 | Trivial, well understood |
| 2 | Small, little uncertainty |
| 3 | A day or two of work |
| 5 | Several days, some unknowns |
| 8 | Large; consider splitting |
| 13 | Too big for one story; split it |

## Splitting a large story

Split by workflow step, by user role, by data variation, or by happy path first and edge cases second. Avoid splitting by technical layer (front end, back end) unless each half is demonstrable.
