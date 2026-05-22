"use client";

import Image from "next/image";
import { FaLocationArrow } from "react-icons/fa6";
import Link from "next/link";

import { projects } from "@/data";
import { PinContainer } from "./ui/Pin";

const RecentProjects = () => {
  return (
    <div id="projects" className="py-20">
      <h1 className="heading">
        A selection of <span className="text-purple">recent projects</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 lg:gap-y-16 mt-10 px-4 justify-items-center">
        {projects.map((item) => (
          <Link
            href={item.link}
            key={item.id}
            target="_blank"
            rel="noreferrer"
            className="block w-full max-w-sm"
          >
            <PinContainer>
              <div className="relative flex items-center justify-center w-full overflow-hidden h-48 lg:h-56 mb-6">
                <div
                  className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                  style={{ backgroundColor: "#13162D" }}
                >
                  <Image
                    src="/bg.png"
                    alt=""
                    fill
                    sizes="384px"
                    className="object-cover"
                  />
                </div>
                <Image
                  src={item.img}
                  alt={item.title}
                  width={400}
                  height={300}
                  sizes="(max-width: 768px) 80vw, 384px"
                  className="z-10 absolute bottom-0 w-full h-auto max-h-full object-contain object-bottom"
                  loading="lazy"
                />
              </div>
              <h2 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {item.title}
              </h2>
              <p
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2 my-3"
                style={{ color: "#BEC1DD" }}
              >
                {item.des}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4">
                <div className="flex items-center">
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={icon}
                      className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <Image
                        src={icon}
                        alt=""
                        width={24}
                        height={24}
                        className="p-2"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center">
                  <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                    Check Live Site
                  </p>
                  <FaLocationArrow className="ms-3" color="#CBACF9" />
                </div>
              </div>
            </PinContainer>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
