"use client";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { IoCopyOutline } from "react-icons/io5";

import { cn } from "@/lib/utils";

import GridGlobe from "./GridGlobe";
import MagicButton from "../MagicButton";
import { BackgroundGradientAnimation } from "./GradientBg";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

function OptimizedImage({
  src,
  alt,
  className,
  fill = false,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}) {
  const isSvg = src.endsWith(".svg");

  if (isSvg) {
    return (
      <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      sizes="(max-width: 768px) 100vw, 50vw"
      className={className}
      loading="lazy"
    />
  );
}

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = memo(function BentoGridItem({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) {
  const leftLists = useMemo(
    () => ["ReactJS", "NextJS", "Typescript"],
    []
  );
  const rightLists = useMemo(() => ["Github", "flutter", "firebase  "], []);

  const [copied, setCopied] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!copied || animationData) return;
    import("@/data/confetti.json").then((mod) => setAnimationData(mod.default));
  }, [copied, animationData]);

  const lottieOptions = useMemo(
    () =>
      animationData
        ? {
            loop: true,
            autoplay: true,
            animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }
        : null,
    [animationData]
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText("obasantolu@gmail.com");
    setCopied(true);
  }, []);

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className
      )}
      style={{
        background:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <div className={`${id === 6 && "flex justify-center"} h-full`}>
        <div className="w-full h-full absolute">
          {img && (
            <OptimizedImage
              src={img}
              alt={typeof title === "string" ? title : "grid item"}
              className={cn(imgClassName, "object-cover object-center")}
              fill
            />
          )}
        </div>
        <div
          className={`absolute right-0 -bottom-5 ${
            id === 5 && "w-full opacity-80"
          } `}
        >
          {spareImg && (
            <OptimizedImage
              src={spareImg}
              alt="decorative"
              className="object-cover object-center w-full h-full"
            />
          )}
        </div>
        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          <div className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10">
            {title}
          </div>
          <div className="font-sans font-extralight md:max-w-45 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
            {description}
          </div>

          {id === 2 && <GridGlobe />}

          {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {leftLists.map((item) => (
                  <span
                    key={item}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-[#10132E]"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-[#10132E]"></span>
                {rightLists.map((item) => (
                  <span
                    key={item}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {id === 6 && (
            <div className="mt-5 relative">
              {copied && lottieOptions && (
                <div className="absolute -bottom-5 right-0">
                  <Lottie options={lottieOptions} height={200} width={400} />
                </div>
              )}

              <MagicButton
                title={copied ? "Email is Copied!" : "Copy my email address"}
                icon={<IoCopyOutline />}
                position="left"
                handleClick={handleCopy}
                otherClasses="!bg-[#161A31]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
