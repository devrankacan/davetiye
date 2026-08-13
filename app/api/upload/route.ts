import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { sendUploadNotification } from "@/lib/sendMail";

const MAX_IMAGE = 50 * 1024 * 1024;  // 50 MB
const MAX_VIDEO = 500 * 1024 * 1024; // 500 MB

const BASE_DIR = path.join(process.cwd(), "public", "uploads");
const PHOTO_DIR = path.join(BASE_DIR, "photos");
const VIDEO_DIR = path.join(BASE_DIR, "videos");

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const name = (form.get("name") as string | null)?.trim();
  const surname = (form.get("surname") as string | null)?.trim();
  const note = (form.get("note") as string | null)?.trim() || "";

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }
  if (!name || !surname) {
    return NextResponse.json({ error: "Ad ve soyad zorunludur" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Sadece resim veya video yüklenebilir" }, { status: 415 });
  }

  const maxSize = isVideo ? MAX_VIDEO : MAX_IMAGE;
  if (file.size > maxSize) {
    const limit = isVideo ? "500 MB" : "50 MB";
    return NextResponse.json({ error: `Dosya ${limit}'dan büyük olamaz` }, { status: 413 });
  }

  const dir = isImage ? PHOTO_DIR : VIDEO_DIR;
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });

  const ext = file.name.split(".").pop()?.toLowerCase() || (isImage ? "jpg" : "mp4");
  const basename = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const filename = `${basename}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const meta = { name, surname, note, uploadedAt: new Date().toISOString() };
  await writeFile(path.join(dir, `${basename}.json`), JSON.stringify(meta));

  const folder = isImage ? "photos" : "videos";

  sendUploadNotification({
    name, surname, note,
    type: isImage ? "fotoğraf" : "video",
    fileCount: 1,
    uploadedAt: meta.uploadedAt,
  }).catch(() => {});

  return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
}
