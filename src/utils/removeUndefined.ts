export function removeUndefined<T extends Record<string, any>>(
  obj: T
): { [K in keyof T]: Exclude<T[K], undefined> } {
  const result: any = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result;
}