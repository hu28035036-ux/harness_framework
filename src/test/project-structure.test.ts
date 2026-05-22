import { describe, expect, it } from "vitest";
import { expectProjectPath } from "./test-utils";

const requiredDirectories = [
  "src/app",
  "src/components",
  "src/domain",
  "src/server",
  "src/server/supabase",
  "src/storage",
  "src/types",
  "src/test",
  "desktop",
  "desktop/zzallog",
  "desktop/tests",
  "supabase",
  "supabase/migrations",
  "phases",
  "docs",
] as const;

const requiredRootFiles = [
  "CLAUDE.md",
  "docs/PRD.md",
  "docs/ARCHITECTURE.md",
  "docs/ADR.md",
  "docs/UI_GUIDE.md",
  "supabase/migrations/0001_initial_schema.sql",
  "package.json",
  "tsconfig.json",
] as const;

describe("project structure baseline", () => {
  it("keeps required architecture directories in place", () => {
    expect(requiredDirectories.map((path) => expectProjectPath(path))).toHaveLength(requiredDirectories.length);
  });

  it("keeps required planning and tooling files in place", () => {
    expect(requiredRootFiles.map((path) => expectProjectPath(path))).toHaveLength(requiredRootFiles.length);
  });
});
