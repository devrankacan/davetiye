import QRCode from "qrcode";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || req.headers.get("origin") || "";

  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 2,
    color: { dark: "#78350f", light: "#fdf8f4" },
  });

  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
