import type { TLStoreSnapshot } from '@tldraw/tlschema';

/**
 * Safely parses whiteboard content from string or object
 */
export function parseWhiteboardContent(content: unknown): TLStoreSnapshot | null {
  try {
    if (typeof content === 'string') {
      return JSON.parse(content) as TLStoreSnapshot;
    }
    return content as TLStoreSnapshot;
  } catch (error) {
    console.error('Error parsing whiteboard content:', error);
    return null;
  }
}

/**
 * Safely serializes whiteboard content to string
 */
export function serializeWhiteboardContent(snapshot: TLStoreSnapshot): string {
  try {
    return JSON.stringify(snapshot);
  } catch (error) {
    console.error('Error serializing whiteboard content:', error);
    throw new Error('Failed to serialize whiteboard content');
  }
}

/**
 * Checks if shapes are convertible (geo or text types)
 */
export function areShapesConvertible(shapes: Array<{ type: string }>): boolean {
  return shapes.length > 0 && shapes.every((s) => s.type === 'geo' || s.type === 'text');
}

/**
 * Generates a unique shape ID with timestamp
 */
export function generateShapeId(): string {
  return `shape-${Date.now()}`;
}
