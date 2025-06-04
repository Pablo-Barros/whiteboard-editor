'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { Tldraw, Editor, TLShapeId, createShapeId } from '@tldraw/tldraw';
import { api } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Square,
  Circle,
  Triangle,
  Diamond,
  Hexagon,
  Octagon,
  Pentagon,
  Star,
} from 'lucide-react';
import '@tldraw/tldraw/tldraw.css';
import type { TLStoreSnapshot, TLShapePartial } from '@tldraw/tlschema';

declare global {
  interface Window {
    tldrawEditor: Editor | null;
  }
}

// Define shape types
type ShapeType =
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

export default function WhiteboardPage() {
  const [whiteboardId] = useState('default');
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Track last saved snapshot to avoid redundant saves
  const lastSaved = useRef<string | null>(null);

  // Handle query success and error states
  const {
    data: whiteboard,
    isLoading,
    error,
    refetch,
  } = api.whiteboard.getById.useQuery(
    { id: whiteboardId },
    {
      enabled: isClient,
      refetchOnWindowFocus: false,
    }
  );

  // Handle query errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading whiteboard',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const updateWhiteboard = api.whiteboard.update.useMutation({
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: () => {
      refetch().catch(() => {});
      toast({
        title: 'Changes saved',
        description: 'Your whiteboard has been updated.',
      });
    },
    onError: (error) => {
       
      console.error('Error saving whiteboard:', error);
      toast({
        title: 'Error saving whiteboard',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  // Handle Tldraw mount - combined version
  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      window.tldrawEditor = editor; // For debugging
      setIsEditorReady(true);

      // Load initial document if it exists
      if (whiteboard?.content) {
        try {
          const raw =
            typeof whiteboard.content === 'string'
              ? JSON.parse(whiteboard.content)
              : whiteboard.content;

          const snapshot = raw as TLStoreSnapshot;
          // Update lastSaved BEFORE loading to ignore initial change event
          lastSaved.current = JSON.stringify(snapshot);
          editor.store.loadSnapshot(snapshot);
        } catch (error) {
           
          console.error('Error loading document:', error);
        }
      }

      // Handle selection changes
      const handleSelectionChange = () => {
        const selectedShapes = editor.getSelectedShapes();
        const hasSelection = selectedShapes.length > 0;
        setHasSelectedShapes(hasSelection);
        setSelectedShapeIds(selectedShapes.map((s) => s.id));
      };

      // Listen to selection changes through the store
      const unsubscribe = editor.store.listen(() => {
        handleSelectionChange();
      });

      // Initial selection check
      handleSelectionChange();

      // Listen for any document changes to trigger debounced save
      const unsubscribeSave = editor.store.listen(() => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
          handleChange();
        }, 800);
      });

      // Cleanup function when editor unmounts
      return () => {
        unsubscribe();
        unsubscribeSave();
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      };
    },
    [whiteboard, whiteboardId]
  );

  // Handle document changes
  const handleChange = useCallback(
    (eventName?: string) => {
      if (!editorRef.current) return;
      if (eventName && eventName !== 'change') return;

      try {
        // Get the full store snapshot
        const snapshot = editorRef.current.store.getSnapshot();
        const serialized = JSON.stringify(snapshot);

        // Avoid redundant saves
        if (serialized === lastSaved.current) return;
        lastSaved.current = serialized;

        // Update the whiteboard with the current document state
        updateWhiteboard.mutate({
          id: whiteboardId,
          content: snapshot as unknown as Record<string, unknown>,
        });
      } catch (error) {
         
        console.error('Error saving whiteboard:', error);
        toast({
          title: 'Error saving whiteboard',
          description:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
          variant: 'destructive',
        });
      }
    },
    [whiteboardId, updateWhiteboard, toast]
  );

  // State for tracking if shapes are selected
  const [hasSelectedShapes, setHasSelectedShapes] = useState(false);
  const [canChangeShape, setCanChangeShape] = useState(false);
  const [isShapePanelOpen, setIsShapePanelOpen] = useState(false);
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);

  // Update selected shapes state when selection changes
  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    const editor = editorRef.current;
    if (!editor) return;

    // Function to update selection state
    const updateSelection = () => {
      try {
        const selectedShapes = editor.getSelectedShapes();
        const selectedIds = selectedShapes.map((shape) => shape.id);
        const hasSelection = selectedShapes.length > 0;
        const convertible =
          hasSelection &&
          selectedShapes.every((s) => s.type === 'geo' || s.type === 'text');

        setHasSelectedShapes(hasSelection);
        setCanChangeShape(convertible);
        setSelectedShapeIds(selectedIds);
      } catch (error) {
         
        console.error('Error in updateSelection:', error);
      }
    };

    // Initial update
    updateSelection();

    // Listen to store changes and update selection on every change
    const unsubscribe = editor.store.listen(() => {
      updateSelection();
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [isEditorReady]);

  // Close the shape panel automatically when selection is cleared or not convertible
  useEffect(() => {
    if ((!hasSelectedShapes || !canChangeShape) && isShapePanelOpen) {
      setIsShapePanelOpen(false);
    }
  }, [hasSelectedShapes, canChangeShape, isShapePanelOpen]);

  // Change the type of selected shapes using TLDraw's API
  const changeShapeType = useCallback(
    (newType: ShapeType) => {
      const editor = editorRef.current;
      if (!editor || selectedShapeIds.length === 0) return;

      try {
        editor.batch(() => {
          selectedShapeIds.forEach((id) => {
            const shape = editor.getShape(id as TLShapeId);
            if (!shape) return;
            if (!(shape.type === 'geo' || shape.type === 'text')) return; // Skip non-convertible

            // Extract common style props if they exist
            const { x, y, rotation, parentId, props } = shape;
            const size = (props as { size?: string }).size ?? 'm';
            const fill = (props as { fill?: string }).fill ?? 'solid';
            const color = (props as { color?: string }).color ?? 'black';

            // Build new props safely
            const newProps: Record<string, unknown> = {
              ...props,
              size,
              fill,
              color,
            };

            if (newType === 'text') {
              delete newProps.geo; // geo not allowed on text shape
              newProps.text = 'Double click to edit';
            } else {
              newProps.geo = newType;
              delete newProps.text; // text not allowed on geo shapes
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
        toast({
          title: 'Shape updated',
          description: `Changed to ${newType} shape`,
        });
        setIsShapePanelOpen(false);
      } catch (error) {
         
        console.error('Error changing shape type:', error);
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to change shape type',
          variant: 'destructive',
        });
      }
    },
    [selectedShapeIds, toast]
  );

  // Add a sample shape
  const addSampleShape = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      // Get the current viewport center
      const viewportPageBounds = editor.getViewportPageBounds();
      const centerX = viewportPageBounds.x + viewportPageBounds.width / 2;
      const centerY = viewportPageBounds.y + viewportPageBounds.height / 2;

      // Create a new rectangle shape
      const shapeId = createShapeId(`shape-${Date.now()}`);
      const pageId = editor.getCurrentPageId();

      editor.createShape({
        id: shapeId,
        type: 'geo',
        x: centerX - 50, // Center the shape
        y: centerY - 50,
        props: {
          geo: 'rectangle',
          w: 100,
          h: 100,
          fill: 'solid',
          color: 'black',
          size: 'm',
          dash: 'draw',
        },
        parentId: pageId,
      });

      toast({
        title: 'Shape added',
        description: 'A new rectangle has been added to the canvas.',
      });
    } catch (error) {
       
      console.error('Error adding shape:', error);
      toast({
        title: 'Error adding shape',
        description: 'Failed to add a new shape to the canvas.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Load (or reload) the whiteboard content when data arrives
  useEffect(() => {
    if (!isEditorReady || !whiteboard?.content || !editorRef.current) return;

    try {
      const raw =
        typeof whiteboard.content === 'string'
          ? JSON.parse(whiteboard.content)
          : whiteboard.content;

      const snapshot = raw as TLStoreSnapshot;
      lastSaved.current = JSON.stringify(snapshot);
      editorRef.current.store.loadSnapshot(snapshot);
    } catch (error) {
       
      console.error('Error loading whiteboard content:', error);
    }
  }, [isEditorReady, whiteboard]);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading whiteboard...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      <header className="border-b border-border bg-background px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Whiteboard Editor</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={addSampleShape}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Add Shape'}
            </Button>
            <Popover open={isShapePanelOpen} onOpenChange={setIsShapePanelOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isSaving || !canChangeShape}
                  onClick={() => setIsShapePanelOpen(!isShapePanelOpen)}
                >
                  Change Shape
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2" align="end">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="ghost"
                    className="flex-col h-auto p-2"
                    onClick={() => changeShapeType('rectangle')}
                  >
                    <Square className="h-6 w-6 mb-1" />
                    <span className="text-xs">Rectangle</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-col h-auto p-2"
                    onClick={() => changeShapeType('ellipse')}
                  >
                    <Circle className="h-6 w-6 mb-1" />
                    <span className="text-xs">Ellipse</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-col h-auto p-2"
                    onClick={() => changeShapeType('triangle')}
                  >
                    <Triangle className="h-6 w-6 mb-1" />
                    <span className="text-xs">Triangle</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-col h-auto p-2"
                    onClick={() => changeShapeType('diamond')}
                  >
                    <Diamond className="h-6 w-6 mb-1" />
                    <span className="text-xs">Diamond</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-col h-auto p-2"
                    onClick={() => changeShapeType('pentagon')}
                  >
                    <Pentagon className="h-6 w-6 mb-1" />
                    <span className="text-xs">Pentagon</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-col h-auto p-2"
                    onClick={() => changeShapeType('hexagon')}
                  >
                    <Hexagon className="h-6 w-6 mb-1" />
                    <span className="text-xs">Hexagon</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-col h-auto p-2"
                    onClick={() => changeShapeType('octagon')}
                  >
                    <Octagon className="h-6 w-6 mb-1" />
                    <span className="text-xs">Octagon</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-col h-auto p-2"
                    onClick={() => changeShapeType('star')}
                  >
                    <Star className="h-6 w-6 mb-1" />
                    <span className="text-xs">Star</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center text-sm text-muted-foreground ml-2">
            {isSaving ? 'Saving changes...' : 'Changes saved'}
          </div>
        </div>
      </header>

      <div className="flex-1 relative">
        <Tldraw
          onMount={handleMount}
          onUiEvent={(name) => {
            // Only react to 'change' events from the editor
            handleChange(name);
          }}
          autoFocus
        >
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="outline"
              onClick={addSampleShape}
              disabled={isSaving}
              className="bg-white"
            >
              + Add Shape
            </Button>
          </div>
        </Tldraw>
      </div>

      <Toaster />
    </div>
  );
}
