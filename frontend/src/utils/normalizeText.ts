export function normalizeAssistantText(text: string): string {
  if (!text) return '';

  // Convert CRLF to LF
  let normalized = text.replace(/\r\n/g, '\n');

  // Remove multiple consecutive newlines (limit to max 2)
  normalized = normalized.replace(/\n{3,}/g, '\n\n');

  // Trim leading and trailing whitespace
  normalized = normalized.trim();

  return normalized;
}
