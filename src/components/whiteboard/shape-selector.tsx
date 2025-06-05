import { Button } from '@/components/ui/button';
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
import type { ShapeType } from '@/types/whiteboard';

interface ShapeSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onShapeSelect: (type: ShapeType) => void;
  disabled?: boolean;
}

const SHAPE_OPTIONS = [
  { type: 'rectangle' as const, icon: Square, label: 'Rectangle' },
  { type: 'ellipse' as const, icon: Circle, label: 'Ellipse' },
  { type: 'triangle' as const, icon: Triangle, label: 'Triangle' },
  { type: 'diamond' as const, icon: Diamond, label: 'Diamond' },
  { type: 'pentagon' as const, icon: Pentagon, label: 'Pentagon' },
  { type: 'hexagon' as const, icon: Hexagon, label: 'Hexagon' },
  { type: 'octagon' as const, icon: Octagon, label: 'Octagon' },
  { type: 'star' as const, icon: Star, label: 'Star' },
];

export function ShapeSelector({
  isOpen,
  onOpenChange,
  onShapeSelect,
  disabled = false,
}: ShapeSelectorProps) {
  const handleShapeSelect = (type: ShapeType) => {
    onShapeSelect(type);
    onOpenChange(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={() => onOpenChange(!isOpen)}
        >
          Change Shape
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="end">
        <div className="grid grid-cols-3 gap-2">
          {SHAPE_OPTIONS.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant="ghost"
              className="flex-col h-auto p-2 hover:bg-accent"
              onClick={() => handleShapeSelect(type)}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
