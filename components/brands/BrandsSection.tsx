import Image from "next/image";
import {
  BadgeCheck,
  Sparkles,
} from "lucide-react";

import { brands } from "@/data/brand";
import type { Brand } from "@/data/brand";

import styles from "./BrandsMarquee.module.css";

export default function BrandsSection() {
  /*
  Repeat the brands so each row fills wide screens.
  The row is then duplicated again to make the
  animation seamless.
  */
  const repeatedBrands = [
    ...brands,
    ...brands,
  ];

  const reverseBrands = [
    ...repeatedBrands,
  ].reverse();

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

      <div className="relative">
        <header className="mx-auto mb-12 max-w-3xl px-6 text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            <BadgeCheck className="h-4 w-4" />
            Trusted collection
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-slate-400">
            <Sparkles className="h-4 w-4 text-emerald-500" />

            <span className="text-xs font-bold uppercase tracking-[0.3em]">
              Featured Brands
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Brands you know and trust
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Discover quality products from some of the world&apos;s most
            recognized technology brands.
          </p>
        </header>

        <div className="space-y-6">
          <BrandRow
            brands={repeatedBrands}
            direction="left"
          />

          <BrandRow
            brands={reverseBrands}
            direction="right"
          />
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Hover over a row to pause the animation.
        </p>
      </div>
    </section>
  );
}

interface BrandRowProps {
  brands: Brand[];
  direction: "left" | "right";
}

function BrandRow({
  brands,
  direction,
}: BrandRowProps) {
  return (
    <div className={styles.viewport}>
      <div
        className={
          direction === "left"
            ? styles.trackLeft
            : styles.trackRight
        }
      >
        <BrandGroup brands={brands} />

        <BrandGroup
          brands={brands}
          hidden
        />
      </div>
    </div>
  );
}

interface BrandGroupProps {
  brands: Brand[];
  hidden?: boolean;
}

function BrandGroup({
  brands,
  hidden = false,
}: BrandGroupProps) {
  return (
    <div
      className="flex shrink-0 items-center gap-6 pr-6"
      aria-hidden={hidden}
    >
      {brands.map((brand, index) => (
        <article
          key={`${brand.name}-${index}`}
          className="group flex h-28 w-56 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100"
        >
          <div className="relative h-14 w-full">
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              fill
              sizes="224px"
              className="object-contain  "
            />
          </div>
        </article>
      ))}
    </div>
  );
}
