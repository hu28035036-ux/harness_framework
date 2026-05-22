import { apiService } from "@/server/api/service";
import { contextFrom, jsonFrom, toNextResponse } from "../_shared";

export async function POST(request: Request) {
  return toNextResponse(apiService.createPromoPost(contextFrom(request), await jsonFrom(request)));
}
