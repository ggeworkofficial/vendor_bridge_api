interface AppError extends Error {
  status?: number;
}

export function createError(message: string, status: number): AppError {
  const err: AppError = new Error(message);
  err.status = status;
  return err;
}