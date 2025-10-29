/**
 * Tests for the long-term partner compatibility score.
 *
 * We assume `calculateCompatibilityScore(me, partner)` returns a number 0–100
 * based on:
 *  - schedule overlap weight
 *  - workout split compatibility
 *  - goal alignment
 *  - experience level fit
 *  - gym proximity
 *
 * and that the function rejects self-match.
 */

import { calculateCompatibilityScore } from "../src/match/score";

describe("calculateCompatibilityScore", () => {
  const baseUser = {
    uid: "userA",
    scheduleBlocks: [
      // e.g. "Mon-18" means Monday 6pm block, etc.
      "Mon-18",
      "Wed-18",
      "Fri-18",
    ],
    split: "Push/Pull/Legs",
    goals: ["Strength", "Hypertrophy"],
    level: "Intermediate",
    gym: "City Gym",
  };

  it("returns a very high score (~85-100) when everything lines up", () => {
    const partner = {
      uid: "userB",
      scheduleBlocks: ["Mon-18", "Wed-18", "Fri-18"],
      split: "Push/Pull/Legs",
      goals: ["Strength", "Hypertrophy"],
      level: "Intermediate",
      gym: "City Gym",
    };

    const score = calculateCompatibilityScore(baseUser, partner);

    // Perfect overlap and same split/goals/level/gym should be very high.
    expect(score).toBeGreaterThanOrEqual(85);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("returns a mid score (~40-60) for partial alignment", () => {
    const partner = {
      uid: "userC",
      scheduleBlocks: ["Mon-18"], // some overlap, not all
      split: "Upper/Lower", // kinda close but not identical
      goals: ["Strength"], // partial goal overlap
      level: "Intermediate",
      gym: "City Gym", // same gym
    };

    const score = calculateCompatibilityScore(baseUser, partner);

    // Should be lower than the perfect match, but not terrible.
    expect(score).toBeGreaterThanOrEqual(35);
    expect(score).toBeLessThanOrEqual(70);
  });

  it("returns a low score (<50) when basically nothing aligns", () => {
    const partner = {
      uid: "userD",
      scheduleBlocks: ["Tue-06"], // no real overlap
      split: "Full Body",
      goals: ["Endurance"],
      level: "Advanced",
      gym: "Other Gym", // totally different gym
    };

    const score = calculateCompatibilityScore(baseUser, partner);

    expect(score).toBeLessThan(50);
  });

  it("refuses to match a user with themself", () => {
    const scoreWithSelf = () =>
      calculateCompatibilityScore(baseUser, {
        ...baseUser,
        uid: "userA", // same UID means it's literally me
      });

    expect(scoreWithSelf).toThrow(/self-match/i);
  });
});
