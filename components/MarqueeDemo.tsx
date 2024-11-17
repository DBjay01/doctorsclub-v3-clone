"use client";

import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import Image from "next/image";

const reviews = [  
  {
    name: "Pharmeasy", 
    username: "@pharmeasy",
    body: "Flat 25% off on your medicines.",
    img: "/assets/images/pharmeasy.webp",
  },
  {
    name: "Truemeds", 
    username: "@truemeds",
    body: "Flat 25% off on your medicines.", 
    img: "/assets/images/truemeds.webp",
  },    
  {
    name: "Mamaearth",
    username: "@mamaearth",
    body: "Flat Rs 400 Cashback on spends.",
    img: "/assets/images/mamaearth.webp",
  },
  {
    name: "Ajio",
    username: "@ajio",
    body: "Get upto 90% off on all brands.",
    img: "/assets/images/ajio.webp",
  },
  {
    name: "Beardo",
    username: "@beardo",
    body: "Get upto 60% off on every order.",
    img: "/assets/images/beardo.webp",
  },
  {
    name: "mCaffeine",
    username: "@mcaffeine",
    body: "Buy any 2 and get 3 free.",
    img: "/assets/images/mcaffeine.webp",
  }, 
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body, 
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">  
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
        <h1 className="font-bold text-xl sm:text-3xl md:text-3xl mb-14">Get offers from across 150+ brands.</h1>
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => ( 
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}