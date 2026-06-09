/**
 * Convert a NamedNodeMap to a plain object.
 */
export function namedNodeMapToObject(namedNodeMap: NamedNodeMap) {
  const obj: Record<string, string> = {};
  for (const attr of namedNodeMap) {
    obj[attr.name] = attr.value;
  }
  return obj;
}

// Ampersand must be escaped first to avoid double-encoding the entities below.
function escapeAttributeValue(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Helper function to serialize attributes into a string.
 */
export function serializeAttributes(attrs: Record<string, string>) {
  let html = '';
  for (const key in attrs) {
    const value = attrs[key]!;
    if (value === '') html += ` ${key}`;
    else html += ` ${key}="${escapeAttributeValue(value)}"`;
  }
  return html;
}
