import { readdir, stat, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const PHOTO_DIR = path.join(process.cwd(), "public", "uploads", "photos");
const VIDEO_DIR = path.join(process.cwd(), "public", "uploads", "videos");

async function listDir(dir: string, urlPrefix: string) {
  if (!existsSync(dir)) return [];

  const files = await readdir(dir);
  const mediaFiles = files.filter((f) => !/\.json$/i.test(f));

  const items = await Promise.all(
    mediaFiles.map(async (filename) => {
      const info = await stat(path.join(dir, filename));
      const basename = filename.replace(/\.[^.]+$/, "");
      const metaPath = path.join(dir, `${basename}.json`);
      let meta = { name: "", surname: "", note: "", uploadedAt: info.birthtime.toISOString() };
      if (existsSync(metaPath)) {
        try { meta = JSON.parse(await readFile(metaPath, "utf-8")); } catch {}
      }
      return {
        url: `${urlPrefix}/${filename}`,
        uploadedAt: meta.uploadedAt,
        size: info.size,
        name: meta.name,
        surname: meta.surname,
        note: meta.note,
      };
    })
  );

  return items.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  if (!process.env.ADMIN_PASSWORD || auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const [photos, videos] = await Promise.all([
    listDir(PHOTO_DIR, "/uploads/photos"),
    listDir(VIDEO_DIR, "/uploads/videos"),
  ]);

  return NextResponse.json({ photos, videos });
}
