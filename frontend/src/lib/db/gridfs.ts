import { GridFSBucket } from "mongodb";
import { getDb } from "./mongo";

export const MEDIA_BUCKET = "media";

export async function mediaBucket(): Promise<GridFSBucket> {
  const db = await getDb();
  return new GridFSBucket(db, { bucketName: MEDIA_BUCKET });
}
