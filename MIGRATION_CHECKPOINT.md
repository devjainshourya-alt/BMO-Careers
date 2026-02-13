# Migration Checkpoint — Switching to a New Windows User Profile

This document is your **checkpoint** for resuming the BMO Career x AI project on a new Windows user profile. Follow these steps to carry forward the project, context, and Cursor setup without losing progress.

---

## Overview: What Needs to Migrate

| Category | Location (old user) | Migrates with project? |
|----------|---------------------|------------------------|
| Project source code | `Desktop\BMO Career x AI\` | ✅ Yes (copy folder) |
| Project rules | `.cursor\rules\` | ✅ Yes (inside project) |
| Chat history & Composer | `%APPDATA%\Cursor\User\workspaceStorage\` | ⚠️ Manual copy |
| Agent transcripts | `%USERPROFILE%\.cursor\projects\` | ⚠️ Manual copy |
| Agent skills | `%USERPROFILE%\.cursor\skills-cursor\` | ⚠️ Manual copy |
| MCP config (Figma, Pencil) | `%USERPROFILE%\.cursor\mcp.json` | ⚠️ Manual copy |
| Plans (todo/context) | `%USERPROFILE%\.cursor\plans\` | ⚠️ Optional |
| Cursor settings | `%APPDATA%\Cursor\User\settings.json` | ⚠️ Optional |

---

## Step 1: Copy the Project Folder

**On the old user profile (Shourya Jain):**

1. Copy the entire project folder to a **path that does not include your username**.
   - **Recommended:** `C:\Dev\BMO-Career-x-AI` or `D:\Projects\BMO-Career-x-AI`
   - **Why?** Cursor ties chat history to the project path. If the new user opens the project from the same path, chat history can be restored correctly.
2. If you use a drive path like `D:\Projects\`, create it and copy:
   ```
   From: C:\Users\Shourya Jain\Desktop\BMO Career x AI
   To:   D:\Projects\BMO-Career-x-AI   (or C:\Dev\BMO-Career-x-AI)
   ```
3. Ensure you copy **everything**, including:
   - `.cursor\rules\` (FigJam feedback rule)
   - `node_modules\` (or run `npm install` on the new profile)
   - All `.md` files (FIGJAM_FEEDBACK_PROCEDURE.md, DEPLOY.md, etc.)

---

## Step 2: Export/Copy Cursor Chat History (Workspace Storage)

**Important:** Chat history is stored per workspace, and the workspace is identified by the **project folder path**.

### Option A: Same Path Strategy (Recommended)

If you copied the project to `D:\Projects\BMO-Career-x-AI` (or another non-username path):

1. **On the OLD user**, copy this folder:
   ```
   %APPDATA%\Cursor\User\workspaceStorage\41cb3403b7837b6ea8c6cfc27ef27823
   ```
   Full path:  
   `C:\Users\Shourya Jain\AppData\Roaming\Cursor\User\workspaceStorage\41cb3403b7837b6ea8c6cfc27ef27823`

2. Save it to a shared location (e.g. USB, `D:\Migration\cursor-workspace-BMO`).

3. **On the NEW user:**
   - Install Cursor and log in.
   - Open the project from `D:\Projects\BMO-Career-x-AI`.
   - Cursor will create a new workspace folder. The hash will be **different** because the path is different (`D:\...` vs `C:\Users\Shourya Jain\Desktop\...`).
   - To restore chat: after opening the project once, find the new workspace folder in  
     `%APPDATA%\Cursor\User\workspaceStorage\` (check each `workspace.json` for your project path).
   - Replace the **contents** of that new folder (especially `state.vscdb`) with the contents of the old folder.

### Option B: Manual Export (If Option A Fails)

Before switching users:

1. Open Cursor and the BMO project.
2. Open the Cursor Forum guide: [Exporting chats & prompts from Cursor](https://forum.cursor.com/t/guide-5-steps-exporting-chats-prompts-from-cursor/2825).
3. Export important chats to text/markdown and keep them in the project, e.g. in `docs/chat-exports/`.

---

## Step 3: Copy Cursor Project Data (Agent Transcripts & Context)

**On the old user**, copy:

```
From: C:\Users\Shourya Jain\.cursor\projects\c-Users-Shourya-Jain-Desktop-BMO-Career-x-AI
To:   D:\Migration\cursor-project-BMO   (temporary holding)
```

**On the new user**, after Cursor is installed:

1. Cursor will create a project folder under  
   `C:\Users\[NewUsername]\.cursor\projects\`
2. The folder name will be based on the new project path (e.g. `d-Projects-BMO-Career-x-AI`).
3. Copy the contents of your saved `cursor-project-BMO` folder into that new project folder to restore agent transcripts and related data.

---

## Step 4: Copy Agent Skills

**On the old user**, copy:

```
From: C:\Users\Shourya Jain\.cursor\skills-cursor\
To:   D:\Migration\cursor-skills\
```

**On the new user:**

1. Create `C:\Users\[NewUsername]\.cursor\skills-cursor\` if it doesn’t exist.
2. Copy the contents from `D:\Migration\cursor-skills\` into it.

---

## Step 5: Copy MCP Configuration

**On the old user**, copy:

```
From: C:\Users\Shourya Jain\.cursor\mcp.json
To:   D:\Migration\mcp.json
```

**On the new user:**

1. Copy `mcp.json` to `C:\Users\[NewUsername]\.cursor\mcp.json`.
2. Open `mcp.json` and fix the Pencil path:
   - Old: `c:\\Users\\Shourya Jain\\.cursor\\extensions\\highagency.pencildev-...\\out\\mcp-server-windows-x64.exe`
   - New: `c:\\Users\\[NewUsername]\\.cursor\\extensions\\highagency.pencildev-...\\out\\mcp-server-windows-x64.exe`
   - The Pencil extension folder name may differ (e.g. `0.6.23` vs newer). Check `%USERPROFILE%\.cursor\extensions\` for the exact path.
3. If you use Figma MCP, keep the `FIGMA_API_KEY` as is (it’s account-linked, not user-specific).

---

## Step 6: (Optional) Copy Plans and Settings

- **Plans:** Copy `C:\Users\Shourya Jain\.cursor\plans\` to the new user’s `.cursor\plans\` if you want to keep prior plan files.
- **Settings:** Copy  
  `C:\Users\Shourya Jain\AppData\Roaming\Cursor\User\settings.json`  
  to the new user’s equivalent path if you want identical Cursor settings.

---

## Step 7: Final Setup on New User

1. Install Node.js (if not already installed).
2. Open the project in Cursor: `File → Open Folder` → select `D:\Projects\BMO-Career-x-AI` (or your chosen path).
3. In the project root, run:
   ```bash
   npm install
   ```
4. Verify:
   - Rules: `.cursor/rules/figjam-feedback.mdc` should be active.
   - Figma MCP: Open the FigJam board to confirm connection.
   - Pencil MCP: Ensure the path in `mcp.json` is correct.
5. Run `npm run deploy` (or your usual deploy command) to confirm deployment.

---

## Quick Reference: Paths for “Shourya Jain” Profile

| Item | Path |
|------|------|
| Project | `C:\Users\Shourya Jain\Desktop\BMO Career x AI` |
| Workspace storage (BMO) | `C:\Users\Shourya Jain\AppData\Roaming\Cursor\User\workspaceStorage\41cb3403b7837b6ea8c6cfc27ef27823` |
| Cursor project data | `C:\Users\Shourya Jain\.cursor\projects\c-Users-Shourya-Jain-Desktop-BMO-Career-x-AI` |
| Agent skills | `C:\Users\Shourya Jain\.cursor\skills-cursor\` |
| MCP config | `C:\Users\Shourya Jain\.cursor\mcp.json` |
| Cursor User data | `C:\Users\Shourya Jain\AppData\Roaming\Cursor\User\` |

---

## Resuming Development

After migration, you can resume work using:

- **FIGJAM_FEEDBACK_PROCEDURE.md** — Standard workflow for design feedback.
- **DEPLOY.md** — GitHub Pages deployment steps.
- **SETUP.md** — Project and Figma/FigJam setup.
- **This file** — Migration steps and path reference.

The AI will use the project rules (including the FigJam feedback procedure) as long as `.cursor/rules/` is present in the project and Cursor is opened on the correct folder.
