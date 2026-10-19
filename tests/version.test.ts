import { describe, expect, it } from "vitest";
// @ts-expect-error Node release helper is deliberately plain JS for Actions.
import { nextTag, tagForCommit } from "../scripts/version.mjs";
describe("two-part release versions", () => {
  it("starts at v0.0 and increments numeric minor", () => {
    expect(nextTag([])).toBe("v0.0");
    expect(nextTag(["v0.9", "v0.10", "misc", "v1.0.1"])).toBe("v0.11");
    expect(nextTag(["v0.3", "v0.1"])).toBe("v0.4");
  });
  it("reuses the release tag on rerun for the same commit", () => {
    expect(tagForCommit(["v0.3"], ["v0.1", "v0.3"])).toBe("v0.3");
    expect(tagForCommit([], ["v0.3"])).toBe("v0.4");
  });
});
