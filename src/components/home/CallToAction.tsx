import { Button } from "@/components/ui/button";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="py-16 bg-[#222831] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to taste the difference?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of happy customers who enjoy fresh, locally-sourced produce delivered to their doorstep.
        </p>
        <Link href="/products">
          <Button size="lg" className="bg-[#48b5bb] hover:bg-[#48b5bb]/90 text-white">
            Shop Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;