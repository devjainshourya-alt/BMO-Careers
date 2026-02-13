# How to Access Chat History in Cursor (BMO Project)

## Where to find the chat list in Cursor

1. **Open the AI / Chat panel**
   - Press **`Ctrl + L`** (Windows) to open the AI panel (secondary sidebar), or  
   - Click the **Chat** or **AI** icon in the left or right sidebar.

2. **Open the chat history list**
   - In the **top-right of the AI panel**, click **"Previous Chats"** (or the clock/history icon), or  
   - Press **`Ctrl + Alt + L`** to open the chat history sidebar.

3. **Use the list**
   - Click any chat in the list to open that thread.  
   - You can rename a chat (pencil icon) or delete it (trash icon on hover).

Chat history is **per workspace**: it is tied to the **folder path** you opened in Cursor (e.g. `C:\Users\...\BMO Career x AI`). Only chats for the currently open folder are shown.

---

## Why your old chats might not appear

Cursor stores chat history in a workspace folder that is chosen by the **exact folder path** you open. Your migrated chats are in the workspace for this path:

- **Path that has your migrated chats:**  
  `C:\Users\Shourya Jain\Desktop\BMO Career x AI`

So your chats will only show if you open the project **from that exact path**.

### Check which folder you have open

- Look at the **window title**: it usually shows the open folder name (e.g. "BMO Career x AI").  
- Or use **File → Open Folder** and see which path is currently open.

### If you opened from a different path

- **Option A (recommended):** Close the project and open it again from:
  - **File → Open Folder** → choose `C:\Users\Shourya Jain\Desktop\BMO Career x AI`
  - Then open the chat list again (**Previous Chats** or **Ctrl + Alt + L**).

- **Option B:** If you must use another path (e.g. `C:\Users\Administrator\Desktop\BMO Career x AI` or `D:\Projects\BMO-Career-x-AI`), then the migrated chat database must be copied into the workspace folder for *that* path. The steps are in [MIGRATION_CHECKPOINT.md](MIGRATION_CHECKPOINT.md) (replace the contents of the *new* workspace folder with the contents of folder `41cb3403b7837b6ea8c6cfc27ef27823`).

---

## Quick checklist

- [ ] Cursor is open with the **BMO Career x AI** project.
- [ ] The project was opened from **`C:\Users\Shourya Jain\Desktop\BMO Career x AI`** (check window title or File → Open Folder).
- [ ] AI panel is open (**Ctrl + L**).
- [ ] Chat history is open via **"Previous Chats"** or **Ctrl + Alt + L**.

If you did the migration by replacing the contents of workspace folder `41cb3403b7837b6ea8c6cfc27ef27823` on the **new** Windows user, and you open the project from the path above, your old chats should appear in that list.

---

## Restore chat history (chats still missing)

If you opened the project from `C:\Users\Shourya Jain\Desktop\BMO Career x AI` and still don't see old chats, the database was likely copied while Cursor had the file open, so the restore didn't take effect. Do this:

1. **Close Cursor completely**  
   Use **File → Exit** (or close all Cursor windows). This releases the lock on `state.vscdb`.

2. **Run the restore script**  
   In PowerShell (Run as Administrator if needed), run:
   ```powershell
   cd "C:\Users\Shourya Jain\Desktop\BMO Career x AI"
   .\scripts\restore-chat-history.ps1
   ```
   If you get an error that the file is in use, Cursor is still running—close it fully and run the script again.

3. **Reopen Cursor**  
   Open the project again from **File → Open Folder** → `C:\Users\Shourya Jain\Desktop\BMO Career x AI`.

4. **Open the chat list**  
   Press **Ctrl + L**, then **Ctrl + Alt + L** (or click **Previous Chats**). Your old chats should appear.

**Note:** You're running Cursor as **Administrator**; the script copies the chat database from the **Shourya Jain** profile into the Administrator workspace so the same project shows the same history.

---

## Chat list shows but content stays on "Loading chat"

If you see your chats in **Previous Chats** but clicking one only shows **"Loading chat"** and the messages never appear, try these steps in order.

### 1. Use the correct project path

Cursor ties the workspace (and its database) to the **exact folder path**. You must open the project from the same path that the restored workspace expects:

- **If you restored into workspace `41cb3403b7837b6ea8c6cfc27ef27823`:**  
  Open **File → Open Folder** and choose  
  `C:\Users\Shourya Jain\Desktop\BMO Career x AI`  
  (or the path where you originally had the project when the backup was made).

- If you open from a different path (e.g. `C:\Users\Administrator\Desktop\BMO Career x AI`), Cursor uses a **different** workspace folder, so the restored DB is not used and chats can appear broken or stuck on "Loading chat".

### 2. Re-run the restore with Cursor fully closed

