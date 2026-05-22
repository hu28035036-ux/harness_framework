import type { ObjectStorage, ObjectStoragePutResult } from "./object-storage";

export class R2ObjectStorage implements ObjectStorage {
  async putObject(): Promise<ObjectStoragePutResult> {
    throw new Error("R2ObjectStorage is reserved for the post-MVP video scale-out phase.");
  }

  async createSignedUrl(): Promise<string> {
    throw new Error("R2ObjectStorage is reserved for the post-MVP video scale-out phase.");
  }

  async deleteObject(): Promise<void> {
    throw new Error("R2ObjectStorage is reserved for the post-MVP video scale-out phase.");
  }
}
