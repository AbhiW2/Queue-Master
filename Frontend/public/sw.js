// src/hooks/usePushNotification.js
// Call this hook in UserDashboard or any page after login

import { useEffect } from "react";

// ── VAPID public key ──────────────────────────────────────────────────────────
// This is a demo key — for production generate your own:
// npx web-push generate-vapid-keys
// Then replace this key AND set the private key in Spring Boot application.properties
const VAPID_PUBLIC_KEY =
  "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

// Convert VAPID key from base64 to Uint8Array (required by browser API)
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

const usePushNotification = () => {
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token  = localStorage.getItem("token");
    if (!userId || !token) return; // not logged in

    // Check browser support
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported in this browser.");
      return;
    }

    const subscribe = async () => {
      try {
        // 1. Register the service worker
        const registration = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        // 2. Check if already subscribed
        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          // Already subscribed — make sure backend has it saved
          await sendSubscriptionToBackend(existing, userId, token);
          return;
        }

        // 3. Ask user for permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.info("Push notification permission denied by user.");
          return;
        }

        // 4. Create new subscription
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        // 5. Send subscription to backend
        await sendSubscriptionToBackend(subscription, userId, token);
        console.info("Push notifications enabled ✅");
      } catch (err) {
        console.warn("Push subscription error:", err.message);
      }
    };

    subscribe();
  }, []);
};

// ── Send subscription keys to Spring Boot ────────────────────────────────────
async function sendSubscriptionToBackend(subscription, userId, token) {
  const keys = subscription.toJSON().keys || {};
  try {
    await fetch("http://localhost:8080/api/push/subscribe", {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId:   parseInt(userId),
        endpoint: subscription.endpoint,
        auth:     keys.auth   || "",
        p256dh:   keys.p256dh || "",
      }),
    });
  } catch (err) {
    console.warn("Failed to send subscription to backend:", err.message);
  }
}

export default usePushNotification;