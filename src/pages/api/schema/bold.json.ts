import fs from "fs/promises";
import path from "path";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  try {
    const filePath = path.resolve("src/components/Themes/Bold/BoldTheme/BoldButtonWithLink/bold.schema.json");
    const file = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(file);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to load schema:", error);
    return new Response(JSON.stringify({ error: "Schema not found" }), {
      status: 500,
    });
  }
};