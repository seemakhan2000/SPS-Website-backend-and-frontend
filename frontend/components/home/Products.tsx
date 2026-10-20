
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { apiFetch, getMediaUrl } from '@/lib/api';

import type {
  ProductsContent,
  HomeContent,
} from '@/types/cms';

export default function Products() {
  const [content, setContent] =
    useState<ProductsContent | null>(null);

  // LOAD PRODUCTS DATA FROM DATABASE
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data =
          await apiFetch<HomeContent>(
            '/content/home'
          );

        setContent(data.products);
      } catch (error) {
        console.error(
          'Failed to load Products content:',
          error
        );
      }
    };

    loadProducts();
  }, []);


  // NO DATA
  if (!content) {
    return (
      <section className="relative w-full bg-[#203a70] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 py-8 md:py-10">
          <div className="min-h-[700px] flex items-center justify-center">
            <p className="text-white">
              Products content not available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-[#203a70] overflow-hidden">

      <div className="max-w-[1240px] mx-auto px-5 py-8 md:py-10">

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[600px_1fr]
            gap-8
            lg:gap-[50px]
            items-center
          "
        >

          {/* LEFT IMAGE*/}
          <div className="relative w-full h-[600px] md:h-[650px] lg:h-[700px] rounded-[28px] overflow-hidden">

            <Image
              src={getMediaUrl(
                content.backgroundImage
              )}
              alt="Driving Innovation"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />

            {/* YEARS BLUE BOX*/}
            <div
              className="
                absolute
                right-0
                bottom-0
                w-[180px]
                h-[185px]
                md:w-[190px]
                md:h-[195px]
                bg-[#2860bd]
                rounded-tl-[25px]
                flex
                items-center
                justify-center
                text-center
              "
            >

              <div className="text-white">

                {/* YEARS NUMBER */}
                <div className="text-[52px] md:text-[58px] font-bold leading-none">
                  {content.yearsNumber}
                </div>

                {/* YEARS TEXT */}
                <div className="mt-2 text-[20px] md:text-[22px] font-semibold leading-[1.25] whitespace-pre-line">
                  {content.yearsText}
                  <br />

                  {content.yearsDescription
                    ?.split('\n')
                    .map((line, index) => (
                      <span key={index}>
                        {index > 0 && <br />}
                        {line}
                      </span>
                    ))}
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE*/}
          <div className="w-full">

            {/*HEADING*/}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">

              <h2 className="text-white text-[50px] font-bold leading-tight whitespace-pre-line">
                {content.title}
              </h2>

            </div>

            {/*PRODUCT CARDS*/}
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                w-full
                gap-4
                sm:gap-3
                md:gap-4
              "
            >

              {content.products.map(
                (product, index) => {

                  const isTallCard =
                    index === 1 ||
                    index === 3;

                  return (
                    <div
                      key={`${product.name}-${index}`}
                      className={`
                        relative
                        px-5
                        pt-5
                        pb-4
                        text-center
                        bg-[#2d477a]
                        transition-all
                        duration-300
                        flex
                        flex-col
                        items-center
                        justify-center
                        hover:bg-[#1E4B9E]
                        rounded-[16px]
                        shadow-lg
                        border
                        border-white/5

                        ${isTallCard
                          ? 'h-[340px] sm:h-[360px] md:h-[400px]'
                          : 'h-[340px] sm:h-[350px] md:h-[370px]'
                        }
                      `}
                    >

                      {/* PRODUCT IMAGE*/}
                      <div className="relative mx-auto w-[100px] h-[60px] mb-3">

                        <Image
                          src={getMediaUrl(
                            product.image
                          )}
                          alt={product.name}
                          fill
                          sizes="100px"
                          className="object-contain"
                        />

                      </div>

                      {/*PRODUCT TITLE */}
                      <h3 className="text-white text-[18px] md:text-[19px] font-bold leading-[1.2] mb-2">
                        {product.name}
                      </h3>

                      {/* PRODUCT DESCRIPTION*/}
                      <p className="text-[#c5d0e8] text-[14px] leading-[1.4] font-normal max-w-[190px] mx-auto whitespace-pre-line">
                        {product.description}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

