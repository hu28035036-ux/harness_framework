import { apiService } from "@/server/api/service";
import { contextFrom, jsonFrom, toNextResponse } from "../../../_shared";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return toNextResponse(apiService.createWantedComment(contextFrom(request), id, await jsonFrom(request)));
}
