/** Runs `action` and returns what it throws; fails the test if it doesn't throw. */
export const catchError = (action: () => unknown): unknown => {
  try {
    action();
  } catch (error) {
    return error;
  }
  throw new Error('Expected the action to throw');
};
