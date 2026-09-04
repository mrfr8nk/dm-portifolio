---
name: Fallback content boundary
description: The rule separating public starter content from persisted admin-managed records.
---

Starter content is a public presentation fallback, not a second editable data source. Admin views must always show the database response, while public views may show starter records only when the corresponding saved section is empty and its fallback setting is enabled.

**Why:** Starter IDs do not exist in MongoDB, so exposing them to admin CRUD controls would make edits and deletes fail or mislead the user about what was saved.

**How to apply:** Keep fallback selection at the public data-consumption boundary. If a new content hook is shared with admin screens, explicitly prevent starter records from appearing on admin routes.