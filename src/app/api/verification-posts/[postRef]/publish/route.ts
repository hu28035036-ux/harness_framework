import { apiService } from "@/server/api/service";
import { contextFrom, toNextResponse } from "../../../_shared";

export async function POST(request: Request, { params }: { params: Promise<{ postRef: string }> }) {
  const { postRef } = await params;
  return toNextResponse(apiService.publishVerificationPost(contextFrom(request), postRef));
}
