/** Stay under Firestore's 500-operation batch limit. */
export const FIRESTORE_SAFE_BATCH_SIZE = 450;

const MAX_BATCH_OPERATIONS = 499;

export class BulkDeleteError extends Error {
  deleted: number;

  failedIds: string[];

  constructor(deleted: number, failedIds: string[]) {
    const failed = failedIds.length;
    const total = deleted + failed;
    super(
      deleted > 0
        ? `Deleted ${deleted} of ${total} records. ${failed} could not be deleted.`
        : `Could not delete ${total} record${
            total === 1 ? "" : "s"
          }. Nothing was removed.`
    );
    this.name = "BulkDeleteError";
    this.deleted = deleted;
    this.failedIds = failedIds;
  }
}

export const uniqueIds = (ids: readonly string[]): string[] => {
  const seen = new Set<string>();
  const unique: string[] = [];
  ids.forEach((id) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    unique.push(id);
  });
  return unique;
};

export const chunkIds = (
  ids: readonly string[],
  size = FIRESTORE_SAFE_BATCH_SIZE
): string[][] => {
  const limit = Math.min(Math.max(1, Math.floor(size)), MAX_BATCH_OPERATIONS);
  const unique = uniqueIds(ids);
  const chunks: string[][] = [];
  for (let index = 0; index < unique.length; index += limit) {
    chunks.push(unique.slice(index, index + limit));
  }
  return chunks;
};

/**
 * Commits each chunk in order. A failed chunk stops the run.
 * Earlier chunks may already be committed, so callers must not treat that as full success.
 */
export const deleteInBatches = async (
  commitChunk: (ids: readonly string[]) => Promise<void>,
  ids: readonly string[],
  size = FIRESTORE_SAFE_BATCH_SIZE
): Promise<number> => {
  const chunks = chunkIds(ids, size);
  let deleted = 0;

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    try {
      // eslint-disable-next-line no-await-in-loop
      await commitChunk(chunk);
      deleted += chunk.length;
    } catch {
      const failedIds = chunks.slice(index).flat();
      throw new BulkDeleteError(deleted, failedIds);
    }
  }

  return deleted;
};

export const formatBulkDeleteFailure = (
  error: BulkDeleteError,
  singular: string,
  plural: string
): string => {
  const failed = error.failedIds.length;
  const total = error.deleted + failed;
  if (error.deleted === 0) {
    return `Could not delete ${total} ${
      total === 1 ? singular : plural
    }. Nothing was removed.`;
  }
  return `Deleted ${error.deleted} ${
    error.deleted === 1 ? singular : plural
  }. ${failed} ${failed === 1 ? singular : plural} could not be deleted.`;
};

export const formatBulkDeleteSuccess = (
  deleted: number,
  singular: string,
  plural: string
): string => `Deleted ${deleted} ${deleted === 1 ? singular : plural}.`;
