# Cursor → Claude Transition Checklist

## ✅ What's Already Done

- [x] Project files copied and organized
- [x] Documentation reviewed (SETUP.md, DEPLOY.md, FIGJAM_FEEDBACK_PROCEDURE.md, etc.)
- [x] Scripts extracted (deploy.js, figma-annotations.js)
- [x] Cursor rules analyzed (figjam-feedback.mdc)
- [x] `.clauderules` file created with complete project context
- [x] `CLAUDE_CONTEXT.md` created for reference

---

## 🚀 Next Steps for You

### 1. Copy Files to Your Project Directory

Copy these new files to your project root:

```
C:\Users\Shourya Jain\Desktop\BMO Career x AI\
├── .clauderules              ← NEW: Copy this
├── CLAUDE_CONTEXT.md          ← NEW: Copy this
└── CURSOR_TO_CLAUDE_TRANSITION.md  ← NEW: This file
```

**How to copy:**
- Claude will provide download links for these files
- Save them to your project directory
- Keep your existing `.cursor` folder (don't delete it)

---

### 2. Choose Your Claude Interface

You have three options:

#### Option A: Claude.ai (Web/Desktop App) - RECOMMENDED FOR YOU
**Best for:** Visual feedback workflow, Figma integration

**Setup:**
1. Open [claude.ai](https://claude.ai)
2. Click your profile → Settings → Connections
3. **Enable the Figma connector**
4. Connect your Figma account

**Usage:**
```
1. Start new conversation
2. Paste the "Quick Start" from CLAUDE_CONTEXT.md
3. Ask: "Read the FigJam board and show me the latest feedback"
4. Claude reads the board and implements changes
5. Copy code back to your project files
6. Run: npm run deploy
```

**Pros:**
- ✅ Figma MCP works out-of-the-box
- ✅ Visual interface for reviewing code
- ✅ Can upload screenshots for reference
- ✅ No terminal setup needed

**Cons:**
- ⚠️ Need to manually copy code to files
- ⚠️ Context doesn't persist between conversations (need to paste Quick Start each time)

---

#### Option B: Claude Code (Command Line)
**Best for:** Direct file editing, automated workflows

**Setup:**
```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Navigate to project
cd "C:\Users\Shourya Jain\Desktop\BMO Career x AI"

# Run Claude Code
claude-code
```

**Usage:**
```
> Read the FigJam feedback board and implement the changes

# Claude directly edits your files
# Then deploy:
> Deploy with message "Updated hero section per feedback"
```

**Pros:**
- ✅ Automatically reads `.clauderules`
- ✅ Directly edits files (no copy/paste)
- ✅ Context persists in terminal session
- ✅ Can run npm scripts directly

**Cons:**
- ⚠️ Command line interface (less visual)
- ⚠️ Need to install CLI tool
- ⚠️ May need to configure Figma MCP separately

---

#### Option C: Hybrid Approach (RECOMMENDED)
**Use Claude.ai for design review + Claude Code for implementation**

**Workflow:**
1. **In Claude.ai:** Read FigJam board, discuss changes
2. **In Claude Code:** Implement the changes directly in files
3. **In Claude.ai:** Review and refine
4. **In terminal:** `npm run deploy`

---

### 3. Test Your Setup

#### Test 1: Basic Conversation
1. Open Claude.ai or Claude Code
2. Paste the Quick Start from `CLAUDE_CONTEXT.md`
3. Ask: "What is this project about?"
4. Claude should respond with BMO careers site details

✅ **If this works:** Context is loading correctly

---

#### Test 2: Read FigJam Board (Requires Figma Connector)
1. Enable Figma connector in claude.ai
2. Ask: "Read the FigJam feedback board (file key ez9aFR7uZIYi7WIuL1hKA2) and summarize the latest feedback"
3. Claude should fetch and describe the board content

✅ **If this works:** Figma integration is working

---

#### Test 3: Make a Small Change
1. Ask Claude: "Add a comment to index.html at line 1 that says 'BMO Careers Homepage'"
2. Get the code from Claude
3. Apply it to your `index.html`
4. Run: `npm run deploy -- "Test deployment from Claude"`
5. Check: https://devjainshourya-alt.github.io/BMO-Careers/

✅ **If this works:** Full workflow is operational

---

### 4. Enable Figma Connector (IMPORTANT)

**For claude.ai:**
1. Click your profile icon (top-right)
2. Go to **Settings**
3. Click **Connections** (left sidebar)
4. Find **Figma** in the list
5. Click **Connect**
6. Log in to Figma
7. Authorize Claude to access your files

**Why this matters:**
- Without this, Claude can't read your FigJam board
- You'd have to manually screenshot and upload feedback
- The whole automated workflow depends on this

---

### 5. Update Your .env File (If Needed)

Your `.env` file should have:
```
FIGMA_ACCESS_TOKEN=your_token_here
FIGMA_FILE_KEY=iN0dNMMg1zx69dkUsnvkHp
FIGJAM_FILE_KEY=ez9aFR7uZIYi7WIuL1hKA2
```

**If using Claude.ai with Figma connector:** You don't need the token in `.env`
**If using Claude Code or API:** You may need to add Figma token to environment

---

### 6. Workflow Comparison

#### Old Cursor Workflow:
```
1. Open Cursor
2. Cursor auto-loads .cursorrules
3. Ask in Composer: "Implement FigJam feedback"
4. Cursor uses MCP to read board
5. Cursor edits files directly
6. You deploy via terminal
```

#### New Claude Workflow:
```
1. Open claude.ai
2. Paste Quick Start context
3. Enable Figma connector
4. Ask: "Read FigJam board and implement feedback"
5. Claude reads board via Figma connector
6. Copy code to your files
7. Run: npm run deploy
```

#### Optimized Claude Workflow (With Claude Code):
```
1. Open terminal in project
2. Run: claude-code
3. .clauderules auto-loads
4. Ask: "Implement FigJam feedback"
5. Claude edits files directly
6. Claude runs: npm run deploy
```

---

## 🎯 Common Tasks - Cursor vs Claude

### Reading FigJam Feedback

**Cursor:**
```
[Auto-loads rule]
You: "Check FigJam for new feedback"
Cursor: [Calls get_figjam, shows results]
```

**Claude.ai:**
```
[Paste Quick Start]
You: "Read the FigJam board (ez9aFR7uZIYi7WIuL1hKA2) for new feedback"
Claude: [Uses Figma connector, shows results]
```

**Claude Code:**
```
You: "Check FigJam for new feedback"
Claude: [Reads .clauderules, calls tools, shows results]
```

---

### Implementing Design Changes

**Cursor:**
```
You: "Fix the hero section spacing as shown in FigJam"
Cursor: [Reads board, edits files]
You: npm run deploy
```

**Claude.ai:**
```
You: "Fix the hero section spacing as shown in FigJam"
Claude: [Generates code]
You: [Copy to files]
You: npm run deploy
```

**Claude Code:**
```
You: "Fix the hero section spacing as shown in FigJam and deploy"
Claude: [Edits files, runs deploy script]
```

---

### Deploying Changes

**All Methods:**
```bash
npm run deploy -- "Your commit message"
```

---

## 📚 Reference Files

Keep these handy:

| File | Purpose | When to Use |
|------|---------|-------------|
| `.clauderules` | Complete project context | Auto-loaded by Claude Code |
| `CLAUDE_CONTEXT.md` | Quick reference guide | Starting conversations in claude.ai |
| `FIGJAM_FEEDBACK_PROCEDURE.md` | Detailed workflow | When you need step-by-step |
| `DESIGN_ANNOTATIONS.md` | Spacing & measurements | Implementing exact designs |
| `DEPLOY.md` | Deployment guide | Fixing deployment issues |

---

## 🔧 Troubleshooting

### Claude doesn't know about my project
**Fix:** Paste the Quick Start from `CLAUDE_CONTEXT.md`

### Claude can't read FigJam
**Fix:** Enable Figma connector in Settings → Connections

### Changes aren't deploying
**Fix:** Check `GITHUB_PAGES_TROUBLESHOOT.md`

### "File not found" errors
**Fix:** Ensure you're in the project directory before running commands

### Want to go back to Cursor
**Fix:** Your `.cursor` folder is intact - just open in Cursor again

---

## ✨ Pro Tips

### 1. Create a "Quick Start Snippet"
Save the Quick Start text somewhere easy to copy (Notes app, text file on desktop)

### 2. Use Specific Prompts
❌ "Fix the site"
✅ "Fix the hero section spacing on mobile - reduce padding from 40px to 16px per DESIGN_ANNOTATIONS.md"

### 3. Reference Files Explicitly
"Check DESIGN_ANNOTATIONS.md for the exact gap between job cards"

### 4. One Task at a Time
Break complex changes into smaller requests for better results

### 5. Keep Documentation Updated
If you add new features, update the `.clauderules` file

---

## 📊 Transition Status

### What You Already Have
- [x] Complete project documentation
- [x] Working deployment pipeline
- [x] Figma design system
- [x] FigJam feedback workflow
- [x] `.clauderules` file
- [x] Context documentation

### What You Need to Do
- [ ] Copy `.clauderules` and `CLAUDE_CONTEXT.md` to project
- [ ] Choose Claude interface (claude.ai / Claude Code)
- [ ] Enable Figma connector in claude.ai
- [ ] Test basic conversation
- [ ] Test FigJam reading
- [ ] Test deployment
- [ ] Continue development! 🎉

---

## 🎉 You're Ready!

Your transition is complete. You have:
✅ All your Cursor context preserved
✅ `.clauderules` file for Claude Code
✅ Quick Start for claude.ai conversations
✅ Complete documentation
✅ Working deployment pipeline

**Next:** Choose your interface, enable Figma connector, and start your first Claude conversation!

---

## 📞 Need Help?

If something isn't working:
1. Check this file's Troubleshooting section
2. Review `CLAUDE_CONTEXT.md` for examples
3. Ask Claude: "I'm having trouble with [specific issue]"
4. Reference the appropriate .md file in your project

Remember: Claude can help you troubleshoot! Just describe the problem and reference your documentation files.
