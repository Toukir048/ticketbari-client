import { useEffect } from "react";

import { siteMeta } from "./metaDefaults";

const ensureMetaTag = (selector, attributes) => {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
};

const ensureCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const getAbsoluteUrl = (pathOrUrl) => {
  if (!pathOrUrl) return "";

  try {
    return new URL(pathOrUrl, window.location.origin).href;
  } catch {
    return "";
  }
};

const MetaTags = ({
  title,
  description = siteMeta.defaultDescription,
  image = siteMeta.defaultImage,
  type = "website",
  noIndex = false,
}) => {
  useEffect(() => {
    const resolvedTitle = title
      ? `${title} | ${siteMeta.siteName}`
      : siteMeta.defaultTitle;
    const resolvedUrl = window.location.href;
    const resolvedImage = getAbsoluteUrl(image);

    document.title = resolvedTitle;

    ensureMetaTag('meta[name="description"]', {
      name: "description",
      content: description,
    });
    ensureMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: resolvedTitle,
    });
    ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    ensureMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    ensureMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: resolvedUrl,
    });
    ensureMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: resolvedTitle,
    });
    ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    ensureCanonical(resolvedUrl);

    if (resolvedImage) {
      ensureMetaTag('meta[property="og:image"]', {
        property: "og:image",
        content: resolvedImage,
      });
      ensureMetaTag('meta[name="twitter:image"]', {
        name: "twitter:image",
        content: resolvedImage,
      });
    }

    const robots = document.head.querySelector('meta[name="robots"]');

    if (noIndex) {
      ensureMetaTag('meta[name="robots"]', {
        name: "robots",
        content: "noindex, nofollow",
      });
    } else if (robots) {
      robots.remove();
    }
  }, [description, image, noIndex, title, type]);

  return null;
};

export default MetaTags;

