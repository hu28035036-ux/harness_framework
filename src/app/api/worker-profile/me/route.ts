import { apiService } from "@/server/api/service";
import { contextFrom, jsonFrom, toNextResponse } from "../../_shared";

export async function GET(request: Request) {
  return toNextResponse(apiService.getWorkerProfile(contextFrom(request)));
}

export async function PUT(request: Request) {
  return toNextResponse(apiService.updateWorkerProfile(contextFrom(request), await jsonFrom(request)));
}
