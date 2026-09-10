import { MOCK_SAFE_SITES } from "../mock/safe-sites";
import { SafeSite } from "@/types";

export async function getSafeSites(): Promise<SafeSite[]> {
  return MOCK_SAFE_SITES;
}

export async function getSafeSiteById(id: string): Promise<SafeSite | null> {
  const found = MOCK_SAFE_SITES.find((s) => s.siteId.toLowerCase() === id.toLowerCase());
  return found || null;
}
