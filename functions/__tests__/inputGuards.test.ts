/**
 * Tests for profile/schedule validation (inputGuards.ts).
 *
 * We expect two helpers:
 *  - validateProfileCompleteness(profile)
 *      -> { valid: boolean; msg?: string }
 *
 *  - validateScheduleBlocks(blocks)
 *      -> { valid: boolean; msg?: string }
 *
 * These reflect rules in our spec:
 * - User can't start long-term matching with an incomplete profile
 * - Schedule blocks can't overlap or go backward in time
 */

import {
    validateProfileCompleteness,
    validateScheduleBlocks,
  } from "../src/validation/inputGuards";
  
  describe("validateProfileCompleteness()", () => {
    it("accepts a complete profile", () => {
      const fullProfile = {
        uid: "userA",
        gym: "24 Hour Fitness",
        split: "Push/Pull/Legs",
        goals: ["Strength", "Hypertrophy"],
        level: "Intermediate",
        scheduleBlocks: [
          { day: "Mon", start: "18:00", end: "20:00" },
          { day: "Wed", start: "18:00", end: "20:00" },
        ],
      };
  
      const result = validateProfileCompleteness(fullProfile);
      expect(result.valid).toBe(true);
      expect(result.msg).toBeUndefined();
    });
  
    it("rejects an incomplete profile (missing split / empty schedule)", () => {
      const badProfile = {
        uid: "userB",
        gym: "City Gym",
        split: "",
        goals: ["Strength"],
        level: "Beginner",
        scheduleBlocks: [],
      };
  
      const result = validateProfileCompleteness(badProfile);
      expect(result.valid).toBe(false);
      expect(result.msg?.toLowerCase()).toMatch(/incomplete profile|missing/i);
    });
  });
  
  describe("validateScheduleBlocks()", () => {
    it("accepts valid, non-overlapping blocks", () => {
      const okBlocks = [
        { day: "Mon", start: "18:00", end: "20:00" },
        { day: "Wed", start: "18:00", end: "20:00" },
      ];
  
      const result = validateScheduleBlocks(okBlocks);
      expect(result.valid).toBe(true);
    });
  
    it("rejects block where end time is before start time", () => {
      const backwards = [
        { day: "Mon", start: "20:00", end: "18:00" }, // invalid
      ];
  
      const result = validateScheduleBlocks(backwards);
      expect(result.valid).toBe(false);
      expect(result.msg?.toLowerCase()).toMatch(/end time.*after start time/i);
    });
  
    it("rejects overlapping blocks on the same day", () => {
      const overlap = [
        { day: "Mon", start: "18:00", end: "20:00" },
        { day: "Mon", start: "19:30", end: "21:00" }, // overlaps
      ];
  
      const result = validateScheduleBlocks(overlap);
      expect(result.valid).toBe(false);
      expect(result.msg?.toLowerCase()).toMatch(/overlap/i);
    });
  
    it("rejects missing required fields", () => {
      // missing 'end'
      const missing = [
        { day: "Tue", start: "18:00" },
      ];
  
      const result = validateScheduleBlocks(missing as any);
      expect(result.valid).toBe(false);
      expect(result.msg?.toLowerCase()).toMatch(/missing/i);
    });
  });
  