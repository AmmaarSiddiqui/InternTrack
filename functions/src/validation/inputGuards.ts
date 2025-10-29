/**
 * inputGuards.ts
 *
 * Validation helpers for user profiles and availability schedules.
 * These are used to:
 *  - block long-term partner search if the user's profile is incomplete
 *  - make sure schedule data is actually sane (no overlap, end > start, etc.)
 *
 * The tests expect:
 *  - validateProfileCompleteness(profile) -> { valid: boolean; msg?: string }
 *  - validateScheduleBlocks(blocks) -> { valid: boolean; msg?: string }
 */

export type ScheduleBlock = {
    day: string;      // e.g. "Mon"
    start: string;    // "HH:MM" 24h
    end: string;      // "HH:MM" 24h
  };
  
  export type UserProfileForValidation = {
    uid: string;
    gym: string;
    split: string;
    goals: string[];
    level: string;
    scheduleBlocks: ScheduleBlock[];
  };
  
  /**
   * Convert "HH:MM" (24h) to minutes since midnight.
   * Returns NaN if invalid.
   */
  function toMinutes(timeStr: string): number {
    if (!timeStr || typeof timeStr !== "string") return NaN;
    const [hh, mm] = timeStr.split(":");
    const h = parseInt(hh, 10);
    const m = parseInt(mm, 10);
    if (isNaN(h) || isNaN(m)) return NaN;
    return h * 60 + m;
  }
  
  /**
   * Check that the provided schedule blocks:
   *  - all have day/start/end
   *  - end > start
   *  - no overlapping blocks on the same day
   */
  export function validateScheduleBlocks(
    blocks: ScheduleBlock[]
  ): { valid: boolean; msg?: string } {
    if (!Array.isArray(blocks)) {
      return {
        valid: false,
        msg: "Missing or invalid schedule blocks",
      };
    }
  
    // basic field + ordering validation on each block
    for (const b of blocks) {
      if (!b || !b.day || !b.start || !b.end) {
        return {
          valid: false,
          msg: "Missing required schedule block fields (day/start/end)",
        };
      }
  
      const startMin = toMinutes(b.start);
      const endMin = toMinutes(b.end);
  
      if (isNaN(startMin) || isNaN(endMin)) {
        return {
          valid: false,
          msg: "Invalid time format in schedule block",
        };
      }
  
      if (endMin <= startMin) {
        return {
          valid: false,
          msg: "End time must be after start time",
        };
      }
    }
  
    // group by day so we can catch overlaps within the same day
    const byDay: Record<string, { startMin: number; endMin: number }[]> = {};
    for (const b of blocks) {
      const startMin = toMinutes(b.start);
      const endMin = toMinutes(b.end);
  
      if (!byDay[b.day]) {
        byDay[b.day] = [];
      }
      byDay[b.day].push({ startMin, endMin });
    }
  
    // for each day, sort by start, ensure no overlaps
    for (const day of Object.keys(byDay)) {
      const ranges = byDay[day].sort((a, b) => a.startMin - b.startMin);
      for (let i = 1; i < ranges.length; i++) {
        const prev = ranges[i - 1];
        const curr = ranges[i];
  
        // overlap if curr starts before prev ends
        if (curr.startMin < prev.endMin) {
          return {
            valid: false,
            msg: "Time blocks cannot overlap",
          };
        }
      }
    }
  
    // all good
    return { valid: true };
  }
  
  /**
   * Check if user's profile is "complete enough" to request a partner.
   * We require:
   *  - gym (where do you work out)
   *  - split (preferred workout split / style)
   *  - goals (what you're trying to achieve)
   *  - level (experience level)
   *  - scheduleBlocks: at least one valid block
   *
   * If something is missing or scheduleBlocks fails validation,
   * we return valid:false and an explanation.
   */
  export function validateProfileCompleteness(
    profile: UserProfileForValidation
  ): { valid: boolean; msg?: string } {
    if (!profile) {
      return { valid: false, msg: "Profile missing" };
    }
  
    if (!profile.gym || !profile.gym.trim()) {
      return { valid: false, msg: "Incomplete profile: missing gym" };
    }
  
    if (!profile.split || !profile.split.trim()) {
      return { valid: false, msg: "Incomplete profile: missing split" };
    }
  
    if (
      !Array.isArray(profile.goals) ||
      profile.goals.length === 0 ||
      !profile.goals[0]
    ) {
      return { valid: false, msg: "Incomplete profile: missing goals" };
    }
  
    if (!profile.level || !profile.level.trim()) {
      return { valid: false, msg: "Incomplete profile: missing level" };
    }
  
    if (
      !Array.isArray(profile.scheduleBlocks) ||
      profile.scheduleBlocks.length === 0
    ) {
      return {
        valid: false,
        msg: "Incomplete profile: missing availability schedule",
      };
    }
  
    // Re-use schedule validation for the final check:
    const scheduleRes = validateScheduleBlocks(profile.scheduleBlocks);
    if (!scheduleRes.valid) {
      return {
        valid: false,
        msg: `Incomplete profile: schedule invalid (${scheduleRes.msg})`,
      };
    }
  
    return { valid: true };
  }
  