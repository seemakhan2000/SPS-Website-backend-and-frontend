
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { HeroSlide, HomeContent } from '@/types/cms';
import Link from 'next/link';
import { apiFetch, getMediaUrl } from '@/lib/api';

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);


  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ==============================
  // LOAD HERO DATA FROM API
  // ==============================
  useEffect(() => {
    const loadHeroContent = async () => {
      try {

        const data = await apiFetch<HomeContent>('/content/home');

        setSlides(data.heroSlides || []);
      } catch (error) {
        console.error('Failed to load hero content:', error);
      }
    };

    loadHeroContent();
  }, []);


  // SAFE VIDEO PLAY FUNCTION
  const playVideo = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused && isPlaying) {
        await videoRef.current.play();
        setIsVideoReady(true);
      }
    } catch (error) {
      console.log('Video play error:', error);
      setIsVideoReady(false);
    }
  }, [isPlaying]);


  // AUTO SLIDE
  useEffect(() => {
    if (isPlaying && isVideoReady && slides.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(
          (prevSlide) => (prevSlide + 1) % slides.length
        );
      }, 8000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isVideoReady, slides.length]);


  // HANDLE VIDEO ON SLIDE CHANGE
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !slides.length) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);

      if (isPlaying) {
        playVideo();
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentSlide, isPlaying, playVideo, slides.length]);


  // SLIDE CONTROLS
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(true);
    setIsVideoReady(false);
  };

  const nextSlide = () => {
    if (!slides.length) return;

    setCurrentSlide(
      (prev) => (prev + 1) % slides.length
    );

    setIsVideoReady(false);
  };

  const prevSlide = () => {
    if (!slides.length) return;

    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );

    setIsVideoReady(false);
  };


  // RETRY VIDEO
  const handleRetry = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      video.load();
      await playVideo();
    } catch (error) {
      console.log('Retry failed:', error);
    }
  };

  // ==============================
  // EMPTY DATA
  // ==============================
  if (!slides.length) {
    return (
      <section className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-lg">
            No hero content available.
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">

      {/*VIDEO BACKGROUND*/}
      <div className="absolute inset-0 w-full h-full">

       <video
  ref={videoRef}
  key={currentSlide}
  src={getMediaUrl(currentSlideData.video)}
  autoPlay
  muted
  loop={false}
  playsInline
  preload="auto"
  className="w-full h-full object-cover"
  onCanPlay={() => {
    setIsVideoReady(true);
  }}
  onEnded={() => {
    setCurrentSlide(
      (prev) => (prev + 1) % slides.length
    );
  }}
  onError={(e) => {
    const video = e.currentTarget;

    console.error("Hero video playback error:", {
      src: video.currentSrc,
      errorCode: video.error?.code,
      errorMessage: video.error?.message,
    });

    setIsVideoReady(false);
  }}
>
  Your browser does not support the video tag.
</video>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* ERROR INDICATOR*/}
      {!isVideoReady && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-xs z-20 border border-red-500/30">

          <svg
            className="w-4 h-4 text-red-500 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          

          <button
            onClick={handleRetry}
            className="ml-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* CONTENT*/}
      <div className="absolute inset-0 flex items-center">

        <div className="container mx-auto px-4 md:px-8 z-10">

          <div className="max-w-3xl text-white">

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white">
              {currentSlideData.title}
            </h1>

            {/* Subtitle */}
            {currentSlideData.subtitle && (
              <h2 className="text-xl md:text-2xl text-blue-400 mb-4">
                {currentSlideData.subtitle}
              </h2>
            )}

            {/* Description */}
            {currentSlideData.isList ? (

              <ul className="list-disc pl-5 space-y-2 text-white/90 text-base md:text-lg mb-8">

                {currentSlideData.description.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>

            ) : (

              <div className="space-y-2 text-white/90 text-base md:text-lg mb-8">

                {currentSlideData.description.map(
                  (item, index) => (
                    <p key={index}>
                      {item}
                    </p>
                  )
                )}

              </div>

            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">

              <Link
                href={currentSlideData.buttonLink}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors"
              >
                {currentSlideData.buttonText}
              </Link>

              <Link
                href={currentSlideData.buttonLink}
                className="px-6 py-3 border border-white/30 hover:border-white/60 text-white font-semibold rounded-full transition-colors"
              >
                Contact Us
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/*PREVIOUS BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors z-10 border border-white/20 hover:border-white/40"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* NEXT BUTTON*/}
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors z-10 border border-white/20 hover:border-white/40"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

    </section>
  );
}