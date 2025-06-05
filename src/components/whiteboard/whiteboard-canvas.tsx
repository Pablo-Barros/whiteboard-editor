import { Tldraw, Editor } from '@tldraw/tldraw';
import { Button } from '@/components/ui/button';
import '@tldraw/tldraw/tldraw.css';

interface WhiteboardCanvasProps {
  onMount: (editor: Editor) => void;
  onAddShape: () => void;
  isSaving: boolean;
}

export function WhiteboardCanvas({
  onMount,
  onAddShape,
  isSaving,
}: WhiteboardCanvasProps) {
  return (
    <div className="flex-1 relative">
      <Tldraw
        onMount={onMount}
        autoFocus
      >
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="outline"
            onClick={onAddShape}
            disabled={isSaving}
            className="bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            + Add Shape
          </Button>
        </div>
      </Tldraw>
    </div>
  );
}
