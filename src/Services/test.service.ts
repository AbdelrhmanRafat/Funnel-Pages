// src/Services/test.service.ts
import { fetch } from 'undici';

const API_BASE = "https://postman-echo.com/post";

export async function test(): Promise<any> {
  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ test: "Hello Postman!" })
  });

  return res.json(); // or return res if you want raw response
}
