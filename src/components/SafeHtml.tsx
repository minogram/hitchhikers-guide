import DOMPurify from "isomorphic-dompurify";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className = "" }: SafeHtmlProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "strong", "em", "s", "u",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "img", "a",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class", "width", "height"],
    ADD_ATTR: ["target"],
    FORBID_ATTR: ["style", "onerror", "onload"],
  });

  // Force rel="noopener noreferrer" on all links
  const safeHtml = clean.replace(
    /<a\s/g,
    '<a rel="noopener noreferrer" '
  );

  return (
    <div
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
