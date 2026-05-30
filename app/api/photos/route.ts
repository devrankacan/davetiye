import { readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || auth !== adminPassword) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  if (!existsSync(UPLOAD_DIR)) {
    return NextResponse.json({ photos: [] });
  }

  const files = await readdir(UPLOAD_DIR);
  const imageFiles = files.filter((f) =>
    /\.(jpg|jpeg|png|gif|webp|heic|heif|avif)$/i.test(f)
  );

  const photos = await Promise.all(
    imageFiles.map(async (filename) => {
      const info = await stat(path.join(UPLOAD_DIR, filename));
      return {
        url: `/uploads/${filename}`,
        uploadedAt: info.birthtime.toISOString(),
        size: info.size,
      };
    })
  );

  photos.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  return NextResponse.json({ photos });
}
