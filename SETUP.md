# BMO Career Site - Setup Guide

## Figma MCP Configuration

The Figma MCP server is configured in `~/.cursor/mcp.json`. To complete setup:

1. **Get your Figma access token**
   - Log into [Figma](https://www.figma.com) → Settings (top-right) → Security tab
   - Personal Access Tokens → "Generate new token"
   - Name it (e.g. "Cursor MCP") → Generate
   - Copy the token and store it securely (it won't be shown again)

2. **Add your token to Cursor**
   - Open `C:\Users\Shourya Jain\.cursor\mcp.json`
   - Replace `YOUR_FIGMA_ACCESS_TOKEN` with your actual Figma token
   - Restart Cursor so the Figma MCP loads

## Downloading Figma Assets

Images are currently loaded from Figma API URLs. For production, download them locally:

1. **Using Figma MCP** (after completing the steps above):
   - In Cursor Composer, you can ask: "Use the Figma MCP download_figma_images tool to download all images from [Figma file link] to assets/images/"
   - Provide your Figma file link when prompted

2. **Manual export from Figma**
   - In Figma: select each image/icon → right-click → Export → choose PNG or SVG
   - Save to `assets/images/` or `assets/icons/` as appropriate

3. **Update references in HTML**
   - Replace `https://www.figma.com/api/mcp/asset/...` URLs with local paths, e.g.:
   - `assets/images/logo.png`
   - `assets/icons/heart.svg`

## Design Annotations Conventions

To make Figma annotations readable and extractable for development context:

1. **Figma Comments**  
   Use Figma's comment tool directly on the design. The `figma-annotations` script fetches these via the API.

2. **Design-layer annotations** (for extraction via `get_figma_data` or the script with `--include-file`):
   - Add a frame named `_DevNotes`, `_Annotations`, or `_SpacingMeasurements` (leading underscore = metadata)
   - Put instructions as text layers or sticky notes inside that frame
   - Or prefix layer names: `NOTE: Use 24px gap here`, `INSTRUCTION: Hero CTA must be primary blue`, `TODO: Add hover state`

3. **FigJam boards**  
   The project uses a [FigJam feedback board](https://www.figma.com/board/ez9aFR7uZIYi7WIuL1hKA2/) for design feedback. Add **typed** sticky notes, shapes with text, and code blocks—or **handwritten** instructions with a stylus. The AI parses handwritten content via the Figma MCP `get_figjam` tool (renders board as images). See [FIGJAM_FEEDBACK_PROCEDURE.md](FIGJAM_FEEDBACK_PROCEDURE.md) for the standard workflow.

4. **Screenshot exports**  
   Export annotation screenshots to `Annotations/` (e.g. `Home - Desktop - Spacing Measurements.jpg`) and reference them in `DESIGN_ANNOTATIONS.md`.

## Measurement Data (Spacing from Figma)

Three ways to get spacing measurements into `DESIGN_ANNOTATIONS.md`:

1. **Automated extraction** (recommended)  
   Run the script with `--include-file`. It extracts `itemSpacing`, `padding*`, and `counterAxisSpacing` from auto-layout frames and computes gaps between siblings from bounding boxes. No manual entry needed.

2. **Text-layer annotations** (fallback for measure-tool values)  
   The Figma measure tool output is not exposed via the REST API. For distances between arbitrary nodes (e.g. non-sibling elements), create a frame named `_SpacingMeasurements` and add text layers such as `Hero to navbar: 24px` or `Gap between CTA buttons: 12px`. The script picks these up when run with `--include-file`.

3. **Figma plugin** (optional)  
   The Figma plugin API exposes `getMeasurements()` for Dev Mode measurements. You can build a plugin to export measurement data to JSON and merge it into the annotations. This matches the measure tool exactly but requires plugin development.

## Extracting Annotations to Markdown

Run the extraction script to fetch Figma/FigJam comments and optionally design-layer annotations, then write `DESIGN_ANNOTATIONS.md`:

```bash
# Comments only (fast)
FIGMA_ACCESS_TOKEN=your_token node scripts/figma-annotations.js YOUR_FILE_KEY

# Comments + design-layer annotations + spacing (Figma) + sticky notes (FigJam)
FIGMA_ACCESS_TOKEN=your_token node scripts/figma-annotations.js YOUR_FILE_KEY --include-file

# Multiple files (Figma design + FigJam board)
node scripts/figma-annotations.js FIGMA_KEY FIGJAM_KEY --include-file
```

Or use a `.env` file (see `.env.example`) and run:
```bash
node scripts/figma-annotations.js
```

Set `FIGMA_FILE_KEY` and/or `FIGJAM_FILE_KEY` (comma-separated for multiple FigJam boards). Supports URLs: `figma.com/design/...`, `figma.com/board/...`.

The script writes `DESIGN_ANNOTATIONS.md` at the project root. Use it as context for AI-assisted development (e.g. reference it in Cursor when implementing designs).

**Using npm** (if you have Node.js):
```bash
npm run figma:annotations -- YOUR_FILE_KEY          # comments only
npm run figma:annotations:full -- YOUR_FILE_KEY     # comments + design layers + spacing
```
Or set `FIGMA_FILE_KEY`, `FIGJAM_FILE_KEY`, and `FIGMA_ACCESS_TOKEN` in `.env` and run without args.

## Responsive Breakpoints

The site uses these breakpoints (defined in `styles.css`):

- **Desktop**: 1024px and up
- **Tablet**: 768px–1023px
- **Mobile**: under 768px

## Deploy (GitHub Pages)

To push changes to the live site, run `npm run deploy`. One-time setup: see [DEPLOY.md](DEPLOY.md) (create GitHub repo, connect remote, enable Pages).

## FigJam Feedback (Standard Procedure)

When adding design feedback, use the FigJam board with:
- **Browser screenshots** — Current layout/behaviour
- **Design file screens** — Target appearance from Figma
- **Handwritten instructions** — Parsed by the AI via Figma MCP `get_figjam`

Full procedure: [FIGJAM_FEEDBACK_PROCEDURE.md](FIGJAM_FEEDBACK_PROCEDURE.md)

## Next Steps

1. Replace `YOUR_FIGMA_ACCESS_TOKEN` in mcp.json and restart Cursor
2. Organize your Figma file with named frames: "Home - Desktop", "Home - Tablet", "Home - Mobile"
3. Add feedback to the FigJam board (screenshots, design references, handwritten notes)
4. Copy Figma frame links (Cmd+L or right-click → Copy link) and paste them in Cursor Composer to generate or refine page implementations
5. Download assets to `assets/images/` and update image `src` attributes in the HTML
6. Run `figma-annotations` to regenerate `DESIGN_ANNOTATIONS.md` when designs or comments change
