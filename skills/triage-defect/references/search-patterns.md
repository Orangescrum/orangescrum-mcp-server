# Defect search patterns

`list_defects` matches `search` against the title and tags; a number also matches the BUG number.

## Use key terms, not sentences

- Good: `timeout checkout`
- Good: `NullReference refund`
- Poor: `users are getting a timeout error when they try to check out`

## Search in layers

1. **Error-focused**: the exception or error code
2. **Component-focused**: the screen or service, with `open_only=true`
3. **Symptom-focused**: what the user sees ("blank page", "not saving")

## Useful filters

| Filter | Use it to |
| --- | --- |
| `open_only=true` | Find live duplicates |
| `severity="critical,blocker"` | Check for an existing incident |
| `case_id` | Find defects raised against a specific test case |
| `run_id` | Find defects from one test run |
| `assigned_to` | See what a developer already has |

## Signals of a regression

- A closed defect with the same signature
- A `fixed_in_version` earlier than the version where it reappeared
- A matching root cause in the resolution note
