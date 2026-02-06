import React from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: false,
    highlight: (code, language) => {
      const hasLanguage = Boolean(language && hljs.getLanguage(language));
      if (!hasLanguage) {
        return "";
      }

      try {
        const highlightedCode = hljs.highlight(code, {
          language,
          ignoreIllegals: true,
        }).value;

        return `<pre class="hljs"><code>${highlightedCode}</code></pre>`;
      } catch {
        return "";
      }
    },
  });
  const html = md.render(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
