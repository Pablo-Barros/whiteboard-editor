export const WHITEBOARD_CONFIG = {
  DEFAULT_ID: 'default',
  SAVE_DEBOUNCE_MS: 800,
  SHAPE_SIZE: {
    width: 100,
    height: 100,
    offset: 50,
  },
} as const;

export const SHAPE_DEFAULTS = {
  fill: 'solid',
  color: 'black',
  size: 'm',
  dash: 'draw',
  text: 'Double click to edit',
} as const;

export const TOAST_MESSAGES = {
  SHAPE_ADDED: {
    title: 'Shape added',
    description: 'A new rectangle has been added to the canvas.',
  },
  SHAPE_UPDATED: (type: string) => ({
    title: 'Shape updated',
    description: `Changed to ${type} shape`,
  }),
  CHANGES_SAVED: {
    title: 'Changes saved',
    description: 'Your whiteboard has been updated.',
  },
  ERROR_LOADING: {
    title: 'Error loading whiteboard',
  },
  ERROR_SAVING: {
    title: 'Error saving whiteboard',
  },
  ERROR_ADDING_SHAPE: {
    title: 'Error adding shape',
    description: 'Failed to add a new shape to the canvas.',
  },
  ERROR_CHANGING_SHAPE: {
    title: 'Error',
    description: 'Failed to change shape type',
  },
} as const;
