export type ShapeType =
  | 'rectangle'
  | 'ellipse'
  | 'triangle'
  | 'diamond'
  | 'pentagon'
  | 'hexagon'
  | 'octagon'
  | 'star'
  | 'text'
  | 'image';

export interface WhiteboardState {
  whiteboardId: string;
  isClient: boolean;
  isSaving: boolean;
  isEditorReady: boolean;
  hasSelectedShapes: boolean;
  canChangeShape: boolean;
  isShapePanelOpen: boolean;
  selectedShapeIds: string[];
}

export interface EditorActions {
  addSampleShape: () => void;
  changeShapeType: (newType: ShapeType) => void;
  setIsShapePanelOpen: (open: boolean) => void;
}

declare global {
  interface Window {
    tldrawEditor: import('@tldraw/tldraw').Editor | null;
  }
}
