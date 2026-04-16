// ── Shared helpers for Super Admin components ─────────────────

export const getCategoryLabel = (id) => {
  const map = { 1: "Hospital", 2: "Bank", 3: "Government", 4: "Hotel" };
  return map[id] || "Unknown";
};

export const getCategoryEmoji = (id) => {
  const map = { 1: "🏥", 2: "🏦", 3: "🏛️", 4: "🏨" };
  return map[id] || "🏢";
};

export const getRoleBadge = (role) => {
  const map = {
    SUPER_ADMIN: "sa",
    ADMIN:       "admin",
    STAFF:       "staff",
    USER:        "user",
  };
  return map[role] || "user";
};