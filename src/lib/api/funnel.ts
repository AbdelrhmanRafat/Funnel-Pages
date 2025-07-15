import type { FunnelRes } from "./types";

const  baseUrl = "https://backend.dev.baseet.co/api/funnels/";
const headers = {
  'Accept': 'application/json',
  'Accept-Language': 'ar',
  'App-Version': '11',
  'Device-Name': 'iphone 11 pro',
  'Device-OS-Version': '13',
  'Device-UDID': '1234',
  'Device-Push-Token': '123456',
  'Device-Type': 'web',
  'country-code': 'EG'
};

export async function getFunnelPage(id: number): Promise<FunnelRes> {
  const res = await fetch(`${baseUrl}1`, {
    headers: headers,
  });
  return res.json();
}