/** Logs the message only: never request bodies, credentials, or stacks. */
const logServerError = (scope: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`[${scope}] ${message}`);
};

export default logServerError;
