import { apiService } from "@/server/api/service";
import { jsonFrom, toNextResponse } from "../../_shared";

export async function POST(request: Request) {
  return toNextResponse(apiService.login(await jsonFrom(request)));
}
