"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative group/pin w-full cursor-pointer", containerClassName)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full transition-transform duration-700 ease-out"
        style={{
          transform: isHovered
            ? "perspective(1000px) rotateX(8deg) scale(0.98)"
            : "perspective(1000px) rotateX(0deg) scale(1)",
        }}
      >
        <div
          className={cn(
            "relative w-full p-4 flex flex-col rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] border border-white/[0.1] group-hover/pin:border-white/[0.2] transition-colors duration-700 overflow-hidden bg-black-100/80",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
