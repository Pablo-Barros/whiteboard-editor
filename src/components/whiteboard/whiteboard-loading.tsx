interface WhiteboardLoadingProps {
  message?: string;
}

export function WhiteboardLoading({ message = 'Loading whiteboard...' }: WhiteboardLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div className="text-lg text-muted-foreground">{message}</div>
      </div>
    </div>
  );
}
