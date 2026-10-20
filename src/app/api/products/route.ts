import { NextResponse } from "next/server";

const BASE = "https://torssen.com";
const CATEGORIES = [
  { tag: "audio", title: "Автозвук", path: "/avtozvuk" },
  { tag: "light", title: "Автосвітло", path: "/avtosvitlo" },
  { tag: "video", title: "Відеореєстратори", path: "/videoreyestratory" },
  { tag: "closers", title: "Доводчики дверей, багажника, капота", path: "/dovodchyky-dverej-bagazhnyka-kapotu" },
  { tag: "camera", title: "Камери паркувальні", path: "/kamery-parkuvalni" },
  { tag: "media", title: "Мультимедіа", path: "/multymedya" },
  { tag: "radar", title: "Паркувальні радари", path: "/parkuvalni-radary" },
  { tag: "security", title: "Охоронні системи", path: "/ohoronni-systemy" },
];
const SOURCE_HEADERS = {
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "accept-language": "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7",
  "referer": `${BASE}/`,
};

function decode(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n))).replace(/&[#\w]+;/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function attr(html: string, name: string) {
  return html.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1] ?? "";
}

function parseProducts(html: string, category: (typeof CATEGORIES)[number]) {
  const starts = [...html.matchAll(/<div\b[^>]*class=["'][^"']*\bproduct-layout\b[^"']*["'][^>]*>/gi)].map((match) => match.index ?? 0);
  const cards = starts.map((start, index) => html.slice(start, starts[index + 1] ?? html.length));
  const seen = new Set<string>();
  const products = cards.map((card) => {
    const nameTag = card.match(/<[^>]+itemprop=["']name["'][^>]*>([\s\S]*?)<\/(?:span|div|a|h\d)>/i);
    const name = decode(nameTag?.[1] ?? "").replace(/\btorssen\b/gi, "").replace(/\s{2,}/g, " ").trim();
    const productLink = card.match(/<a\b[^>]*itemprop=["']url["'][^>]*href=["']([^"']+)["']/i) ?? card.match(/<a\b[^>]*href=["'](https?:\/\/torssen\.com\/(?!image\/)[^"']+)["'][^>]*>/i);
    const href = productLink?.[1] ?? "";
    if (!name || !href) return null;
    const productUrl = href.startsWith("http") ? href : `${BASE}${href.startsWith("/") ? "" : "/"}${href}`;
    let parsedUrl: URL;
    try { parsedUrl = new URL(productUrl); } catch { return null; }
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    const isProductUrl = parsedUrl.searchParams.has("product_id") || pathParts.length >= 2 && pathParts.at(-1)!.length >= 12;
    if (parsedUrl.hostname !== "torssen.com" || !isProductUrl || /\/(?:page-\d+|limit-\d+|sort-[^/]+)\/?$/i.test(parsedUrl.pathname) || parsedUrl.pathname === category.path) return null;
    const canonical = parsedUrl.pathname;
    if (seen.has(canonical)) return null;
    seen.add(canonical);
    const plainCard = decode(card);
    const priceTag = card.match(/<[^>]+itemprop=["']price["'][^>]+>/i);
    const priceContent = attr(priceTag?.[0] ?? "", "content");
    const price = Number(priceContent) || 0;
    const oldPriceText = decode(card.match(/<span[^>]*class=["'][^"']*us-module-price-old[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "");
    const oldPrice = Number(oldPriceText.replace(/[^\d,.-]/g, "").replace(",", ".")) || null;
    const image = card.match(/<img\b[^>]*itemprop=["']image["'][^>]*>/i)?.[0] ?? card.match(/<img\b[^>]*>/i)?.[0] ?? "";
    const imagePath = attr(image, "src") || attr(image, "data-src") || attr(image, "data-original");
    const normalizedPath = imagePath.startsWith("//") ? `https:${imagePath}` : imagePath.startsWith("/") ? `${BASE}${imagePath}` : imagePath;
    // Only accept real product cards. Category/footer links can appear in widgets
    // elsewhere in the document and have no product price or product image.
    if (!price || !normalizedPath.includes("torssen.com/image/") || !/itemprop=["']name["']/i.test(nameTag?.[0] ?? "")) return null;
    const brand = name.match(/\b(MTX(?:\s+Audio)?|GEERMAX|LEDERO|PRIME-X|STEELMATE|TEYES)\b/i)?.[1];
    const cartText = decode(card.match(/class=["'][^"']*us-module-cart-btn[^"']*["'][^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? "");
    return {
      id: canonical,
      name,
      brand: brand ? /^mtx/i.test(brand) ? "MTX Audio" : brand.toUpperCase() : "Автотовари",
      category: category.title,
      tag: category.tag,
      price,
      oldPrice,
      available: /до кошика/i.test(cartText) || /class=["'][^"']*us-no-stock/i.test(card) === false && !/немає у наявності|немає в наявності|out of stock/i.test(plainCard),
      image: `/api/image?path=${encodeURIComponent(new URL(normalizedPath).pathname)}`,
      url: parsedUrl.pathname,
      mark: name.match(/\b(\d{1,3}(?:\.\d)?(?:K|\s?мм)?|4K|AHD|DSP|LED)\b/i)?.[1] ?? "AUTO",
    };
  }).filter((product): product is NonNullable<typeof product> => Boolean(product));
  return products;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selected = searchParams.get("category");
  const subcategory = searchParams.get("path") || "";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const chosen = selected && selected !== "all" ? CATEGORIES.filter((category) => category.tag === selected) : CATEGORIES;
  const categoryPath = chosen[0]?.path ?? "";
  const validSubcategory = subcategory.startsWith(`${categoryPath}/`) && !subcategory.includes("..") ? subcategory : "";
  const results = await Promise.allSettled(chosen.map(async (category) => {
    const path = validSubcategory || category.path;
    if (page === 1) {
      const response = await fetch(`${BASE}${path}`, { headers: SOURCE_HEADERS, next: { revalidate: 3600 } });
      if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
      return parseProducts(await response.text(), category);
    }
    const response = await fetch(`${BASE}${path}/page-${page}`, { headers: SOURCE_HEADERS, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
    return parseProducts(await response.text(), category);
  }));
  const products = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  const failedCategories = results.flatMap((result, index) => result.status === "rejected" ? [{ tag: chosen[index].tag, reason: "Тимчасово недоступно" }] : []);
  const emptyCategories = results.flatMap((result, index) => result.status === "fulfilled" && result.value.length === 0 ? [chosen[index].tag] : []);
  if (failedCategories.length) console.error("Catalog request failed", failedCategories);
  return NextResponse.json({ categories: CATEGORIES, products, page, pageSize: 24, updatedAt: new Date().toISOString(), failedCategories, emptyCategories }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
