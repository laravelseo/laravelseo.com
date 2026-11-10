#!/usr/bin/env python3
"""Import questions/json/*.json posts into the Astro blog collection.

Each JSON file becomes src/content/blog/<slug>.md, keeping the numeric id
in the slug (same convention as drupalcompany.com / magentocompany.com).

- title/description: from the JSON, description is the excerpt with
  markdown stripped, truncated at a word boundary.
- pubDate: the JSON date.
- author: the JSON author.
- image: left unset when the JSON has none; the site's own logo
  placeholder is rendered for imageless posts.
- tags: derived from title/content keywords (JSON ships tags: []).
- Mojibake (UTF-8 read as latin-1, e.g. 'â\x80\x94') is repaired when the
  round-trip re-encode/decode succeeds cleanly; otherwise left untouched.

Usage: python3 questions/import_json_to_blog.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JSON_DIR = ROOT / "questions" / "json"
OUT_DIR = ROOT / "src" / "content" / "blog"

TAG_RULES = [
    ("Laravel", r"\blaravel\b|\bartisan\b|\blivewire\b|\bcomposer\b|\beloquent\b|\bblade\b"),
    ("SEO", r"\bseo\b|\bsearch engine\b|\branking(?:s)?\b|\bserp\b"),
    ("Technical SEO", r"\bcrawl(?:er|ing)?\b|\bindex(?:ing|ation)?\b|\bsitemap\b|\brobots\.txt\b|\bcanonical\b|\bstatus code\b|\bredirect(?:s)?\b"),
    ("Content", r"\bcontent\b|\bcopywriting\b|\bblog(?:ging)?\b|\barticle(?:s)?\b"),
    ("Keywords", r"\bkeyword(?:s)?\b|\bsearch intent\b|\bqueries\b"),
    ("Links", r"\bbacklink(?:s)?\b|\blink building\b|\binternal link(?:s)?\b|\bnofollow\b|\banchor text\b"),
    ("Performance", r"\bpage ?speed\b|\bcore web vitals\b|\bperformance\b|\bcaching\b|\blighthouse\b"),
    ("JavaScript", r"\bjavascript\b|\breact\b|\bnext\.?js\b|\bvue\b|\bnode\b"),
    ("HTML", r"\bhtml\b|\bmeta\b|\bheading(?:s)?\b|\bschema\b|\bmarkup\b"),
    ("PHP", r"\bphp\b|\bphpstorm\b|\bxdebug\b"),
    ("Google", r"\bgoogle\b|\bsearch console\b|\banalytics\b|\bbot\b"),
    ("Errors", r"\berrors?\b|\bfatal\b|\bfailed\b|\bdenied\b|\brejected\b|\brefusing\b|\bcannot\b|\bcan't\b|\bunable\b|\bnot working\b|\bdoesn'?t work\b"),
]
COMPILED = [(tag, re.compile(pat, re.I)) for tag, pat in TAG_RULES]
MAX_TAGS = 4
FALLBACK_TAGS = ["Git"]

MOJIBAKE_RUN = re.compile(r"[-ÿ]{2,}")


def fix_mojibake(text: str) -> str:
    if not text:
        return text
    try:
        fixed = text.encode("latin-1").decode("utf-8")
        return fixed
    except (UnicodeEncodeError, UnicodeDecodeError):
        pass

    def fix_run(m: re.Match) -> str:
        run = m.group(0)
        try:
            return run.encode("latin-1").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            return run

    return MOJIBAKE_RUN.sub(fix_run, text)


def strip_markdown(text: str) -> str:
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"(?m)^\s*[=-]{3,}\s*$", " ", text)
    text = re.sub(r"(?<!\S)[=-]{3,}(?!\S)", " ", text)
    text = re.sub(r"[#*>_~-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def truncate(text: str, max_len: int = 160) -> str:
    if len(text) <= max_len:
        return text
    cut = text[:max_len].rsplit(" ", 1)[0].rstrip(".,;:")
    return cut + "..."


def yaml_dq(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def derive_tags(title: str, content: str) -> list:
    haystack = title + "\n" + (content or "")[:2000]
    tags = [tag for tag, rx in COMPILED if rx.search(haystack)]
    return tags[:MAX_TAGS] or list(FALLBACK_TAGS)


def setext_to_atx(content: str) -> str:
    """Turn "Title\n=====" / "Title\n-----" headings into ATX headings so the
    H1 handling below sees them (outside code fences only)."""
    lines = content.split("\n")
    out = []
    in_fence = False
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        nxt = lines[i + 1].strip() if i + 1 < len(lines) else ""
        if (not in_fence and line.strip() and not line.startswith((" ", "\t", "#", ">", "-", "*", "|", "`"))
                and re.fullmatch(r"=+|-{3,}", nxt)):
            out.append(("# " if nxt[0] == "=" else "## ") + line.strip())
            i += 2
            continue
        out.append(line)
        i += 1
    return "\n".join(out)


def heading_slug(text: str) -> str:
    text = re.sub(r"[`*_]|\[|\]\([^)]*\)", "", text.lower())
    text = re.sub(r"[^\w\- ]", "", text)
    return text.replace(" ", "-")


def drop_dead_anchors(content: str) -> str:
    """Replace [text](#anchor) with plain text when no heading has that id
    (some generated posts carry a table of contents for headings that do not exist)."""
    slugs = set()
    in_fence = False
    for line in content.split("\n"):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        elif not in_fence and re.match(r"#{1,6} ", line):
            slugs.add(heading_slug(line.lstrip("# ").strip()))
    return re.sub(r"\[([^\]]+)\]\(#([^)]+)\)", lambda m: m.group(0) if m.group(2) in slugs else m.group(1), content)


LEAD_MARKER = re.compile(r"\[(?P<inner>[^\]\n]{0,160})\](?!\()(?P<rest>[^\n]*)")
MARKER_PREFIX = re.compile(
    r"^\s*(?:/?system_prompt|h1|(?:laravel ?company(?:\.com)? )?blog (?:post|title)|blog|post)\b[\s:\-]*",
    re.I,
)


def strip_lead_marker(text: str, as_heading: bool) -> str:
    """Generator artifacts such as "[BLOG POST]", "[H1] Title [H1]" or
    "[Blog Post: Title]" can open a post. Drop the marker; keep any title
    text it carried (as an H2 in the body, plain text in the description)."""
    stripped = text.lstrip()
    lead = text[: len(text) - len(stripped)]
    m = LEAD_MARKER.match(stripped)
    if not m:
        return text
    inner = MARKER_PREFIX.sub("", m.group("inner")).strip()
    rest = re.sub(r"\[/?h1\]", "", m.group("rest"), flags=re.I).strip()
    title = rest or inner
    tail = stripped[m.end():].lstrip("\n")
    if not title:
        return lead + tail
    if as_heading:
        return lead + f"## {title}\n\n" + tail
    return lead + title + (" " + tail if tail else "")


def normalize_headings(content: str) -> str:
    """Drop the leading H1 (the page template renders the title as the one
    H1) and demote any later H1s to H2 so each built page has exactly one.
    """
    # Some posts are raw HTML: drop a leading <h1>, demote any other.
    content = re.sub(r"\A\s*<h1[^>]*>.*?</h1>\s*", "", content, count=1, flags=re.S | re.I)
    content = re.sub(r"<(/?)h1\b", r"<\1h2", content, flags=re.I)
    lines = setext_to_atx(content).split("\n")
    out = []
    in_fence = False
    first_h1_dropped = False
    for line in lines:
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            out.append(line)
            continue
        if not in_fence and line.startswith("# "):
            if not first_h1_dropped and not any(l.strip() for l in out):
                first_h1_dropped = True
                continue
            out.append("#" + line)
            continue
        out.append(line)
    return drop_dead_anchors("\n".join(out).strip())


def main() -> int:
    files = sorted(JSON_DIR.glob("*.json"))
    if not files:
        print("no JSON posts found", file=sys.stderr)
        return 1
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    existing = {p.stem for p in OUT_DIR.glob("*.md")}
    written = skipped = fixed = 0
    for path in files:
        slug = path.stem
        if slug in existing:
            skipped += 1
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        title = fix_mojibake(data.get("title", "").strip())
        excerpt = fix_mojibake(data.get("excerpt", "") or "")
        content = fix_mojibake(data.get("content", "") or "")
        if any("â" in s for s in (data.get("title", ""), data.get("excerpt", "") or "", data.get("content", "") or "")) and "â" not in title + excerpt + content:
            fixed += 1
        description = truncate(strip_markdown(strip_lead_marker(excerpt, False)))
        tags = derive_tags(title, content)
        fm = [
            "---",
            f"title: {yaml_dq(title)}",
            f"description: {yaml_dq(description)}",
            f"pubDate: {data.get('date', '').strip()}",
            f"author: {yaml_dq(data.get('author', '').strip() or 'Laravel Git')}",
        ]
        if data.get("image"):
            fm.append(f"image: {yaml_dq(data['image'])}")
            fm.append(f"imageAlt: {yaml_dq(title)}")
        fm.append("tags: [" + ", ".join(yaml_dq(t) for t in tags) + "]")
        fm.append("featured: false")
        fm.append("---")
        body = normalize_headings(strip_lead_marker(content, True))
        (OUT_DIR / f"{slug}.md").write_text("\n".join(fm) + "\n\n" + body + "\n", encoding="utf-8")
        written += 1
    print(f"written={written} skipped_existing={skipped} mojibake_fixed={fixed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
