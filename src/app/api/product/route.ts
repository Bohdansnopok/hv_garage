import { NextResponse } from "next/server";

function clean(value: string) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

function numeric(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value.replace(/[^\d,.-]/g, "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(request: Request) {
  const source = new URL(request.url).searchParams.get("url");
  let target: URL;
  try { target = new URL(source ?? ""); } catch { return NextResponse.json({ error: "Некоректне посилання" }, { status: 400 }); }
  if (target.hostname !== "torssen.com" || target.protocol !== "https:") return NextResponse.json({ error: "Дозволені лише товари torssen.com" }, { status: 400 });
  try {
    const response = await fetch(target, { headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36", "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "accept-language": "uk-UA,uk;q=0.9,en-US;q=0.8", "referer": "https://torssen.com/" }, next: { revalidate: 3600 } });
    if (!response.ok) return NextResponse.json({ error: "Не вдалося отримати товар" }, { status: 502 });
    const html = await response.text();
    const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .map(([, raw]) => { try { return JSON.parse(raw); } catch { return null; } })
      .flatMap((value) => Array.isArray(value) ? value : [value])
      .find((value) => value?.["@type"] === "Product") ?? {};
    const title = clean(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? jsonLd.name ?? html.match(/property=["']og:title["']\s+content=["']([^"']+)/i)?.[1] ?? "Товар Torssen");
    const image = html.match(/class=["'][^"']*us-product-slide[^"']*["'][\s\S]*?<img[^>]+src=["']([^"']+)/i)?.[1] ?? (typeof jsonLd.image === "string" ? jsonLd.image : jsonLd.image?.[0]) ?? html.match(/property=["']og:image["']\s+content=["']([^"']+)/i)?.[1] ?? "";
    const descriptionBlock = html.match(/class=["'][^"']*spl--product-expo-description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "";
    const specs = [...html.matchAll(/<div[^>]*class=["'][^"']*us-product-attr-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)]
      .map(([, row]) => [...row.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)].map(([, cell]) => clean(cell)))
      .filter((cells) => cells.length >= 2 && cells[0] && cells[1])
      .map(([name, value]) => ({ name: name.replace(/:$/, ""), value }));
    const uniqueSpecs = [...new Map(specs.map((spec) => [`${spec.name}:${spec.value}`, spec])).values()];
    const currentPriceText = clean(html.match(/class=["'][^"']*us-price-new[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "");
    const oldPriceText = clean(html.match(/class=["'][^"']*us-price-old[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "");
    const offer = Array.isArray(jsonLd.offers) ? jsonLd.offers[0] : jsonLd.offers;
    return NextResponse.json({
      title,
      image: image.startsWith("/") ? `https://torssen.com${image}` : image,
      description: clean(descriptionBlock).slice(0, 12000) || clean(jsonLd.description ?? ""),
      specs: uniqueSpecs,
      price: numeric(offer?.price) ?? numeric(currentPriceText),
      oldPrice: numeric(oldPriceText),
      available: /InStock/i.test(offer?.availability ?? "") || /Є в наявності|В наявності/i.test(clean(html.match(/class=["'][^"']*us-product-info-item-stock[^"']*["'][^>]*>([\s\S]*?)<\/li>/i)?.[1] ?? "")),
      url: target.href,
    }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch { return NextResponse.json({ error: "Помилка з’єднання з Torssen" }, { status: 502 }); }
}
