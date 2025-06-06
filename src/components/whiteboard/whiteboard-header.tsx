import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ShapeSelector } from './shape-selector';
import type { EditorActions } from '@/types/whiteboard';

interface WhiteboardHeaderProps {
  isSaving: boolean;
  canChangeShape: boolean;
  isShapePanelOpen: boolean;
  actions: EditorActions;
}

export function WhiteboardHeader({
  isSaving,
  canChangeShape,
  isShapePanelOpen,
  actions,
}: WhiteboardHeaderProps) {
  return (
    <header className="border-b border-border bg-background px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Whiteboard Editor</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={actions.addSampleShape}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Add Shape'}
          </Button>
          
          <ShapeSelector
            isOpen={isShapePanelOpen}
            onOpenChange={actions.setIsShapePanelOpen}
            onShapeSelect={actions.changeShapeType}
            disabled={isSaving || !canChangeShape}
          />
        </div>

        <div className="flex items-center text-sm text-muted-foreground ml-2">
          {isSaving ? 'Saving changes...' : 'Changes saved'}
        </div>
      </div>
    </header>
  );
}
