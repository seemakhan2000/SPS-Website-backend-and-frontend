
import { LoadingIcon } from "@/lib/icons";

type LoaderProps = {
  variant?: "spinner" | "skeleton";
  fullScreen?: boolean;
  size?: number;
  lines?: number;
  className?: string;
};

export default function Loader({
  variant = "spinner",
  fullScreen = false,
  size = 40,
  lines = 3,
  className = "",
}: LoaderProps) {
  const wrapperHeight = fullScreen ? "min-h-screen" : "min-h-[300px]";

  // SPINNER
  if (variant === "spinner") {
    return (
      <div
        className={`flex items-center justify-center ${wrapperHeight} ${className}`}
      >
        <LoadingIcon
          className="animate-spin text-[#1554a6]"
          size={size}
        />
      </div>
    );
  }

  // SKELETON
  return (
    <div
      className={`w-full animate-pulse space-y-4 ${className}`}
    >
      <div className="h-48 w-full rounded-[16px] bg-gray-200" />

      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 rounded bg-gray-200 ${
            index === lines - 1 ? "w-2/3" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}

