import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const Hero = () => {
  return (
    <div id="hero" className="relative w-full pb-20 pt-36">
      <div
        className="absolute inset-0 dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
        top-0 left-0 flex items-center justify-center"
      >
        <div
          className="pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white "
        />
      </div>
      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            Building Interfaces That Solve Real Problems
          </p>
          <TextGenerateEffect
            words="Turning ideas into products people love to use."
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />
          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            I&apos;m Tolu Obasan, a frontend developer passionate about creating
            products with real impact.
          </p>
          <a href="#projects">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
