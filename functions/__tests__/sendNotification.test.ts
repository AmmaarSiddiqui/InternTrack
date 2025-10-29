import {
    sendNotification,
    notifyPartnerRequest,
    notifyMatchAccepted,
    getDeliveredNotifications,
    clearDeliveredNotifications,
  } from "../src/messaging/sendNotification";
  
  describe("sendNotification infrastructure", () => {
    beforeEach(() => {
      clearDeliveredNotifications();
    });
  
    it("records a basic notification for a single recipient", async () => {
      await sendNotification("user123", {
        title: "Hello",
        body: "World",
        data: { type: "GENERIC" },
      });
  
      const sent = getDeliveredNotifications();
      expect(sent.length).toBe(1);
  
      expect(sent[0].recipient).toBe("user123");
      expect(sent[0].payload.title).toBe("Hello");
      expect(sent[0].payload.body).toBe("World");
      expect(sent[0].payload.data?.type).toBe("GENERIC");
      expect(sent[0].success).toBe(true);
    });
  
    it("sends to multiple recipients", async () => {
      await sendNotification(["u1", "u2"], {
        title: "Ping",
        body: "Check in",
      });
  
      const sent = getDeliveredNotifications();
      expect(sent.map(n => n.recipient).sort()).toEqual(["u1", "u2"]);
    });
  
    it("notifyPartnerRequest builds the right message body", async () => {
      await notifyPartnerRequest("targetUser", {
        fromName: "Alex",
        gym: "City Gym",
      });
  
      const sent = getDeliveredNotifications();
      expect(sent.length).toBe(1);
      expect(sent[0].recipient).toBe("targetUser");
      expect(sent[0].payload.data?.type).toBe("PARTNER_REQUEST");
      expect(sent[0].payload.body).toMatch(/Alex/);
      expect(sent[0].payload.body).toMatch(/City Gym/);
    });
  
    it("notifyMatchAccepted builds the right message body", async () => {
      await notifyMatchAccepted("senderUser", {
        partnerName: "Jordan",
      });
  
      const sent = getDeliveredNotifications();
      expect(sent.length).toBe(1);
      expect(sent[0].recipient).toBe("senderUser");
      expect(sent[0].payload.data?.type).toBe("REQUEST_ACCEPTED");
      expect(sent[0].payload.body).toMatch(/Jordan/);
    });
  });
  