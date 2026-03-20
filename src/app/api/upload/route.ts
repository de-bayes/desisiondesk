import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  const dir = path.join(process.cwd(), "public", "screenshots");
  await mkdir(dir, { recursive: true });

  const filepath = path.join(dir, filename);
  await writeFile(filepath, buffer);

  return Response.json({ path: `/screenshots/${filename}` });
}
