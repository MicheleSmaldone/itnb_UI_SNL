import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses text for [PRIMARY_SOURCE: url] references, replaces them with [n] links, and returns an array of parts (text or link) and sources.
 * @param text The message text to parse
 * @returns { parts: { type: 'text' | 'link', value: string, index?: number }[], sources: { url: string, index: number }[] }
 *
 * NOTE: Rendering of links should be handled in the component, not here.
 */
export function parseSourcesInText(text: string): { parts: { type: 'text' | 'link', value: string, index?: number }[], sources: { url: string, index: number }[] } {
  // Regex to match [PRIMARY_SOURCE: url]
  const regex = /\[PRIMARY_SOURCE: ([^\]]+)\]/g;
  const sources: string[] = [];
  let match;
  let lastIndex = 0;
  const parts: { type: 'text' | 'link', value: string, index?: number }[] = [];

  while ((match = regex.exec(text)) !== null) {
    // Push preceding text
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    const url = match[1];
    let sourceIndex = sources.indexOf(url);
    if (sourceIndex === -1) {
      sources.push(url);
      sourceIndex = sources.length - 1;
    }
    // Insert the [n] link
    parts.push({ type: 'link', value: url, index: sourceIndex + 1 });
    lastIndex = match.index + match[0].length;
  }
  // Push any remaining text
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }
  // Return both the content and the sources with their indices
  return {
    parts,
    sources: sources.map((url, i) => ({ url, index: i + 1 }))
  };
} 