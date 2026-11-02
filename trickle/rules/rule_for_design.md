When designing QR codes
- Support labels on all sides (top, bottom, left, right) if provided.
- Maintain high contrast between the label text and the bar background.
- Render labels directly onto the canvas to ensure they are captured in downloads.
- Do not add redundant UI elements (like divs) for labels in the preview to avoid "double label" visual bugs.