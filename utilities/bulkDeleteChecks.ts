import {
  BulkDeleteError,
  chunkIds,
  deleteInBatches,
  FIRESTORE_SAFE_BATCH_SIZE,
  formatBulkDeleteFailure,
  formatBulkDeleteSuccess,
  uniqueIds,
} from "./bulkDelete";
import {
  reconcileSelection,
  selectionFlags,
  toggleVisibleSelection,
} from "./recordSelection";

const same = (left: readonly string[], right: readonly string[]) =>
  left.length === right.length &&
  left.every((id, index) => id === right[index]);

const expect = (failures: string[], name: string, value: boolean) => {
  if (!value) failures.push(name);
};

const runBulkDeleteChecks = async (): Promise<void> => {
  const failures: string[] = [];

  expect(
    failures,
    "unique ids keep order and drop blanks",
    same(uniqueIds(["b", "", "a", "b", "a"]), ["b", "a"])
  );

  expect(failures, "empty chunk", chunkIds([]).length === 0);

  const one = chunkIds(["only"]);
  expect(
    failures,
    "single id chunk",
    one.length === 1 && same(one[0], ["only"])
  );

  const full = chunkIds(
    Array.from({ length: FIRESTORE_SAFE_BATCH_SIZE }, (_, index) => `${index}`)
  );
  expect(
    failures,
    "450 stays one batch",
    full.length === 1 && full[0].length === FIRESTORE_SAFE_BATCH_SIZE
  );

  const overflow = chunkIds(
    Array.from(
      { length: FIRESTORE_SAFE_BATCH_SIZE + 1 },
      (_, index) => `id-${index}`
    )
  );
  expect(
    failures,
    "451 splits under the limit",
    overflow.length === 2 &&
      overflow[0].length === FIRESTORE_SAFE_BATCH_SIZE &&
      overflow[1].length === 1
  );

  const capped = chunkIds(
    Array.from({ length: 500 }, (_, index) => `cap-${index}`),
    500
  );
  expect(
    failures,
    "requested size 500 is capped below 500",
    capped.every((chunk) => chunk.length < 500) &&
      capped.reduce((total, chunk) => total + chunk.length, 0) === 500
  );

  let commits = 0;
  const deletedNone = await deleteInBatches(() => {
    commits += 1;
    return Promise.resolve();
  }, []);
  expect(
    failures,
    "empty delete does not commit",
    deletedNone === 0 && commits === 0
  );

  const committed: string[][] = [];
  const deletedThree = await deleteInBatches(
    (ids) => {
      committed.push([...ids]);
      return Promise.resolve();
    },
    ["a", "b", "a", "c"],
    2
  );
  expect(
    failures,
    "commits only the requested unique ids",
    deletedThree === 3 &&
      same(committed[0], ["a", "b"]) &&
      same(committed[1], ["c"])
  );

  const attempted: string[][] = [];
  let partial: BulkDeleteError | null = null;
  try {
    await deleteInBatches(
      (ids) => {
        attempted.push([...ids]);
        if (attempted.length === 2) {
          return Promise.reject(new Error("batch failed"));
        }
        return Promise.resolve();
      },
      ["a", "b", "c", "d", "e"],
      2
    );
  } catch (error) {
    if (error instanceof BulkDeleteError) partial = error;
  }
  expect(
    failures,
    "partial failure stops later batches",
    attempted.length === 2 &&
      partial !== null &&
      partial.deleted === 2 &&
      same(partial.failedIds, ["c", "d", "e"])
  );
  expect(
    failures,
    "partial failure is not a success message",
    partial !== null &&
      formatBulkDeleteFailure(partial, "message", "messages").includes(
        "could not be deleted"
      ) &&
      !formatBulkDeleteFailure(partial, "message", "messages").startsWith(
        "Deleted 5"
      )
  );

  let totalFailure: BulkDeleteError | null = null;
  try {
    await deleteInBatches(() => Promise.reject(new Error("denied")), ["m1"]);
  } catch (error) {
    if (error instanceof BulkDeleteError) totalFailure = error;
  }
  expect(
    failures,
    "total failure removes nothing",
    totalFailure !== null &&
      totalFailure.deleted === 0 &&
      formatBulkDeleteFailure(totalFailure, "message", "messages") ===
        "Could not delete 1 message. Nothing was removed."
  );

  expect(
    failures,
    "success copy distinguishes visitors",
    formatBulkDeleteSuccess(2, "visitor session", "visitor sessions") ===
      "Deleted 2 visitor sessions." &&
      formatBulkDeleteSuccess(1, "message", "messages") === "Deleted 1 message."
  );

  const pageOne = ["a", "b"];
  const pageTwo = ["c"];
  const selectedPageOne = toggleVisibleSelection([], pageOne);
  const selectedBoth = toggleVisibleSelection(selectedPageOne, pageTwo);
  expect(
    failures,
    "select all keeps other pages",
    same(selectedBoth, ["a", "b", "c"])
  );
  expect(
    failures,
    "deselect all clears only the visible page",
    same(toggleVisibleSelection(selectedBoth, pageOne), ["c"])
  );

  const filtered = reconcileSelection(selectedBoth, ["b", "c", "d"]);
  expect(
    failures,
    "search drops records that are no longer visible",
    same(filtered, ["b", "c"])
  );
  expect(
    failures,
    "pagination does not drop explicit selections still in the result set",
    same(reconcileSelection(selectedBoth, ["a", "b", "c"]), ["a", "b", "c"])
  );
  expect(
    failures,
    "realtime removal drops stale ids",
    same(reconcileSelection(["a", "gone"], ["a"]), ["a"])
  );
  expect(
    failures,
    "empty result clears selection",
    reconcileSelection(["a"], []).length === 0
  );

  const none = selectionFlags([], pageOne);
  const some = selectionFlags(["a"], pageOne);
  const all = selectionFlags(["a", "b", "c"], pageOne);
  expect(
    failures,
    "select all checkbox states",
    !none.allSelected &&
      !none.indeterminate &&
      !some.allSelected &&
      some.indeterminate &&
      all.allSelected &&
      !all.indeterminate
  );

  if (failures.length > 0) {
    throw new Error(failures.join("\n"));
  }
};

export default runBulkDeleteChecks;
