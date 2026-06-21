import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  GITHUB_URL,
  LINKEDIN_URL,
} from "@/lib/site";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: SITE_NAME,
        url: SITE_URL,
        jobTitle: SITE_TAGLINE,
        worksFor: { "@type": "Organization", name: "MapaGlobal" },
        sameAs: [GITHUB_URL, LINKEDIN_URL],
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
