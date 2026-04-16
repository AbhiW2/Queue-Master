// ── Shared helpers for Admin Dashboard components ─────────────

export const statusColor = (s) => {
  const m = {
    BOOKED:      "available",
    CALLED:      "busy",
    IN_PROGRESS: "in-progress",
    COMPLETED:   "completed",
    CANCELLED:   "cancelled",
    NO_SHOW:     "cancelled",
    SKIPPED:     "cancelled",
    ON_HOLD:     "on-hold",
    AVAILABLE:   "available",
    ACTIVE:      "available",
    OPEN:        "available",
    CLOSED:      "cancelled",
    BUSY:        "busy",
    ON_LEAVE:    "on-hold",
    INACTIVE:    "cancelled",
  };
  return m[s?.toUpperCase()] || "available";
};

export const renderStars = (rating = 0) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
};