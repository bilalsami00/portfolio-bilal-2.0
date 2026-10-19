import { useCallback, useEffect, useMemo, useState } from "react";
import {
  reconcileSelection,
  selectionFlags,
  toggleVisibleSelection,
} from "../utilities/recordSelection";

const visibleKeyOf = (ids: readonly string[]) => ids.join("\u0001");

/** Selection for the current filtered result set. Drops ids that disappear. */
const useRecordSelection = (validIds: readonly string[]) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const validKey = visibleKeyOf(validIds);
  const stableValidIds = useMemo(
    () => (validKey ? validKey.split("\u0001") : []),
    [validKey]
  );

  useEffect(() => {
    setSelectedIds((current) => {
      const next = reconcileSelection(current, stableValidIds);
      if (
        next.length === current.length &&
        next.every((id, index) => id === current[index])
      ) {
        return current;
      }
      return next;
    });
  }, [stableValidIds]);

  const toggle = useCallback((id: string, checked: boolean) => {
    setSelectedIds((current) => {
      if (checked) {
        return current.includes(id) ? current : [...current, id];
      }
      return current.filter((item) => item !== id);
    });
  }, []);

  const toggleVisible = useCallback((visibleIds: readonly string[]) => {
    setSelectedIds((current) => toggleVisibleSelection(current, visibleIds));
  }, []);

  const replace = useCallback(
    (ids: readonly string[]) => {
      setSelectedIds(reconcileSelection(ids, stableValidIds));
    },
    [stableValidIds]
  );

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  return {
    selectedIds,
    selected,
    selectedCount: selectedIds.length,
    toggle,
    toggleVisible,
    replace,
    clear,
    flags: (visibleIds: readonly string[]) =>
      selectionFlags(selectedIds, visibleIds),
  };
};

export default useRecordSelection;
