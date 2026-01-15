export function normalizePagination(
  page?: number,
  limit?: number,
  maxLimit = 10
) {
  const safePage = Math.max(page ?? 1, 1);
  const safeLimit = Math.min(limit ?? 3, maxLimit);
  const skip = (safePage - 1) * safeLimit;

  return {
    page: safePage,
    limit: safeLimit,
    skip,
  };
}
