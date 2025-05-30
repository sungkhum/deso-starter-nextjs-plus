import { memo } from 'react'; // Import memo
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const formatMentionsAndCoins = (text) => { // Keep this export if used elsewhere
  if (!text) return '';

  // Step 0: Normalize escaped underscore
  const safeText = text.replace(/\\_/g, '_');

  // Step 1: Format mentions and coins
  return safeText
    // @username → [@username](/username)
    .replace(/(^|\s)@([a-zA-Z0-9_]{1,30})(?!\w)/g, '$1[@$2](/$2)')
    // $COIN → [$COIN](/COIN)
    .replace(/(^|\s)\$([a-zA-Z0-9_]{1,30})(?!\w)/g, '$1[$$$2](/$2)');  
};

export const normalizeLineBreaks = (text) => {
  return text
    // Step 1: removes lone backslashes before real \n, fixing \\\n, \\\\\n, etc.
    .replace(/\\+(?=\n)/g, '')
    // Step 2: turns escaped \n into a proper line break
    .replace(/\\n/g, '  \n')
    // Step 3: Replace all *single* real newlines (not \n\n) with a line break
    .replace(/([^\n])\n(?!\n)/g, '$1  \n');  
};

// const normalizeLineBreaks definition removed from here

const MarkdownTextComponent = ({ text, onInternalLinkClick = null }) => {
  const router = useRouter();
  
  const normalized = normalizeLineBreaks(text); // Uses the single exported version
  const processed = formatMentionsAndCoins(normalized); // Uses the single exported version

  return (
    <ReactMarkdown
      children={processed}
      remarkPlugins={[remarkGfm]}
      skipHtml
      disallowedElements={['script', 'iframe']}
      components={{
        a: ({ node, href, ...props }) => {
          const isInternal = href?.startsWith('/');
          
          if (isInternal) {
            return (
              <Link 
                href={href} 
                {...props} 
                onClick={(e) => {
                  //console.log('Internal link clicked:', href);
                  
                  // Only use custom handling if we have a valid callback function
                  if (typeof onInternalLinkClick === 'function') {
                    //console.log('Calling onInternalLinkClick callback');
                    // Prevent default navigation
                    e.preventDefault();
                    // Stop propagation to prevent parent card click
                    e.stopPropagation();
                    
                    // Call the callback to close search results first
                    onInternalLinkClick();
                    
                    // Navigate immediately
                    router.push(href);
                  } else {
                    //console.log('No valid callback, using normal Link navigation');
                    // Just stop propagation for normal internal links
                    e.stopPropagation();
                    // Let Next.js Link handle navigation normally
                  }
                }}
              />
            );
          }
          
          return (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props}
              onClick={(e) => {
                // Prevent parent click for external links
                e.stopPropagation();
              }}
            />
          );
        },
      }}      
    />
  );
};

// NOTE:
// Markdown images from external hosts (e.g., Slack, Google Drive, private CDNs) 
// may trigger CSP warnings in some browsers due to how certain image URLs are parsed,
// or how those services handle cookies, redirects, or cross-origin headers.
//
// Example:
//   ![image.png](https://files.slack.com/files-pri/T02B2KBJY5Q-F08RQ3W1VFB/image.png)
//
// This can result in warnings like:
//   "Content Security Policy of your site blocks the use of 'eval' in JavaScript"
//   or "Third-party cookie will be blocked"
//
// These warnings are safe to ignore and do not impact functionality or security.
// We're preserving user-submitted Markdown as-is, without stripping or transforming content.

export const MarkdownText = memo(MarkdownTextComponent);
