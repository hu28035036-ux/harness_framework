import { apiService } from "@/server/api/service";
import { contextFrom, jsonFrom, toNextResponse } from "../_shared";

export async function GET(request: Request) {
  return toNextResponse(apiService.listScammerReports(contextFrom(request)));
}

export async function POST(request: Request) {
  return toNextResponse(apiService.createScammerReport(contextFrom(request), await jsonFrom(request)));
}