A copy made while Cursor had the DB open can leave the file locked or inconsistent, so the list may load but individual chats fail.

1. **Close Cursor completely** (File → Exit; check Task Manager for any Cursor process).
2. Run the restore script again:
   ```powershell
   cd "C:\Users\Shourya Jain\Desktop\BMO Career x AI"
   .\scripts\restore-chat-history.ps1
   ```
3. Reopen Cursor and open the project from the **same path** as in step 1.
4. Open **Previous Chats** (Ctrl+Alt+L) and try opening a chat again.

### 3. Export important chats as backup

If content still does not load, the workspace DB may be incompatible or corrupted. Save what you need before any reset:

1. See the Cursor Forum guide: [Exporting chats & prompts from Cursor](https://forum.cursor.com/t/guide-5-steps-exporting-chats-prompts-from-cursor/2825).
2. Export important conversations to text/markdown and store them in the project (e.g. `docs/chat-exports/`).

### 4. Known Cursor issue

"Loading chat" stuck with chat history is a [known Cursor issue](https://forum.cursor.com/t/chat-stuck-on-loading-chat-chat-history-summaries-not-loading/150313), sometimes related to large or migrated history. If the steps above do not help, you can:

- Search or post in the [Cursor Forum](https://forum.cursor.com/) (e.g. "Loading chat", "chat history not loading").
- Contact Cursor support (e.g. hi@cursor.com) and mention migrated workspace storage and that the list loads but content does not.

---

## Chat list shows but clicking a chat does nothing (no response)

If you see the list in **Previous Chats** but clicking a chat has **no effect** (no "Loading chat", no switch to the thread, completely unresponsive), try these in order.

### 1. Use the keyboard instead of the mouse

Sometimes the list responds to keyboard but not clicks:

- With **Previous Chats** open, use **Arrow Up / Arrow Down** to move between chats.
- Press **Enter** to open the selected chat.

If Enter opens the chat, the data is fine and it’s likely a UI/click bug in Cursor.

### 2. Close and reopen the chat history panel

- Press **Ctrl + Alt + L** to close the Previous Chats sidebar.
- Press **Ctrl + Alt + L** again to open it.
- Try clicking a chat again (or use keyboard as above).

### 3. Reload the Cursor window

- Press **Ctrl + Shift + P** to open the Command Palette.
- Type **Reload Window** and run **Developer: Reload Window**.
- After reload, open **Ctrl + L** then **Ctrl + Alt + L** and try opening a chat (click or Enter).

### 4. Full restart

- **File → Exit** (close all Cursor windows).
- Reopen Cursor, open the project from **File → Open Folder** → `C:\Users\Shourya Jain\Desktop\BMO Career x AI`.
- Open the AI panel (**Ctrl + L**), then Previous Chats (**Ctrl + Alt + L**), and try again.

### 5. If it’s still unresponsive

The migrated workspace DB may be in a state where Cursor can show the list but cannot open any thread (no response to click or Enter). In that case:

- **Export what you need:** Use the [Cursor export guide](https://forum.cursor.com/t/guide-5-steps-exporting-chats-prompts-from-cursor/2825) to save important chats to text/markdown (e.g. in `docs/chat-exports/`) before any reset.
- **Report to Cursor:** In the [Cursor Forum](https://forum.cursor.com/) or to hi@cursor.com, mention: **migrated workspace storage**, **chat list visible**, **clicking a chat does nothing** (no loading, no response). That helps distinguish this from the “Loading chat” stuck issue.

---

## Export chat history to files (when the UI does not work)

If you **cannot open any chat** from the list (click and keyboard do nothing), you can still **export the conversation data** from the workspace database into Markdown files in the project.

### Steps

1. **Close Cursor completely** (File → Exit). This releases the lock on the database.

2. **Run the export script** from the project root:
   ```bash
   npm run export:chats
   ```
   Or:
   ```bash
   node scripts/export-chat-history.js
   ```

3. **Optional:** If the script cannot find the database automatically (e.g. you use a different Windows user), pass the path to your workspace `state.vscdb`:
   ```bash
   node scripts/export-chat-history.js --db "C:\Users\YourName\AppData\Roaming\Cursor\User\workspaceStorage\41cb3403b7837b6ea8c6cfc27ef27823\state.vscdb"
   ```
   To find the right folder: open `%APPDATA%\Cursor\User\workspaceStorage`, then open the folder whose `workspace.json` contains the path to this project.

4. **Open the exported chats:**  
   They are saved as Markdown files in **`docs/chat-exports/`** (e.g. `001-Chat 1.md`, `002-Chat 2.md`). Open them in any editor or viewer.

After exporting, you can continue using Cursor; the script only reads the database and does not modify it.
