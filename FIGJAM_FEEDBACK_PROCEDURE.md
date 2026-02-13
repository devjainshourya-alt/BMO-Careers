# FigJam Feedback — Standard Procedure

This document defines the standard workflow for design feedback and implementation in the BMO Career Site project. Feedback is provided via a FigJam board and parsed by the AI to implement changes.

---

## Feedback Board

**FigJam URL:** [Feedback, Inputs and Instructions - BMO Career Site Design and Development](https://www.figma.com/board/ez9aFR7uZIYi7WIuL1hKA2/)

**File key:** `ez9aFR7uZIYi7WIuL1hKA2`

---

## How Feedback Is Added

You will add feedback to the FigJam board using:

1. **Browser screenshots** — Screenshots of the live site showing layout issues, responsive behaviour, or areas that need changes
2. **Design file screens** — Screens or frames from the original Figma design file for reference (what the design should look like)
3. **Handwritten instructions** — Comments and instructions written with a stylus directly on the FigJam board

Group related items: place screenshots, design references, and handwritten notes together so the AI can correlate them.

---

## How the AI Parses and Acts on Feedback

### Parsing Method

- **Handwritten content:** The AI uses the **Figma MCP `get_figjam`** tool. This tool renders FigJam content as images, which the AI can read—including handwritten text.
- **Typed content:** Also parsed via `get_figjam`; additionally, `node scripts/figma-annotations.js --include-file` extracts typed sticky notes and comments into `DESIGN_ANNOTATIONS.md`.

### Standard Procedure for the AI

When working on design feedback or layout changes:

1. **Access the FigJam board**  
   Call `get_figjam` with file key `ez9aFR7uZIYi7WIuL1hKA2` and node ID `0:1` (or the relevant section node) to fetch the latest feedback.

2. **Parse instructions**  
   - Read handwritten notes from the rendered images  
   - Extract typed sticky notes, shapes, and comments  
   - Correlate instructions with nearby screenshots and design references

3. **Transcribe and correct**  
   If handwritten instructions contain spelling errors, transcribe them into clean text and apply corrections before implementing.

4. **Implement changes**  
   - Use screenshots to identify the current state and what to change  
   - Use design references for target appearance  
   - Apply layout, CSS, and HTML updates per the instructions

5. **Push changes to the site**  
   Run `npm run deploy` (or `npm run deploy -- "Fix hero spacing"` with a custom message). This commits and pushes to the remote; GitHub Pages deploys automatically. See [DEPLOY.md](DEPLOY.md) for setup.

6. **Return results**  
   Provide a summary of changes made and, when asked, the corrected transcription of the instructions.

---

## Deploy Configuration

**Method:** GitHub Pages. Run `npm run deploy` after implementing changes.

**Setup:** See [DEPLOY.md](DEPLOY.md) for one-time GitHub Pages setup (create repo, connect remote, enable Pages).

---

## Reference: Related Files

| File | Purpose |
|------|---------|
| [FIGJAM_FEEDBACK_PROCEDURE.md](FIGJAM_FEEDBACK_PROCEDURE.md) | This document—standard procedure |
| [DEPLOY.md](DEPLOY.md) | GitHub Pages setup and deploy guide |
| [DESIGN_ANNOTATIONS.md](DESIGN_ANNOTATIONS.md) | Auto-generated from Figma/FigJam (typed content, spacing) |
| [HANDWRITING_OCR.md](HANDWRITING_OCR.md) | Fallback OCR workflow when MCP is unavailable |
| [SETUP.md](SETUP.md) | Project setup, Figma/FigJam config |
