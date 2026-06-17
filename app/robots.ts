import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/agency",
          "/portal",
          "/api",
          "/onboarding",
          "/gmail",
          "/linkedin",
          "/instagram",
          "/reset-password",
          "/forgot-password",
        ],
      },
    ],
    sitemap: "https://leadmagnetinc.com/sitemap.xml",
  };
}
