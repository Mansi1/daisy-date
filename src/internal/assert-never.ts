/** Fails the compile when a switch misses a union member, and throws if one slips through at runtime. */
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
};
