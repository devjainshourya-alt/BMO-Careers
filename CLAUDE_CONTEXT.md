# Claude Context - BMO Career x AI Project

## Quick Start for New Conversations

**Paste this when starting a new Claude conversation about this project:**

---

I'm working on the **BMO Careers Website Redesign** project. This is a static HTML/CSS site deployed on GitHub Pages with a Figma-to-code workflow.

**Current task:** [Describe what you're working on]

**Project context:**
- **Figma Design:** File key `iN0dNMMg1zx69dkUsnvkHp`
- **FigJam Feedback Board:** File key `ez9aFR7uZIYi7WIuL1hKA2` 
- **Live Site:** https://devjainshourya-alt.github.io/BMO-Careers/
- **Repo:** https://github.com/devjainshourya-alt/BMO-Careers

**Workflow:** Design feedback comes via FigJam (handwritten + typed notes with screenshots). I use Figma MCP to read the board, implement changes in HTML/CSS, then deploy via `npm run deploy`.

**Reference:** See `.clauderules` file in project or `FIGJAM_FEEDBACK_PROCEDURE.md` for complete workflow.

---

## Project Overview

### What This Is
A portfolio case study project redesigning the BMO careers website with a focus on:
- Modern, accessible design
- Mobile-first responsive approach
- Multi-stakeholder feedback integration
- Clean, maintainable code

### Tech Stack
- **Frontend:** Pure HTML5 + CSS3 (no frameworks)
- **Typography:** Heebo (Google Fonts)
- **Deployment:** GitHub Pages (auto-deploy from main branch)
- **Dev Tools:** Node.js scripts, Browser-Sync for live reload
- **Design Tools:** Figma (design system), FigJam (feedback board)

### Pages
1. **index.html** - Homepage with hero, job listings, career paths, articles, CTA
2. **campus.html** - Campus recruitment with commitments, activities, career paths

---

## How to Use Claude for This Project

### Option 1: Claude.ai with Figma Connector

**Setup:**
1. Enable Figma connector in Claude.ai
2. Paste the quick start context above
3. Ask Claude to read FigJam board or implement feedback

**Example prompts:**
- "Read the latest feedback from the FigJam board and implement the changes"
- "Get the design context for the hero section from Figma and update the HTML/CSS"
- "Review the current index.html and suggest improvements based on the design system"

### Option 2: Claude Code (Command Line)

**Setup:**
1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Navigate to project directory
3. The `.clauderules` file is automatically loaded

**Usage:**
```bash
# Start Claude Code in the project
cd "C:\Users\[YourName]\Desktop\BMO Career x AI"
claude-code

# Ask Claude to implement feedback
> Read the FigJam board and implement the latest design changes

# Deploy after changes
> Deploy the changes with message "Updated hero section spacing"
```

### Option 3: Claude.ai (Manual Context)

If Figma connector is unavailable:
1. Export FigJam feedback screenshots manually
2. Upload screenshots to Claude.ai
3. Describe what needs to change
4. Claude generates HTML/CSS code
5. You copy and apply changes locally
6. Run `npm run deploy`

---

## Common Tasks & How to Ask Claude

### Implementing FigJam Feedback

**With Figma Connector:**
```
"Read the FigJam feedback board (file key ez9aFR7uZIYi7WIuL1hKA2) and 
implement all the design changes. Focus on [specific section] if needed."
```

**Without Figma Connector:**
```
[Upload FigJam screenshots]
"These screenshots show feedback on the hero section. The handwritten notes 
say [transcribe notes]. Please update the HTML/CSS to fix these issues."
```

### Updating Responsive Behavior
```
"The career cards aren't stacking properly on mobile. Review styles.css 
and fix the responsive behavior for screens under 768px."
```

### Adding New Components
```
"Based on the design in Figma (file key iN0dNMMg1zx69dkUsnvkHp), 
create a new 'testimonials' section component following our existing 
design system patterns."
```

### Deployment
```
"Deploy the changes we just made with the commit message: 
'Fix navigation mobile drawer and update footer links'"
```

### Design System Questions
```
"What spacing should I use between the job cards? Check DESIGN_ANNOTATIONS.md 
and tell me the exact pixel values for desktop, tablet, and mobile."
```

---

## Files Claude Should Reference

### Primary Documentation
- `.clauderules` - Complete project context and workflows
- `FIGJAM_FEEDBACK_PROCEDURE.md` - Detailed feedback workflow
- `DESIGN_ANNOTATIONS.md` - Auto-generated spacing and measurements
- `SETUP.md` - Initial setup and configuration

### Code Files
- `index.html` - Homepage structure
- `campus.html` - Campus page structure  
- `styles.css` - All styles (single file)
- `scripts/deploy.js` - Deployment script
- `scripts/figma-annotations.js` - Design extraction script

### When Troubleshooting
- `DEPLOY.md` - Deployment issues
- `GITHUB_PAGES_TROUBLESHOOT.md` - 404 errors, build failures
- `HANDWRITING_OCR.md` - Fallback for handwriting (if MCP unavailable)

---

## Key Figma/FigJam File Keys

**Always use these exact keys when calling Figma MCP tools:**

| Resource | File Key | Node ID | Purpose |
|----------|----------|---------|---------|
| Design File | `iN0dNMMg1zx69dkUsnvkHp` | Varies | Component library, mockups |
| FigJam Board | `ez9aFR7uZIYi7WIuL1hKA2` | `0:1` | Feedback collection |

### Figma MCP Tools
- `get_figjam(fileKey, nodeId)` - Read FigJam content (includes handwriting)
- `get_design_context(fileKey, nodeId)` - Get component code
- `get_screenshot(fileKey, nodeId)` - Generate design screenshots
- `get_metadata(fileKey, nodeId)` - Get structure/hierarchy

---

## Design System Quick Reference

### Spacing Scale
Common gaps extracted from Figma (see `DESIGN_ANNOTATIONS.md` for full list):
- **Extra Small:** 8px
- **Small:** 12px  
- **Medium:** 16px, 20px
- **Large:** 24px, 28px
- **Extra Large:** 32px, 40px

### Section Padding
- **Desktop:** 40px
- **Tablet:** 20px
- **Mobile:** 16px

### Responsive Breakpoints
```css
/* Mobile: default (no media query) */
/* Tablet: min-width: 768px */
/* Desktop: min-width: 1024px */
```

### Typography (Heebo)
- **Hero Title:** 700 weight, large size
- **Section Headers:** 600 weight
- **Body Text:** 400-500 weight
- **CTAs/Buttons:** 600 weight

### Color Usage
- **Primary Blue:** Links, CTAs, accents (BMO brand)
- **Dark Gray/Black:** Headings, body text
- **Light Gray/White:** Backgrounds, cards
- **Category Tags:** Colored labels on job cards

---

## Deployment Workflow

### Standard Process
1. Make changes in HTML/CSS
2. Test locally: `npm run dev:reload`
3. Deploy: `npm run deploy` or `npm run deploy -- "Custom message"`
4. Wait 1-2 minutes for GitHub Pages
5. Verify at: https://devjainshourya-alt.github.io/BMO-Careers/

### Deployment Command Examples
```bash
# Default message
npm run deploy

# Custom message
npm run deploy -- "Fix hero spacing per FigJam feedback"
npm run deploy -- "Update responsive behavior for job cards"
npm run deploy -- "Add campus page commitment section"
```

---

## Tips for Working with Claude

### Be Specific
❌ "Fix the hero section"
✅ "The hero section has 40px too much padding on mobile. Reduce it to 16px to match the design spec in DESIGN_ANNOTATIONS.md"

### Reference Design Sources
❌ "Make it look better"
✅ "Match the spacing in the Figma design (file key iN0dNMMg1zx69dkUsnvkHp, Desktop mockup). The gap between career cards should be 28px on desktop."

### Use Available Context
❌ Start from scratch each time
✅ "Reference the existing component pattern from the job cards when creating the new testimonial cards"

### Deploy Explicitly
❌ Assume deployment happens automatically
✅ "After making these changes, deploy with the message 'Updated navigation and footer'"

---

## Transition from Cursor

If you're coming from Cursor, here's what changed:

| Cursor | Claude |
|--------|--------|
| `.cursorrules` file | `.clauderules` file |
| Automatic rule loading | Manual context paste (claude.ai) or auto-load (Claude Code) |
| Chat history in UI | Export via `npm run export:chats` |
| Built-in MCP servers | Figma connector in claude.ai |
| Composer mode | Just describe the task |
| Agent mode | Claude Code command line |

### What Stays the Same
- ✅ Project structure and files
- ✅ npm scripts and deployment
- ✅ Figma/FigJam file keys
- ✅ Design annotations and documentation
- ✅ HTML/CSS codebase

### What You Need to Adapt
- 🔄 Paste project context in new conversations
- 🔄 Enable Figma connector in claude.ai settings
- 🔄 Explicitly reference `.clauderules` if needed
- 🔄 Upload screenshots if Figma MCP unavailable

---

## Emergency Reference

### Project Location
```
C:\Users\[YourUsername]\Desktop\BMO Career x AI
```

### Quick Commands
```bash
# Start development
cd "C:\Users\[YourUsername]\Desktop\BMO Career x AI"
npm run dev:reload

# Update design annotations
npm run figma:annotations:full

# Deploy changes
npm run deploy -- "Your commit message"
```

### Key Files to Never Delete
- ✅ `.clauderules` - Project configuration
- ✅ `DESIGN_ANNOTATIONS.md` - Design specifications
- ✅ `FIGJAM_FEEDBACK_PROCEDURE.md` - Workflow documentation
- ✅ `package.json` - Dependencies and scripts
- ✅ `.env` - Figma API credentials (private)

### If Something Breaks
1. Check `GITHUB_PAGES_TROUBLESHOOT.md` for deployment issues
2. Verify `.env` has Figma credentials
3. Ensure `node_modules` exists (run `npm install` if missing)
4. Check that Git remote is configured: `git remote -v`

---

## Getting Help from Claude

### Starting a Conversation
1. Open claude.ai or use Claude Code
2. Paste the "Quick Start" section from the top of this document
3. Describe your current task or question
4. Claude will use the project context to assist

### Example Conversation Starters

**For Design Implementation:**
```
[Paste Quick Start]
I need to implement the latest FigJam feedback. Can you read the board 
and tell me what changes need to be made?
```

**For Bug Fixes:**
```
[Paste Quick Start]
The mobile navigation drawer isn't closing when I click outside it. 
Can you review the HTML/CSS and suggest a fix?
```

**For New Features:**
```
[Paste Quick Start]
I need to add a new "Benefits" section to the homepage. Can you create 
the HTML and CSS following our existing design patterns?
```

---

## Summary

**This project has everything set up for smooth Claude integration:**
- ✅ Comprehensive `.clauderules` file
- ✅ Complete documentation
- ✅ Figma MCP compatibility
- ✅ Automated deployment
- ✅ Design annotations extracted

**To continue development:**
1. Start a Claude conversation
2. Paste the Quick Start context
3. Describe what you need
4. Claude handles the rest (reading designs, writing code, deploying)

**Remember:** The `.clauderules` file contains all the project knowledge. Reference it anytime you need to understand the workflow or design system.
