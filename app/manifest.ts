import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ODM Groove Hotel & Event Hall",
    short_name: "ODM Groove",
    description:
      "Premium boutique hotel and 200+ capacity event hall in Ijoko Ogbayo, Ogun State, Nigeria.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#c8a84b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

