import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useWhiteboardData } from '@/hooks/use-whiteboard-data';
import { useWhiteboardEditor } from '@/hooks/use-whiteboard-editor';
import { WhiteboardHeader } from './whiteboard-header';
import { WhiteboardCanvas } from './whiteboard-canvas';
import { WhiteboardLoading } from './whiteboard-loading';
import { WHITEBOARD_CONFIG, TOAST_MESSAGES } from '@/constants/whiteboard';
import type { EditorActions } from '@/types/whiteboard';

export function WhiteboardEditor() {
  const { toast } = useToast();
  const [whiteboardId] = useState(WHITEBOARD_CONFIG.DEFAULT_ID);
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isShapePanelOpen, setIsShapePanelOpen] = useState(false);

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Whiteboard data management
  const {
    whiteboard,
    isLoading,
    error,
    saveWhiteboard,
    updateLastSaved,
    cleanup,
  } = useWhiteboardData({
    whiteboardId,
    isClient,
    onSavingChange: setIsSaving,
  });

  // Editor management
  const {
    hasSelectedShapes,
    canChangeShape,
    handleMount,
    addSampleShape,
    changeShapeType,
  } = useWhiteboardEditor({
    whiteboard,
    onSave: saveWhiteboard,
    onLastSavedUpdate: updateLastSaved,
  });

  // Handle query errors
  useEffect(() => {
    if (error) {
      toast({
        ...TOAST_MESSAGES.ERROR_LOADING,
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Close shape panel when selection changes
  useEffect(() => {
    if ((!hasSelectedShapes || !canChangeShape) && isShapePanelOpen) {
      setIsShapePanelOpen(false);
    }
  }, [hasSelectedShapes, canChangeShape, isShapePanelOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Show loading state
  if (isLoading) {
    return <WhiteboardLoading />;
  }

  // Define editor actions
  const editorActions: EditorActions = {
    addSampleShape,
    changeShapeType,
    setIsShapePanelOpen,
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <WhiteboardHeader
        isSaving={isSaving}
        canChangeShape={canChangeShape}
        isShapePanelOpen={isShapePanelOpen}
        actions={editorActions}
      />

      <WhiteboardCanvas
        onMount={handleMount}
        onAddShape={addSampleShape}
        isSaving={isSaving}
      />

      <Toaster />
    </div>
  );
}
