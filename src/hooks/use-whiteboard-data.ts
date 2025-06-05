import { useCallback, useRef } from 'react';
import { api } from '@/trpc/client';
import { useToast } from '@/hooks/use-toast';
import { WHITEBOARD_CONFIG, TOAST_MESSAGES } from '@/constants/whiteboard';
import { serializeWhiteboardContent } from '@/utils/whiteboard';
import type { TLStoreSnapshot } from '@tldraw/tlschema';

interface UseWhiteboardDataProps {
  whiteboardId: string;
  isClient: boolean; // used for Next.js SSR
  onSavingChange: (isSaving: boolean) => void;
}

export function useWhiteboardData({
  whiteboardId,
  isClient,
  onSavingChange,
}: UseWhiteboardDataProps) {
  const { toast } = useToast();
  const lastSaved = useRef<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Query for whiteboard data
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

  // Mutation for updating whiteboard
  const updateWhiteboard = api.whiteboard.update.useMutation({
    onMutate: () => {
      onSavingChange(true);
    },
    onSuccess: () => {
      refetch().catch(() => {});
      toast(TOAST_MESSAGES.CHANGES_SAVED);
    },
    onError: (error) => {
      console.error('Error saving whiteboard:', error);
      toast({
        ...TOAST_MESSAGES.ERROR_SAVING,
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      onSavingChange(false);
    },
  });

  // Debounce save operations to prevent too many API calls
  // This is especially important for real-time collaboration features we might add later, with websockets for example.
  const saveWhiteboard = useCallback(
    (snapshot: TLStoreSnapshot) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          const serialized = serializeWhiteboardContent(snapshot);

          // Avoid redundant saves
          if (serialized === lastSaved.current) return;
          lastSaved.current = serialized;

          updateWhiteboard.mutate({
            id: whiteboardId,
            content: snapshot as unknown as Record<string, unknown>,
          });
        } catch (error) {
          console.error('Error saving whiteboard:', error);
          toast({
            ...TOAST_MESSAGES.ERROR_SAVING,
            description:
              error instanceof Error
                ? error.message
                : 'An unknown error occurred',
            variant: 'destructive',
          });
        }
      }, WHITEBOARD_CONFIG.SAVE_DEBOUNCE_MS);
    },
    [whiteboardId, updateWhiteboard, toast]
  );

  // Update last saved reference
  const updateLastSaved = useCallback((serializedSnapshot: string) => {
    lastSaved.current = serializedSnapshot;
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  }, []);

  return {
    whiteboard,
    isLoading,
    error,
    saveWhiteboard,
    updateLastSaved,
    cleanup,
  };
}
