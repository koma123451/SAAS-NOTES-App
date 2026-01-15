import { SortOrder } from "mongoose";

export function parseSort(
  sort?: string,
  fallback = "createdAt:desc"
): Record<string, SortOrder> {
  const sortParam = sort ?? fallback;
  const [field, order] = sortParam.split(":");

  return {
    [field]: order === "asc" ? 1 : -1,
    _id: order === "asc" ? 1 : -1,
  };
}
