import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Dosya 20 MB'dan büyük olamaz" },
      { status: 413 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Sadece resim dosyaları yüklenebilir" },
      { status: 415 }
    );
  }

  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
