import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || auth !== adminPassword) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const { blobs } = await list({ prefix: "nissan/" });

  const photos = blobs
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .map((b) => ({
      url: b.url,
      uploadedAt: b.uploadedAt,
      size: b.size,
    }));

  return NextResponse.json({ photos });
}
