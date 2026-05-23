/**
 * Formats a Date object or ISO string to "DD/MM/YYYY HH:MM:SS".
 * @param {Date|string} date
 * @returns {string|null}
 */
function formatDate(date) {
  if (!date) return null;

  const d = new Date(date);

  if (isNaN(d.getTime())) return date; // return as-is if not a valid date

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Recursively walks an object/array and formats all Date instances
 * and fields whose names end with _at (created_at, updated_at, etc.)
 * @param {*} value
 * @returns {*}
 */
function transformDates(value) {
  if (value === null || value === undefined) return value;

  if (value instanceof Date) return formatDate(value);

  if (Array.isArray(value)) return value.map(transformDates);

  if (typeof value === "object") {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      // Format Date instances or string values of timestamp fields
      if (val instanceof Date || (typeof val === "string" && key.endsWith("_at"))) {
        result[key] = formatDate(val);
      } else {
        result[key] = transformDates(val);
      }
    }
    return result;
  }

  return value;
}

export { formatDate, transformDates };
