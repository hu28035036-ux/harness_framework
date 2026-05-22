import { apiService } from "@/server/api/service";
import { contextFrom, jsonFrom, toNextResponse } from "../_shared";

export async function GET() {
  return toNextResponse(apiService.listWantedPosts());
}

export async function POST(request: Request) {
  return toNextResponse(apiService.createWantedPost(contextFrom(request), await jsonFrom(request)));
}
