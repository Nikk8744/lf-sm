import CallToAction from "@/components/home/CallToAction";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import ValueProposition from "@/components/home/ValueProposition";
import { Feature } from "@/components/ui/feature-with-image-carousel";
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="w-full">
        <Feature />
      </section>

      {/* Value Proposition Section */}
      <ValueProposition />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Call to Action */}
      <CallToAction />
    </div>
  );
}
