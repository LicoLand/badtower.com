#!/usr/bin/env python3
"""Validate the static site: local targets, fragments, symbol references,
canonical metadata, crawler files and the custom-domain binding."""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ORIGIN = "https://badtower.com"
SECTIONS = ("station", "contract", "trust", "run", "plugins", "status", "faq")
PAGES = {"/": ROOT / "index.html", **{f"/{name}/": ROOT / name / "index.html" for name in SECTIONS}}


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.uses, self.canonical = [], [], [], None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "use" and attrs.get("href"):
            self.uses.append(attrs["href"])
            return
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        for name in ("href", "src"):
            if attrs.get(name):
                self.links.append(attrs[name])


def main():
    failures = []
    for route, path in PAGES.items():
        page = Page()
        page.feed(path.read_text(encoding="utf-8"))
        if page.canonical != ORIGIN + route:
            failures.append(f"{route}: canonical URL is {page.canonical!r}")
        for duplicate in sorted({i for i in page.ids if page.ids.count(i) > 1}):
            failures.append(f"{route}: duplicate id #{duplicate}")
        for use in page.uses:
            if not use.startswith("#") or use[1:] not in page.ids:
                failures.append(f"{route}: <use> targets missing symbol {use}")
        for link in page.links:
            if re.match(r"^(https?:|mailto:)", link):
                continue
            target, _, fragment = link.partition("#")
            if target and target not in PAGES and not (ROOT / target.lstrip("/")).is_file():
                failures.append(f"{route}: missing local target {link}")
            if fragment and not target and fragment not in page.ids:
                failures.append(f"{route}: missing fragment #{fragment}")

    if (ROOT / "CNAME").read_text(encoding="utf-8").strip() != "badtower.com":
        failures.append("CNAME must contain only badtower.com")
    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    if re.findall(r"<loc>([^<]+)</loc>", sitemap) != [ORIGIN + route for route in PAGES]:
        failures.append("sitemap.xml must list each canonical page exactly once")
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if f"Sitemap: {ORIGIN}/sitemap.xml" not in robots:
        failures.append("robots.txt must advertise the canonical sitemap")
    for path in ROOT.glob("*.js"):
        if re.search(r"https?://(?!www\.w3\.org/)", path.read_text(encoding="utf-8")):
            failures.append(f"{path.name}: scripts must not reference external hosts")

    if failures:
        print("\n".join(failures))
        return 1
    print(f"site validation passed: {len(PAGES)} canonical pages")
    return 0


if __name__ == "__main__":
    sys.exit(main())
