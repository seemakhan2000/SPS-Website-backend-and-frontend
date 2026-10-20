import Image from "next/image";

interface HighlightsContent {
  image: string;
  alt: string;
  title: string;
  description: string;
}

interface HomeContentResponse {
  highlights?: HighlightsContent | null;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

async function getHighlights(): Promise<HighlightsContent | null> {
  try {
    const response = await fetch(
      `${API_URL}/content/home`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch Highlights:",
        response.status
      );

      return null;
    }

    const data: HomeContentResponse =
      await response.json();

    return data.highlights || null;
  } catch (error) {
    console.error(
      "Highlights DB fetch error:",
      error
    );

    return null;
  }
}

function getMediaUrl(filePath: string) {
  if (!filePath) {
    return "";
  }

  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://")
  ) {
    return filePath;
  }

  if (filePath.startsWith("/uploads/")) {
    const backendUrl =
      API_URL.replace(/\/api\/?$/, "");

    return `${backendUrl}${filePath}`;
  }

  return filePath;
}

export default async function Highlights() {

  // GET EXACT HIGHLIGHTS DATA FROM DATABASE
  const highlights = await getHighlights();
  // DB DATA NOT AVAILABLE
  if (!highlights) {
    return null;
  }

  const imageUrl = getMediaUrl(
    highlights.image
  );

  return (
    <section className="relative flex min-h-[420px] w-full items-center overflow-hidden md:min-h-[480px]">

      {/*Background Image*/}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={highlights.alt || "Highlights"}
          fill
          priority
          className="object-cover object-center"
          unoptimized={imageUrl.startsWith(
            "http"
          )}
        />
      )}


      <div className="absolute inset-0 bg-[#101C4F]/85" />

      {/* DB CONTENT*/}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 text-center md:py-20">

        {/* Title */}
        <h2 className="mx-auto mb-6 max-w-4xl text-2xl font-bold leading-snug text-white md:text-4xl">
          {highlights.title}
        </h2>

        {/* Description */}
        <p className="mx-auto max-w-6xl text-base leading-relaxed text-white/90 md:text-lg">
          {highlights.description}
        </p>

      </div>
    </section>
  );
}