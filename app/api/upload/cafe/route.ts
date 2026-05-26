import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "ファイルがありません" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "cafes");

  await mkdir(uploadDir, { recursive: true });

  const originalName = file.name;
  const ext = originalName.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return NextResponse.json({
    imageUrl: `/uploads/cafes/${fileName}`,
  });
}