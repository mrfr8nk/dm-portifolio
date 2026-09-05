---
name: Direct Vite build environment
description: Required environment values for validating the portfolio outside its managed workflow.
---

The portfolio's Vite configuration expects both `PORT` and `BASE_PATH` to be present when a build is invoked directly from the shell.

**Why:** The managed workflow injects these values automatically, but a standalone validation command otherwise fails before Vite loads the config.

**How to apply:** Use the artifact's normal base path and an available build port for direct checks; do not change the project's workflow configuration just to satisfy a one-off build.