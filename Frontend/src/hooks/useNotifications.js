import { useState, useEffect, useCallback } from "react";

const BASE_URL            = "http://localhost:8080/api/v1/notifications";
const BADGE_POLL_INTERVAL = 10000;  // unread count every 10s
const LIST_POLL_INTERVAL  = 20000;  // full list every 20s

const getAuthHeaders = () => ({
  "Content-Type" : "application/json",
  Authorization  : `Bearer ${localStorage.getItem("token")}`
});

const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);

  // ── Fetch unread count (badge) ───────────────────────────
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${BASE_URL}/user/${userId}/unread-count`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
    } catch (e) { console.error("Badge poll error:", e); }
  }, [userId]);

  // ── Fetch full list ──────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${BASE_URL}/user/${userId}`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
      // sync unread count from list
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (e) { console.error("List poll error:", e); }
  }, [userId]);

  // ── Poll badge every 10s ─────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    fetchUnreadCount();
    const id = setInterval(fetchUnreadCount, BADGE_POLL_INTERVAL);
    return () => clearInterval(id);
  }, [userId, fetchUnreadCount]);

  // ── Poll full list every 20s ─────────────────────────────
  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
    const id = setInterval(fetchNotifications, LIST_POLL_INTERVAL);
    return () => clearInterval(id);
  }, [userId, fetchNotifications]);

  // ── Mark ALL read → backend + local ─────────────────────
  const markAllRead = useCallback(async () => {
    if (!userId) return;
    try {
      await fetch(`${BASE_URL}/user/${userId}/mark-all-read`, {
        method: "PUT", headers: getAuthHeaders()
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) { console.error("Mark all read error:", e); }
  }, [userId]);

  // ── Mark ONE read → backend + local ─────────────────────
  const markRead = useCallback(async (notifId) => {
    try {
      await fetch(`${BASE_URL}/${notifId}/mark-read`, {
        method: "PUT", headers: getAuthHeaders()
      });
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, read: true } : n)
      );
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (e) { console.error("Mark read error:", e); }
  }, []);

  // ── Delete ONE → backend + remove from local ─────────────
  const dismissOne = useCallback(async (notifId) => {
    try {
      await fetch(`${BASE_URL}/${notifId}`, {
        method: "DELETE", headers: getAuthHeaders()
      });
      setNotifications(prev => prev.filter(n => n.id !== notifId));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (e) { console.error("Delete notification error:", e); }
  }, []);

  // ── Clear ALL → backend + clear local ────────────────────
  const clearAll = useCallback(async () => {
    if (!userId) return;
    try {
      await fetch(`${BASE_URL}/user/${userId}/all`, {
        method: "DELETE", headers: getAuthHeaders()
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (e) { console.error("Clear all error:", e); }
  }, [userId]);

  // ── Manual refresh (when drawer opens) ───────────────────
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    markAllRead,
    markRead,
    dismissOne,
    clearAll,
    refresh
  };
};

export default useNotifications;