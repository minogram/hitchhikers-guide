import sanitizeHtml from "sanitize-html";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className = "" }: SafeHtmlProps) {
  const clean = sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "strong", "em", "s", "u",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "img", "a",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel", "class"],
      img: ["src", "alt", "title", "width", "height"],
    },
    disallowedTagsMode: "discard",
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });

  return (
    <div
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
