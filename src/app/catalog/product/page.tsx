"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Detail = { title: string; image: string; description: string; specs: { name: string; value: string }[]; price: number | null; oldPrice: number | null };

function ProductContent() {
  const searchParams = useSearchParams(); const url = searchParams.get("url") ?? ""; const [detail, setDetail] = useState<Detail | null>(null); const [error, setError] = useState(false);
  useEffect(() => { if (!url) return; fetch(`/api/product?url=${encodeURIComponent(url)}`).then((r)=>r.ok?r.json():Promise.reject()).then(setDetail).catch(()=>setError(true)); }, [url]);
  return <main className="full-catalog"><header className="topbar"><Link className="brand" href="/"><i>HV</i><span>GARAGE<small>Auto electronics</small></span></Link><Link className="button button--small" href="/catalog">До каталогу <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4.5 15.5 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></Link></header><section className="product-detail section"><p className="eyebrow"><b /> Каталог HV Garage</p>{!detail&&!error&&<p>Завантажуємо характеристики товару…</p>}{error&&<p className="empty">Не вдалося завантажити товар. Спробуйте пізніше.</p>}{detail&&<><div className="detail-layout"><div className="detail-image">{detail.image&&<img src={detail.image} alt={detail.title}/>}</div><div className="detail-buy"><h1>{detail.title}</h1><strong>{detail.price?`${detail.price.toLocaleString("uk-UA")} ₴`:"Ціну уточнюйте"}</strong>{detail.oldPrice&&<del>{detail.oldPrice.toLocaleString("uk-UA")} ₴</del>}<a className="button" href={`https://ig.me/m/hv_garage_shop?text=${encodeURIComponent(`Доброго дня, я хочу замовити: ${detail.title}`)}`} target="_blank" rel="noreferrer">Замовити товар <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4.5 15.5 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a><p>Актуальну ціну та наявність уточнюйте під час замовлення.</p></div></div>{detail.description&&<section className="detail-description"><h2>Опис</h2><p>{detail.description}</p></section>}{detail.specs.length>0&&<section className="detail-specs"><h2>Характеристики</h2><dl>{detail.specs.map((spec,index)=><div key={`${spec.name}-${index}`}><dt>{spec.name}</dt><dd>{spec.value}</dd></div>)}</dl></section>}</>}</section><footer><Link className="brand" href="/"><i>HV</i><span>GARAGE<small>Auto electronics</small></span></Link></footer></main>;
}

export default function ProductPage() { return <Suspense fallback={<main className="full-catalog"><p>Завантаження товару…</p></main>}><ProductContent /></Suspense>; }
