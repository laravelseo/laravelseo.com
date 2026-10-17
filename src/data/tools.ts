// The real tool list, mirroring what is live at https://app.laravelseo.com/tools
// (categories and names as shown in the app itself). Every entry links to the
// working tool. All tools are free and work without an account.

export interface ToolEntry {
  name: string;
  slug: string;
  desc: string;
}

export interface ToolCategory {
  name: string;
  blurb: string;
  tools: ToolEntry[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: "Research",
    blurb: "Check how a site looks from the outside: availability, certificate, DNS, redirects and a full Lighthouse audit.",
    tools: [
      { name: "Website status checker", slug: "website-status-checker", desc: "Is a site up? Get the HTTP status code and load time." },
      { name: "SSL checker", slug: "ssl-checker", desc: "Verify a certificate: issuer, validity dates and signature algorithm." },
      { name: "DNS lookup", slug: "dns-lookup", desc: "Read a domain's DNS records." },
      { name: "WHOIS lookup", slug: "whois-lookup", desc: "Look up domain registration and ownership records." },
      { name: "IP lookup", slug: "ip-lookup", desc: "Geolocation and network details for any IP address." },
      { name: "Reverse IP lookup", slug: "reverse-ip-lookup", desc: "Find the domains hosted on the same IP address." },
      { name: "Domain IP lookup", slug: "domain-ip-lookup", desc: "Resolve a domain to its IP addresses." },
      { name: "Redirect checker", slug: "redirect-checker", desc: "Follow a URL's redirect chain and see every hop's status code." },
      { name: "IDN converter", slug: "idn-converter", desc: "Convert internationalized domain names to Punycode and back." },
      { name: "Lighthouse SEO audit", slug: "lighthouse", desc: "Run a Google Lighthouse audit on any URL." },
      { name: "Black SEO analyzer", slug: "black-seo-analyzer", desc: "Flag risky black-hat SEO patterns on a page." },
    ],
  },
  {
    name: "Developer",
    blurb: "Everyday utilities for shipping and debugging web projects.",
    tools: [
      { name: "JS minifier", slug: "js-minifier", desc: "Compress JavaScript for production." },
      { name: "CSS minifier", slug: "css-minifier", desc: "Compress CSS for production." },
      { name: "HTML minifier", slug: "html-minifier", desc: "Strip whitespace and comments from HTML." },
      { name: "JSON validator", slug: "json-validator", desc: "Validate and format JSON, with errors pointed out." },
      { name: "Password generator", slug: "password-generator", desc: "Generate strong random passwords." },
      { name: "QR generator", slug: "qr-generator", desc: "Turn any text or URL into a QR code." },
      { name: "User-Agent parser", slug: "user-agent-parser", desc: "Break a User-Agent string into browser, OS and device." },
      { name: "MD5 generator", slug: "md5-generator", desc: "Hash any string with MD5." },
      { name: "Color converter", slug: "color-converter", desc: "Convert colors between HEX, RGB, HSL and more." },
      { name: "UTM builder", slug: "utm-builder", desc: "Build campaign URLs with UTM parameters." },
      { name: "URL parser", slug: "url-parser", desc: "Split a URL into scheme, host, path, query and fragment." },
      { name: "UUID generator", slug: "uuid-generator", desc: "Generate random UUIDs." },
    ],
  },
  {
    name: "Content",
    blurb: "Text helpers for writing, editing and cleaning up content.",
    tools: [
      { name: "Lorem ipsum generator", slug: "lorem-ipsum-generator", desc: "Placeholder text in paragraphs, sentences or words." },
      { name: "Text cleaner", slug: "text-cleaner", desc: "Strip extra whitespace, line breaks and formatting from pasted text." },
      { name: "Word density counter", slug: "word-density-counter", desc: "See which words and phrases a text repeats most." },
      { name: "Word counter", slug: "word-counter", desc: "Count words, characters and sentences." },
      { name: "Case converter", slug: "case-converter", desc: "Switch text between upper, lower, title and sentence case." },
      { name: "Text to slug converter", slug: "text-to-slug-converter", desc: "Turn a title into a URL-safe slug." },
      { name: "URL converter", slug: "url-converter", desc: "URL-encode or decode a string." },
      { name: "Base64 converter", slug: "base64-converter", desc: "Encode and decode Base64." },
      { name: "Binary converter", slug: "binary-converter", desc: "Convert text to binary and back." },
      { name: "Text replacer", slug: "text-replacer", desc: "Find and replace across a whole block of text." },
      { name: "Text reverser", slug: "text-reverser", desc: "Reverse a string." },
      { name: "Number generator", slug: "number-generator", desc: "Generate random numbers in a range." },
    ],
  },
];

export const TOOL_COUNT = TOOL_CATEGORIES.reduce((n, c) => n + c.tools.length, 0);
export const APP_TOOLS_BASE = "https://app.laravelseo.com/tools";
