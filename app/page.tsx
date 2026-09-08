import React from "react";
import Hero from "@/components/Home/Hero";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import FeaturedCategories from "@/components/Home/FeaturedCategories";
import Features from "@/components/Home/Features";
import Testimonials from "@/components/Home/Testimonials";
import Newsletter from "@/components/Home/Newsletter";
import TickerMessage from "@/components/layout/TickerMessage";
export default function Home() {
  return (
    <main>
      <TickerMessage/>
      <Hero />
      <FeaturedProducts />
      <FeaturedCategories/>
       <Features/>
       <Testimonials/>
       <Newsletter/>
    </main>
  );
}
