import { apiService } from "@/server/api/service";
import { toNextResponse } from "../_shared";

export async function GET() {
  return toNextResponse(apiService.appVersion());
}
