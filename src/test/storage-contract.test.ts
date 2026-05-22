import { describe, expect, it } from "vitest";
import type { ObjectStorage } from "@/storage/object-storage";
import { R2ObjectStorage } from "@/storage/r2-object-storage";

describe("object storage contract", () => {
  it("keeps storage provider calls behind a portable contract", () => {
    const methods = ["putObject", "createSignedUrl", "deleteObject"] as const;
    const storage: Partial<ObjectStorage> = new R2ObjectStorage();

    for (const method of methods) {
      expect(typeof storage[method]).toBe("function");
    }
  });
});
