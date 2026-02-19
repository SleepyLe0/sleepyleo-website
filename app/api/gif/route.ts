import { NextResponse } from "next/server";

// Only proxy GIFs from known trusted hosts
const ALLOWED_HOSTS = [
  "media.tenor.com",
  "c.tenor.com",
  "media.giphy.com",
  "i.giphy.com",
  "media0.giphy.com",
  "media1.giphy.com",
  "media2.giphy.com",
  "media3.giphy.com",
  "media4.giphy.com",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch GIF" },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "image/gif";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        // Cache for 1 day on CDN, revalidate weekly
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GIF proxy error:", error);
    return NextResponse.json({ error: "Failed to proxy GIF" }, { status: 500 });
  }
}
