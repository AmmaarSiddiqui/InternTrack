/**
 * sendNotification.ts
 *
 * Lightweight notification utility for Partner & Pump.
 *
 * Why this exists:
 *  - We eventually want to send real push notifications (FCM/APNs/etc.)
 *    when important events happen:
 *      - Someone requested you as a long-term partner
 *      - Your request was accepted
 *      - You got a message / invite
 *
 *  - In CI and local Jest tests, we *don't* want to talk to
 *    firebase-admin, APNs, or any external service.
 *
 *  - So this module gives us:
 *      1. A well-typed interface for notifications.
 *      2. A stub `sendNotification()` that "delivers" in memory.
 *      3. Helper functions for common notification types.
 *      4. Accessors to inspect what was "sent" (useful in tests).
 *
 * Later we can swap the internals of `sendNotification()` to call FCM
 * without changing the rest of the codebase.
 */

/**
 * Basic shape of a notification we send.
 * - `title` and `body` are what will be displayed to the user
 * - `data` is optional key/value metadata (deep link target etc.)
 */
export type NotificationPayload = {
    title: string;
    body: string;
    data?: Record<string, string>;
  };
  
  /**
   * Metadata about where the notification is going.
   * In production this would be a device push token, user UID, etc.
   *
   * For now we support either a single string recipient or an array of them.
   * We'll just treat them as "recipient IDs" or "push tokens".
   */
  export type Recipient = string | string[];
  
  /**
   * Result we return after a send attempt.
   * Right now it's always success = true, but in the future we can
   * record failures per-recipient (e.g. invalid token).
   */
  export type SendResult = {
    recipient: string;
    success: boolean;
    error?: string;
    payload: NotificationPayload;
    timestamp: number;
  };
  
  /**
   * Internal in-memory log of "delivered" notifications.
   * Jest tests can inspect this without mocking external services.
   *
   * NOTE: This is intentionally module-scoped, not exported directly.
   * Access via getDeliveredNotifications() / clearDeliveredNotifications().
   */
  const deliveredNotifications: SendResult[] = [];
  
  /**
   * sendNotification()
   *
   * Pretend to send a push notification to one or more recipients.
   * In production, this is the place we'd call firebase-admin.messaging()
   * or APNs. In tests/CI, we just record what would have been sent.
   *
   * @param to - recipient ID or array of IDs
   * @param payload - { title, body, data? }
   * @returns Promise<SendResult[]> - one entry per recipient
   */
  export async function sendNotification(
    to: Recipient,
    payload: NotificationPayload
  ): Promise<SendResult[]> {
    const recipients = Array.isArray(to) ? to : [to];
  
    const results: SendResult[] = recipients.map((r) => {
      const result: SendResult = {
        recipient: r,
        success: true,
        payload,
        timestamp: Date.now(),
      };
      deliveredNotifications.push(result);
      return result;
    });
  
    // mimic async boundary
    return Promise.resolve(results);
  }
  
  /**
   * Convenience helper: notifyPartnerRequest
   *
   * Use when userA sends a partner request to userB.
   * Example:
   *   await notifyPartnerRequest("userB", {
   *     fromName: "Alex",
   *     gym: "City Gym"
   *   });
   *
   * This lets the app surface: "Alex wants to partner with you at City Gym"
   */
  export async function notifyPartnerRequest(
    toUid: string,
    opts: { fromName: string; gym?: string }
  ): Promise<SendResult[]> {
    const title = "New Partner Request";
    const body = opts.gym
      ? `${opts.fromName} wants to train with you at ${opts.gym}`
      : `${opts.fromName} sent you a partner request`;
  
    return sendNotification(toUid, {
      title,
      body,
      data: {
        type: "PARTNER_REQUEST",
        fromName: opts.fromName,
        gym: opts.gym || "",
      },
    });
  }
  
  /**
   * Convenience helper: notifyMatchAccepted
   *
   * Use when userB accepts userA's request.
   * Example:
   *   await notifyMatchAccepted("userA", { partnerName: "Jordan" });
   */
  export async function notifyMatchAccepted(
    toUid: string,
    opts: { partnerName: string }
  ): Promise<SendResult[]> {
    const title = "Partner Request Accepted";
    const body = `${opts.partnerName} accepted your partner request`;
  
    return sendNotification(toUid, {
      title,
      body,
      data: {
        type: "REQUEST_ACCEPTED",
        partnerName: opts.partnerName,
      },
    });
  }
  
  /**
   * getDeliveredNotifications()
   *
   * Allows tests to assert:
   *   - Did we send the right notification type?
   *   - Did we target the right recipient UID?
   *   - What message text did we generate?
   *
   * This is intentionally read-only from outside.
   */
  export function getDeliveredNotifications(): ReadonlyArray<SendResult> {
    return deliveredNotifications;
  }
  
  /**
   * clearDeliveredNotifications()
   *
   * Jest setup/teardown helper so tests don't leak notification history.
   */
  export function clearDeliveredNotifications(): void {
    deliveredNotifications.length = 0;
  }
  