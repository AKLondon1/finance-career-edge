import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@napi-rs/canvas", "mammoth", "pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
