export type ObjectStoragePutInput = {
  bucket: string;
  key: string;
  body: Blob | ArrayBuffer | Uint8Array;
  contentType?: string;
  metadata?: Record<string, string>;
};

export type ObjectStoragePutResult = {
  bucket: string;
  key: string;
  provider: "supabase" | "r2";
};

export interface ObjectStorage {
  putObject(input: ObjectStoragePutInput): Promise<ObjectStoragePutResult>;
  createSignedUrl(bucket: string, key: string, expiresInSeconds: number): Promise<string>;
  deleteObject(bucket: string, key: string): Promise<void>;
}
