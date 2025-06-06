import { useCallback, useRef, useState, useEffect } from 'react';
import { Editor, TLShapeId, createShapeId } from '@tldraw/tldraw';
import { useToast } from '@/hooks/use-toast';
import { WHITEBOARD_CONFIG, SHAPE_DEFAULTS, TOAST_MESSAGES } from '@/constants/whiteboard';
import { parseWhiteboardContent, areShapesConvertible, generateShapeId } from '@/utils/whiteboard';
import type { ShapeType } from '@/types/whiteboard';
import type { TLStoreSnapshot, TLShapePartial } from '@tldraw/tlschema';

interface UseWhiteboardEditorProps {
  whiteboard: {
    content: unknown;
  } | null | undefined;
  onSave: (snapshot: TLStoreSnapshot) => void;
  onLastSavedUpdate: (serialized: string) => void;
}

export function useWhiteboardEditor({ whiteboard, onSave, onLastSavedUpdate }: UseWhiteboardEditorProps) {
  const { toast } = useToast();
  const editorRef = useRef<Editor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [hasSelectedShapes, setHasSelectedShapes] = useState(false);
  const [canChangeShape, setCanChangeShape] = useState(false);
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);

  // Handle editor mount
  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      window.tldrawEditor = editor; // For debugging
      setIsEditorReady(true);

      // Load initial document if it exists
      if (whiteboard?.content) {
        const snapshot = parseWhiteboardContent(whiteboard.content);
        if (snapshot) {
          onLastSavedUpdate(JSON.stringify(snapshot));
          editor.store.loadSnapshot(snapshot);
        }
      }

      // Handle selection and save changes
      const handleSelectionChange = () => {
        const selectedShapes = editor.getSelectedShapes();
        const hasSelection = selectedShapes.length > 0;
        const convertible = areShapesConvertible(selectedShapes);

        setHasSelectedShapes(hasSelection);
        setCanChangeShape(convertible);
        setSelectedShapeIds(selectedShapes.map((s) => s.id));
      };

      // Listen to store changes
      const unsubscribe = editor.store.listen(() => {
        handleSelectionChange();
        
        // Trigger save
        const snapshot = editor.store.getSnapshot();
        onSave(snapshot);
      });

      // Initial selection check
      handleSelectionChange();

      // Cleanup function
      return () => {
        unsubscribe();
      };
    },
    [whiteboard, onSave, onLastSavedUpdate]
  );

  // Add sample shape function
  const addSampleShape = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      // Get the current viewport center
      const viewportPageBounds = editor.getViewportPageBounds();
      const centerX = viewportPageBounds.x + viewportPageBounds.width / 2;
      const centerY = viewportPageBounds.y + viewportPageBounds.height / 2;

      // Create a new rectangle shape
      const shapeId = createShapeId(generateShapeId());
      const pageId = editor.getCurrentPageId();

      editor.createShape({
        id: shapeId,
        type: 'geo',
        x: centerX - WHITEBOARD_CONFIG.SHAPE_SIZE.offset,
        y: centerY - WHITEBOARD_CONFIG.SHAPE_SIZE.offset,
        props: {
          geo: 'rectangle',
          w: WHITEBOARD_CONFIG.SHAPE_SIZE.width,
          h: WHITEBOARD_CONFIG.SHAPE_SIZE.height,
          fill: SHAPE_DEFAULTS.fill,
          color: SHAPE_DEFAULTS.color,
          size: SHAPE_DEFAULTS.size,
          dash: SHAPE_DEFAULTS.dash,
        },
        parentId: pageId,
      });

      toast(TOAST_MESSAGES.SHAPE_ADDED);
    } catch (error) {
      console.error('Error adding shape:', error);
      toast({
        ...TOAST_MESSAGES.ERROR_ADDING_SHAPE,
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Change shape type function
  const changeShapeType = useCallback(
    (newType: ShapeType) => {
      const editor = editorRef.current;
      if (!editor || selectedShapeIds.length === 0) return;

      try {
        editor.batch(() => {
          selectedShapeIds.forEach((id) => {
            const shape = editor.getShape(id as TLShapeId);
            if (!shape) return;
            if (!(shape.type === 'geo' || shape.type === 'text')) return;

            // Extract common style props
            const { x, y, rotation, parentId, props } = shape;
            const size = (props as { size?: string }).size ?? SHAPE_DEFAULTS.size;
            const fill = (props as { fill?: string }).fill ?? SHAPE_DEFAULTS.fill;
            const color = (props as { color?: string }).color ?? SHAPE_DEFAULTS.color;

            // Build new props
            const newProps: Record<string, unknown> = {
              ...props,
              size,
              fill,
              color,
            };

            if (newType === 'text') {
              delete newProps.geo;
              newProps.text = SHAPE_DEFAULTS.text;
            } else {
              newProps.geo = newType;
              delete newProps.text;
            }

            const update: TLShapePartial = {
              id: id as TLShapeId,
              type: newType,
              props: newProps,
              x,
              y,
              rotation,
              parentId,
            };
            editor.updateShapes([update]);
          });
        });

        toast(TOAST_MESSAGES.SHAPE_UPDATED(newType));
      } catch (error) {
        console.error('Error changing shape type:', error);
        toast({
          ...TOAST_MESSAGES.ERROR_CHANGING_SHAPE,
          description: error instanceof Error ? error.message : TOAST_MESSAGES.ERROR_CHANGING_SHAPE.description,
          variant: 'destructive',
        });
      }
    },
    [selectedShapeIds, toast]
  );

  // Load whiteboard content when it changes
  useEffect(() => {
    if (!isEditorReady || !whiteboard?.content || !editorRef.current) return;

    const snapshot = parseWhiteboardContent(whiteboard.content);
    if (snapshot) {
      onLastSavedUpdate(JSON.stringify(snapshot));
      editorRef.current.store.loadSnapshot(snapshot);
    }
  }, [isEditorReady, whiteboard, onLastSavedUpdate]);

  return {
    editorRef,
    isEditorReady,
    hasSelectedShapes,
    canChangeShape,
    selectedShapeIds,
    handleMount,
    addSampleShape,
    changeShapeType,
  };
}
