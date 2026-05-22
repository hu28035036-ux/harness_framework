import type { SupabaseClient } from "@supabase/supabase-js";
import type { ObjectStorage, ObjectStoragePutInput, ObjectStoragePutResult } from "./object-storage";

export class SupabaseObjectStorage implements ObjectStorage {
  constructor(private readonly supabase: SupabaseClient) {}

  async putObject(input: ObjectStoragePutInput): Promise<ObjectStoragePutResult> {
    const { error } = await this.supabase.storage.from(input.bucket).upload(input.key, input.body, {
      contentType: input.contentType,
      upsert: false,
      metadata: input.metadata,
    });

    if (error) {
      throw error;
    }

    return {
      bucket: input.bucket,
      key: input.key,
      provider: "supabase",
    };
  }

  async createSignedUrl(bucket: string, key: string, expiresInSeconds: number): Promise<string> {
    const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(key, expiresInSeconds);
    if (error) {
      throw error;
    }
    return data.signedUrl;
  }

  async deleteObject(bucket: string, key: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([key]);
    if (error) {
      throw error;
    }
  }
}
