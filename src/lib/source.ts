/**
 * Derive source folder from image fileName.
 * - "path/to/image.jpg" → "path/to"
 * - "image.jpg" → "Field Upload"
 */
export function getSourceFromFileName(fileName: string): string {
  const idx = fileName.lastIndexOf("/");
  if (idx >= 0) {
    return fileName.slice(0, idx);
  }
  return "Field Upload";
}
