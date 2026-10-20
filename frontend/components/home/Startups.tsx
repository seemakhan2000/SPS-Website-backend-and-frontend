"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import type {
  HomeContent,
  StartupContent,
  StartupsSectionContent,
} from "@/types/cms";

import { apiFetch, getMediaUrl } from "@/lib/api";
export default function Startups() {
  const [content, setContent] = useState<StartupContent[]>([]);

  const [sectionContent, setSectionContent] =
    useState<StartupsSectionContent | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);


  //LOAD DATA FROM DB
  useEffect(() => {
    const loadStartups = async () => {
      try {
        const data = await apiFetch<HomeContent>(
          "/content/home"
        );

        //STARTUPS CARDS
        if (Array.isArray(data.startups)) {
          setContent(data.startups);

          if (data.startups.length > 0) {
            setActiveCard(data.startups[0].name);
          } else {
            setActiveCard(null);
          }
        } else {
          setContent([]);
          setActiveCard(null);
        }


        //STARTUPS SECTION
        if (data.startupsSection) {
          setSectionContent(data.startupsSection);
        } else {
          setSectionContent(null);
        }
      } catch (error) {
        console.error(
          "Failed to load Startups:",
          error
        );

        setContent([]);
        setSectionContent(null);
        setActiveCard(null);
      }
    };

    loadStartups();
  }, []);


  //ACTIVE CARD
  const handleCardClick = (name: string) => {
    setActiveCard(name);
  };



  //NO DB DATA
  if (!sectionContent || content.length === 0) {
    return null;
  }


  // Order comes from DB sortOrder.
  const startups = [...content].sort(
    (a, b) =>
      (a.sortOrder ?? 0) -
      (b.sortOrder ?? 0)
  );


  // BACKGROUND IMAGE FROM DB
  const backgroundImage = sectionContent.backgroundImage
    ? getMediaUrl(
      sectionContent.backgroundImage
    )
    : "";
  return (
    <section className="relative w-full">

      {/* BANNER*/}

      <div className="relative w-full h-[350px] sm:h-[350px] md:h-[350px] lg:h-[400px] overflow-hidden top-[10px]">

        {/* BACKGROUND IMAGE DB ONLY*/}
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt={sectionContent.title || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}

        {/* ORIGINAL OVERLAY*/}

        <div className="absolute inset-0 bg-[#102d5c]/95" />

        {/*BANNER CONTENT DB ONLY*/}

        <div className="absolute inset-0 flex items-center justify-center px-4">

          <div className="w-full max-w-[1150px] text-center text-white">

            <h2 className="text-[30px] md:text-[31px] font-bold leading-tight mb-2">
              {sectionContent.title}
            </h2>

            <p className="text-[20px] md:text-[21px] font-medium leading-[1.4] mb-4">
              {sectionContent.subtitle}
            </p>

            <p className="text-[18px] md:text-[19px] font-medium leading-[1.5]">

              {sectionContent.description
                .split("\n")
                .map((line, index, lines) => (
                  <span key={index}>
                    {line}

                    {index <
                      lines.length - 1 && (
                        <br />
                      )}
                  </span>
                ))}

            </p>

          </div>

        </div>

      </div>

      {/* CARDS*/}

      <div className="bg-[#eef8ff] pt-20 pb-12 md:pt-24 md:pb-14">

        <div className="mx-auto px-5">

          <div className="max-w-[1480px] mx-auto px-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">

              {startups.map((startup) => {

                const isActive =
                  activeCard ===
                  startup.name;



                //LOGO FROM DB
                const logo = startup.logo
                  ? getMediaUrl(
                    startup.logo
                  )
                  : "";

                return (
                  <div
                    key={
                      startup.id ??
                      startup.name
                    }
                    onClick={() =>
                      handleCardClick(
                        startup.name
                      )
                    }
                    className={`
                      group
                      relative
                      h-[450px]
                      rounded-[24px]
                      overflow-hidden
                      px-[30px]
                      pt-[30px]
                      pb-[20px]
                      transition-all
                      duration-300
                      cursor-pointer

                      ${isActive
                        ? "bg-[#1E4B9E] text-white"
                        : "bg-white text-[#071f54] hover:bg-[#1E4B9E] hover:text-white"
                      }
                    `}
                  >

                    {/* LOGO AREA*/}
                    <div className="relative h-[90px] mb-[7px]">

                      {/*BACKGROUND / FADED LOGO */}
                      {logo && (
                        <div className="absolute right-[-8px] top-[-28px] w-[145px] h-[115px] opacity-[0.035]">

                          <Image
                            src={logo}
                            alt=""
                            fill
                            sizes="145px"
                            className="object-contain"
                          />

                        </div>
                      )}

                      {/* MAIN LOGO */}

                      <div className="relative w-[60px] h-[60px]">

                        {logo ? (
                          <Image
                            src={logo}
                            alt={
                              startup.name
                            }
                            fill
                            sizes="60px"
                            className="object-contain"
                          />
                        ) : null}

                      </div>

                    </div>

                    {/*CARD TITLE*/}

                    <h3
                      className={`
                        text-[20px]
                        leading-[1.15]
                        font-bold
                        mb-[14px]

                        ${isActive
                          ? "text-white"
                          : "text-[#071f54] group-hover:text-white"
                        }
                      `}
                    >
                      {startup.name}
                    </h3>

                    {/*
                        CARD DESCRIPTION */}

                    <p
                      className={`
                        text-[16px]
                        leading-[1.18]
                        font-normal

                        ${isActive
                          ? "text-white"
                          : "text-[#4c65a0] group-hover:text-white/85"
                        }
                      `}
                    >
                      {startup.description}
                    </p>

                    {/*DASHED LINE*/}

                    <div
                      className={`
                        absolute
                        left-[30px]
                        bottom-[66px]
                        w-[155px]
                        border-t
                        border-dashed

                        ${isActive
                          ? "border-white/50"
                          : "border-[#b9c7df] group-hover:border-white/50"
                        }
                      `}
                    />

                    {/* READ MORE */}
                    <div
                      className={`
                        absolute
                        left-[30px]
                        bottom-[27px]
                        flex
                        items-center
                        gap-[8px]
                        text-[14px]
                        font-medium

                        ${isActive
                          ? "text-white"
                          : "text-[#003b91] group-hover:text-white"
                        }
                      `}
                    >

                      <span
                        className={`
                          w-[10px]
                          h-[10px]
                          rounded-full

                          ${isActive
                            ? "bg-white"
                            : "bg-[#2861ba] group-hover:bg-white"
                          }
                        `}
                      />

                      <span>
                        Read More
                      </span>

                    </div>

                    {/* ARROW BUTTON */}

                    <div
                      className={`
                        absolute
                        right-0
                        bottom-0
                        w-[49px]
                        h-[49px]
                        rounded-full
                        flex
                        items-center
                        justify-center

                        ${isActive
                          ? "bg-[#0a2a5e]"
                          : "bg-[#285db5] group-hover:bg-[#0a2a5e]"
                        }
                      `}
                    >

                      <span className="text-white text-[25px] font-light leading-none">
                        ↗
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}