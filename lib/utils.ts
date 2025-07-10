import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses text for [PRIMARY_SOURCE: url] references and [POSTER_IMAGE: url] references, 
 * replaces them with [n] links and inline images, and returns an array of parts and sources/images.
 * @param text The message text to parse
 * @returns { parts: { type: 'text' | 'link' | 'image', value: string, index?: number }[], sources: { url: string, index: number }[], images: { url: string, index: number }[] }
 *
 * NOTE: Rendering of links and images should be handled in the component, not here.
 */
export function parseSourcesInText(text: string): { 
  parts: { type: 'text' | 'link' | 'image', value: string, index?: number }[], 
  sources: { url: string, index: number }[], 
  images: { url: string, index: number }[] 
} {
  // Regex patterns
  const sourceRegex = /\[PRIMARY_SOURCE: ([^\]]+)\]/g;
  const imageRegex = /\[POSTER_IMAGE: ([^\]]+)\]/g;
  
  const sources: string[] = [];
  const images: string[] = [];
  const parts: { type: 'text' | 'link' | 'image', value: string, index?: number }[] = [];
  
  // Find all matches (sources and images) with their positions
  const allMatches: { type: 'source' | 'image', index: number, length: number, url: string }[] = [];
  
  let match;
  
  // Find all PRIMARY_SOURCE matches
  while ((match = sourceRegex.exec(text)) !== null) {
    allMatches.push({
      type: 'source',
      index: match.index,
      length: match[0].length,
      url: match[1]
    });
  }
  
  // Find all POSTER_IMAGE matches
  while ((match = imageRegex.exec(text)) !== null) {
    allMatches.push({
      type: 'image',
      index: match.index,
      length: match[0].length,
      url: match[1]
    });
  }
  
  // Sort matches by position in text
  allMatches.sort((a, b) => a.index - b.index);
  
  let lastIndex = 0;
  
  // Process each match in order
  for (const matchItem of allMatches) {
    // Add text before this match
    if (matchItem.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, matchItem.index) });
    }
    
    if (matchItem.type === 'source') {
      // Handle PRIMARY_SOURCE
      let sourceIndex = sources.indexOf(matchItem.url);
      if (sourceIndex === -1) {
        sources.push(matchItem.url);
        sourceIndex = sources.length - 1;
      }
      parts.push({ type: 'link', value: matchItem.url, index: sourceIndex + 1 });
    } else if (matchItem.type === 'image') {
      // Handle POSTER_IMAGE
      let imageIndex = images.indexOf(matchItem.url);
      if (imageIndex === -1) {
        images.push(matchItem.url);
        imageIndex = images.length - 1;
      }
      parts.push({ type: 'image', value: matchItem.url, index: imageIndex + 1 });
    }
    
    lastIndex = matchItem.index + matchItem.length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }
  
  return {
    parts,
    sources: sources.map((url, i) => ({ url, index: i + 1 })),
    images: images.map((url, i) => ({ url, index: i + 1 }))
  };
} 