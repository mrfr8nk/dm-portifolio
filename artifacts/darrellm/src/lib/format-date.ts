const dateFields = ["publishedAt", "published_at", "createdAt", "created_at"] as const;

export function getDateValue(record: Record<string, unknown> | null | undefined) {
  if (!record) return undefined;
  return dateFields.map((field) => record[field]).find((value) => value !== null && value !== undefined && value !== "");
}

export function formatDate(
  value: unknown,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" },
) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleDateString(undefined, options);
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toLocaleDateString(undefined, options);
  }

  return "Date unavailable";
}

export function formatRecordDate(
  record: Record<string, unknown> | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  return formatDate(getDateValue(record), options);
}