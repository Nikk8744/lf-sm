import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

function Feature() {
  return (
    <div className="w-full py-20 lg:py-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-end items-end  gap-10">
          <div className="flex gap-4 flex-col items-start justify-center">
            <div>
              <Badge>Market</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-xl md:text-3xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
                Purchase best produce directly from farmers
              </h2>
              <p className="text-lg  max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground  text-left">
              Welcome to our Local Farmers Marketplace : a platform connecting you with fresh, locally grown produce straight from the farm. 
              Support local farmers while enjoying high-quality, sustainable products. 
              Shop now and enjoy the best of what your community has to offer!
              </p>
            </div>
          </div>
          <div className="w-full max-w-full px-6">
            <Carousel>
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="flex rounded-md aspect-video bg-muted items-center justify-center">

                        <Image src={`/images/img${index}.webp`} alt="Some images" width={1000} height={1000} className="object-cover w-full h-full rounded-lg"/>

                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
