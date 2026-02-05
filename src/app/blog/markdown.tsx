import React from "react";
import MarkdownIt from "markdown-it";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
  const html = md.render(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
