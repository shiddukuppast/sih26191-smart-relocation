import { IS_MOCK_MODE } from "./client";
import { MOCK_HABITATIONS } from "../mock/habitations";
import { Habitation } from "@/types";

export async function getHabitations(): Promise<Habitation[]> {
  // In mock mode or until GET /api/vulnerability/habitations is finalized by Member 4
  return MOCK_HABITATIONS;
}

export async function getHabitationById(id: string): Promise<Habitation | null> {
  const found = MOCK_HABITATIONS.find((h) => h.habitationId.toLowerCase() === id.toLowerCase());
  return found || null;
}
