import { MOCK_ALERTS } from "../mock/alerts";
import { DisasterAlert } from "@/types";

export async function getAlerts(): Promise<DisasterAlert[]> {
  return MOCK_ALERTS;
}
