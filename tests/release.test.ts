import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
// @ts-expect-error Plain Node helper also runs without TypeScript in Actions.
import { releaseCommit } from "../scripts/version.mjs";
it("pushes v0.0 then v0.1, and rerunning a SHA does not add a release", () => {
  const directory = mkdtempSync(join(tmpdir(), "dop-release-test-"));
  const original = process.cwd();
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: directory,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  try {
    git("init", "--bare", join(directory, "remote.git"));
    git("init", "-b", "master");
    git("config", "user.name", "Release test");
    git("config", "user.email", "test@example.invalid");
    git("remote", "add", "origin", join(directory, "remote.git"));
    git("commit", "--allow-empty", "-m", "first");
    const first = git("rev-parse", "HEAD");
    process.chdir(directory);
    expect(releaseCommit(first)).toBe("v0.0");
    expect(releaseCommit(first)).toBe("v0.0");
    git("commit", "--allow-empty", "-m", "second");
    const second = git("rev-parse", "HEAD");
    expect(releaseCommit(second)).toBe("v0.1");
    expect(releaseCommit(first)).toBe("v0.0");
    const remote = git("ls-remote", "--tags", "origin");
    expect(remote.split("\n")).toHaveLength(2);
    expect(remote).toContain(`${second}\trefs/tags/v0.1`);
    expect(() => releaseCommit("not-a-sha")).toThrow(/SHA/);
  } finally {
    process.chdir(original);
    rmSync(directory, { recursive: true, force: true });
  }
});
