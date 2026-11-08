
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
      ...(options.headers || {}),
    },
  });

  const contentType =
    response.headers.get("content-type") || "";

  let data: any;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();

    console.error("Non JSON response:", text);

    throw new Error(
      `Server returned ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}

export function getMediaUrl(
  filePath: string | null | undefined
) {
  if (!filePath) return "";

  // Cloudinary or any complete HTTP/HTTPS URL
  if (/^https?:\/\//i.test(filePath)) {
    return filePath;
  }

  // Uploaded CMS files → Backend
  if (filePath.startsWith("/uploads/")) {
    const backendUrl = API_URL.replace(/\/api\/?$/, "");
    return `${backendUrl}${filePath}`;
  }

  // Frontend public assets
  return filePath;
}
