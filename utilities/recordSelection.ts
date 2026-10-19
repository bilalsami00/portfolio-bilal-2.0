/** Keep only ids that are still in the current result set. */
export const reconcileSelection = (
  selectedIds: readonly string[],
  validIds: readonly string[]
): string[] => {
  const valid = new Set(validIds);
  return selectedIds.filter((id) => valid.has(id));
};

/** Select or clear every id in the visible page without touching other selected ids. */
export const toggleVisibleSelection = (
  selectedIds: readonly string[],
  visibleIds: readonly string[]
): string[] => {
  const visible = new Set(visibleIds);
  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  if (allSelected) {
    return selectedIds.filter((id) => !visible.has(id));
  }
  const next = [...selectedIds];
  visibleIds.forEach((id) => {
    if (!next.includes(id)) next.push(id);
  });
  return next;
};

export const selectionFlags = (
  selectedIds: readonly string[],
  visibleIds: readonly string[]
): { allSelected: boolean; indeterminate: boolean } => {
  const selected = new Set(selectedIds);
  const selectedVisible = visibleIds.filter((id) => selected.has(id)).length;
  return {
    allSelected: visibleIds.length > 0 && selectedVisible === visibleIds.length,
    indeterminate: selectedVisible > 0 && selectedVisible < visibleIds.length,
  };
};
