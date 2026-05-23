import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/orders/create": ["./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },
  serverExternalPackages: ["@napi-rs/canvas", "mammoth", "pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
