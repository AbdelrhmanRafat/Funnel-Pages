import { baseUrl, headers } from "../Enviroment/Local.enviroment";
import type { FunnelRes } from "../Interfaces/Products";

export async function getFunnelPage(): Promise<FunnelRes> {
  const res = await fetch(`${baseUrl}`, {
    headers: headers,
  });
  return res.json();
}