import { NextResponse } from "next/server";

const BASE = "https://torssen.com";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!path.startsWith("/image/") || path.includes("..") || path.includes("\\")) {
    return NextResponse.json({ error: "Некоректне зображення" }, { status: 400 });
  }

  try {
    const response = await fetch(new URL(path, BASE), {
      headers: { "user-agent": "Mozilla/5.0", referer: `${BASE}/` },
      next: { revalidate: 86400 },
    });
    if (!response.ok || !response.body) {
      return NextResponse.json({ error: "Зображення тимчасово недоступне" }, { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "image/webp",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "Зображення тимчасово недоступне" }, { status: 502 });
  }
}
