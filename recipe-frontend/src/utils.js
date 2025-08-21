export function truncate(str, len = 40) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

// Build operator param string for API: {op:'>=', value: 4.5} -> ">=4.5"
export function opParam(op, value) {
  if (!op || value === "" || value === null || value === undefined) return "";
  return `${op}${value}`;
}

export const timeOps = [">=", "<=", "=", ">", "<"];
export const ratingOps = [">=", "<=", "=", ">", "<"];
export const calorieOps = [">=", "<=", "=", ">", "<"];
