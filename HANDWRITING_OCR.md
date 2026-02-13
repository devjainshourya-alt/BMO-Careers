# Handwritten Content in FigJam — OCR Workflow

Handwritten feedback added in FigJam using a stylus is stored as **vector paths** (pen strokes), not as text. The Figma REST API does not provide a way to extract the semantic meaning of these strokes directly.

## Preferred Method: FigJam MCP (in Cursor)

**When working in Cursor with the Figma MCP enabled**, use the `get_figjam` tool. It renders the FigJam board as images, which the AI can read—including handwritten text. No OCR is needed. See [FIGJAM_FEEDBACK_PROCEDURE.md](FIGJAM_FEEDBACK_PROCEDURE.md) for the standard workflow.

---

## Fallback: Export + OCR Workflow

When the FigJam MCP is unavailable, use the following workflow to convert handwritten FigJam content into machine-readable text.

### 1. Export FigJam Region as Image

1. Open your FigJam board in Figma.
2. Select the area containing handwritten feedback (or use **Ctrl/Cmd + A** to select all).
3. Right-click → **Copy as PNG** or **Export** → choose PNG format.
4. Save the exported image(s) to a folder, e.g. `Annotations/figjam-export-1.png`.

Alternatively, use the Figma REST API image export endpoint if you have node IDs:

```
GET /v1/images/:file_key?ids=:node_ids&format=png
```

### 2. Run OCR on the Exported Image

Use a cloud OCR service that supports handwriting recognition:

| Service | Handwriting Support | Notes |
| ------- | ------------------- | ----- |
| [Google Cloud Vision](https://cloud.google.com/vision/docs/ocr) | Yes | `document_text_detection` for handwritten text |
| [Azure Computer Vision](https://azure.microsoft.com/en-us/products/ai-services/ai-vision) | Yes | Read API supports handwriting |
| [AWS Textract](https://aws.amazon.com/textract/) | Yes | Handwriting in forms and documents |

**Example (Google Cloud Vision):**

```bash
# Install gcloud and authenticate, then:
gcloud ml vision detect-document-text Annotations/figjam-export-1.png --format=json > ocr-result.json
```

**Example (Node.js with Google Vision API):**

```javascript
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const [result] = await client.documentTextDetection('./Annotations/figjam-export-1.png');
const text = result.fullTextAnnotation?.text || '';
console.log(text);
```

### 3. Append OCR Output to Annotations

1. Copy the OCR output text into a text file or directly into `DESIGN_ANNOTATIONS.md`.
2. Add a new section, e.g.:

```markdown
## Handwritten Feedback (OCR)

_Exported from FigJam and processed via OCR. Accuracy may vary for stylus handwriting._

- [Screen/area description]: [OCR text here]
```

---

## Limitations

- **Accuracy**: Handwriting recognition is less reliable than printed text. Expect to manually correct misreads.
- **Layout**: OCR may not preserve spatial relationships (which sticky/area a comment refers to). Consider exporting smaller regions (one sticky or one section at a time) for better context.
- **Manual transcription**: For critical feedback, consider retyping handwritten notes into FigJam sticky notes so they are picked up by `figma-annotations.js` automatically.

---

## Recommended Approach

For reliable parsing into the design annotations pipeline:

1. **In Cursor with Figma MCP**: Use `get_figjam` to read handwritten content from the FigJam board. See [FIGJAM_FEEDBACK_PROCEDURE.md](FIGJAM_FEEDBACK_PROCEDURE.md).
2. **Prefer typed content**: Use FigJam sticky notes with typed text, or the comment tool. These are fully parsed by `node scripts/figma-annotations.js --include-file`.
3. **Use FigJam AI**: If available, use FigJam’s AI tools to convert handwriting to text inside FigJam, then re-run the annotations script.
4. **Reserve OCR for ad hoc**: Use the export + OCR workflow only when the MCP is unavailable and handwritten content must be captured.
