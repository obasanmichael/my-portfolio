"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  borderRadius?: string;
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function Card({
  borderRadius = "1.75rem",
  children,
  containerClassName,
  className,
  style,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-transparent relative text-xl p-[1px] overflow-hidden md:col-span-2 md:row-span-1",
        containerClassName
      )}
      style={{ borderRadius, ...style }}
      {...rest}
    >
      <div
        className="absolute inset-0 rounded-[1.75rem]"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      />
      <div
        className={cn(
          "relative bg-slate-900/0 border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </div>
  );
}
