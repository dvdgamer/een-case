/**
 * Handles errors by logging them and rethrowing.
 * @param error - The error object.
 * @param context - Additional context or message about where the error occurred.
 */
export const handleError = (error: unknown, context: string): never => {
  console.error(`Error in ${context}:`, error);
  if (error instanceof Error) {
    throw error;
  } else {
    throw new Error("An unknown error occurred.");
  }
};
