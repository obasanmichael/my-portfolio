"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (prefersReducedMotion || !isDesktop) {
      animate("span", { opacity: 1 }, { duration: 0 });
      return;
    }

    animate(
      "span",
      { opacity: 1 },
      { duration: 2, delay: stagger(0.2) }
    );
  }, [animate, prefersReducedMotion, words]);

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <div className="dark:text-white text-black leading-snug tracking-wide">
          <motion.div ref={scope}>
            {wordsArray.map((word, idx) => (
              <motion.span
                key={`${word}-${idx}`}
                className={cn(
                  idx > 3 ? "text-purple" : "dark:text-white text-black",
                  prefersReducedMotion
                    ? "opacity-100"
                    : "opacity-100 md:opacity-0"
                )}
              >
                {word}{" "}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
