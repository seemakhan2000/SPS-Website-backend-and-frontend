'use client';

import { useState, useEffect, Fragment } from 'react';
import type { AboutUsContent, HomeContent } from '@/types/cms';
import Image from 'next/image';
import Link from 'next/link';
import { apiFetch, getMediaUrl } from '@/lib/api';

export default function AboutUs() {
  const [content, setContent] = useState<AboutUsContent | null>(null);
  
  
  // LOAD ABOUT US DATA FROM API
  useEffect(() => {
    const loadAboutUs = async () => {
      try {
        const data = await apiFetch<HomeContent>(
          '/content/home'
        );

        setContent(data.aboutUs);
      } catch (error) {
        console.error(
          'Failed to load About Us content:',
          error
        );
      }
    };

    loadAboutUs();
  }, []);
 
  // NO DATA
  if (!content) {
    return (
      <section className="overflow-hidden bg-[#eef7fd]">
        <div className="mx-auto max-w-[1235px] px-4">
          <div className="flex min-h-[710px] items-center justify-center">
            <p className="text-[#5a75a3]">
              About Us content not available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-[#eef7fd]">
      <div className="mx-auto max-w-[1235px] px-4">

        <div className="flex min-h-[710px] items-center justify-between gap-[100px]">

          {/* LEFT - IMAGES*/}
          <div className="relative h-[530px] w-[415px] shrink-0 top-[-35px]">

            {/* Big Image */}
            <div className="absolute left-[-150] top-0 h-[590px] w-[515px] overflow-hidden rounded-[20px]">

           <Image
  src={getMediaUrl(content.bigImage)}
  alt="About SPS - Digital Transformation"
  fill
  priority
  sizes="415px"
  className="object-cover"
/>
            </div>

            {/* Small Overlapping Image */}
            <div className="absolute bottom-[80] right-0 z-10 h-[270px] w-[250px] left-[230px] overflow-hidden rounded-[20px]">

             <Image
  src={getMediaUrl(content.smallImage)}
  alt="Digital Transformation"
  fill
  sizes="200px"
  className="object-cover"
/>

            </div>

          </div>

          {/* RIGHT - CONTENT*/}
          <div className="w-full max-w-[650px]">

            {/* ABOUT US */}
            <span className="mb-[10px] block text-[20px] font-bold uppercase tracking-[0.5px] text-[#1554a6]">
              {content.label}
            </span>

            {/* HEADING */}
            <h2 className="m-0 text-[42px] font-extrabold leading-[1.25] tracking-[-0.5px] text-[#0a1f4e]">
              {content.title}
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-[18px] max-w-none text-[19px] font-normal leading-[1.7] text-[#5a75a3]">
              {content.description
                .split('\n')
                .map((line, index) => (
                  <Fragment key={index}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
            </p>

            {/* READ MORE */}
            <Link
              href={content.buttonLink}
              className="mt-[32px] inline-flex h-[52px] items-center justify-center gap-[10px] rounded-[10px] bg-[#2a5ab5] px-[26px] text-[17px] font-semibold text-white transition-colors duration-200 hover:bg-[#1f4a99]"
            >
              {content.buttonText}

              <svg
                className="h-[19px] w-[19px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}