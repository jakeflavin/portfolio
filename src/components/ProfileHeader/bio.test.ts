import { describe, it, expect } from "vitest";
import { composeScript } from "@/components/TypeWriter/typing";
import { BIO_SCRIPT, BIO_TEXT } from "./bio";

describe("BIO_SCRIPT", () => {
  /**
   * The backspace counts are hand-written, so they drift the moment the copy changes.
   * Playing the script and comparing the result catches that immediately.
   */
  it("settles on the intended bio", () => {
    expect(composeScript(BIO_SCRIPT)).toBe(BIO_TEXT);
  });

  it("never backspaces past the start", () => {
    let length = 0;
    for (const step of BIO_SCRIPT) {
      if ("type" in step) length += step.type.length;
      else if ("delete" in step) {
        expect(step.delete).toBeLessThanOrEqual(length);
        length -= step.delete;
      }
    }
  });

  it("corrects at least one typo along the way", () => {
    // A script with no deletes is just typing, which is not what this is for.
    expect(BIO_SCRIPT.some((step) => "delete" in step)).toBe(true);
  });
});
