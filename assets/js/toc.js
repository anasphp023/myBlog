// Table of Contents — project override of the Mana theme's assets/js/toc.js.
//
// Why this replaces the theme version: the theme picked the active heading with
// `element.offsetTop <= window.scrollY + OFFSET`. offsetTop is measured from the
// nearest positioned ancestor, and theme.css sets `body > * { position: relative }`,
// which makes <main> the offsetParent of every heading. So offsetTop was short by
// main's distance from the top of the document and the highlight tracked wrong.
// getBoundingClientRect() is viewport-relative and has no such dependency.
//
// Constants (WIDE_SCREEN_BREAKPOINT, TOC_SCROLL_OFFSET, TOC_RESIZE_DEBOUNCE) come
// from common/constants.js, which is concatenated ahead of this file.

function isWideScreen() {
  return window.innerWidth > WIDE_SCREEN_BREAKPOINT;
}

function expandTOC(tocToggle, tocContent) {
  tocToggle.setAttribute("aria-expanded", "true");
  tocContent.classList.add("expanded");
}

function collapseTOC(tocToggle, tocContent) {
  tocToggle.setAttribute("aria-expanded", "false");
  tocContent.classList.remove("expanded");
}

function toggleTOC(tocToggle, tocContent) {
  if (tocToggle.getAttribute("aria-expanded") === "true") {
    collapseTOC(tocToggle, tocContent);
  } else {
    expandTOC(tocToggle, tocContent);
  }
}

function initializeTOCState(tocToggle, tocContent) {
  if (isWideScreen()) {
    expandTOC(tocToggle, tocContent);
  } else {
    collapseTOC(tocToggle, tocContent);
  }
}

/** Keep the active row visible inside a scrollable TOC panel. */
function revealActiveLink(link, tocContent) {
  if (!link || !tocContent.classList.contains("expanded")) return;
  if (tocContent.scrollHeight <= tocContent.clientHeight) return;

  const linkBox = link.getBoundingClientRect();
  const panelBox = tocContent.getBoundingClientRect();

  if (linkBox.top < panelBox.top) {
    tocContent.scrollTop -= panelBox.top - linkBox.top + 16;
  } else if (linkBox.bottom > panelBox.bottom) {
    tocContent.scrollTop += linkBox.bottom - panelBox.bottom + 16;
  }
}

function setActive(entries, activeEntry, tocContent) {
  let changed = false;
  entries.forEach(({ link }) => {
    const shouldBeActive = activeEntry != null && link === activeEntry.link;
    if (link.classList.contains("active") !== shouldBeActive) {
      link.classList.toggle("active", shouldBeActive);
      changed = true;
    }
  });
  if (changed && activeEntry) revealActiveLink(activeEntry.link, tocContent);
}

function updateActiveTOCItem(entries, tocContent) {
  // The last heading whose top has passed the offset line wins. Using rects
  // means no assumptions about the offsetParent chain.
  let active = null;
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].element.getBoundingClientRect().top <= TOC_SCROLL_OFFSET) {
      active = entries[i];
    } else {
      break;
    }
  }

  // Before the first heading, highlight nothing. At the very bottom, always
  // highlight the last one so a short final section still registers.
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom && entries.length) active = entries[entries.length - 1];

  setActive(entries, active, tocContent);
}

function initTOC() {
  const toc = document.getElementById("post-toc");
  const tocToggle = document.getElementById("toc-toggle");
  const tocContent = document.getElementById("toc-content");
  if (!toc || !tocToggle || !tocContent) return;

  const entries = Array.from(toc.querySelectorAll('a[href^="#"]'))
    .map((link) => {
      const id = decodeURIComponent(link.getAttribute("href").slice(1));
      return { link, element: document.getElementById(id) };
    })
    .filter((entry) => entry.element);

  tocToggle.addEventListener("click", () => toggleTOC(tocToggle, tocContent));

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initializeTOCState(tocToggle, tocContent);
      if (entries.length) updateActiveTOCItem(entries, tocContent);
    }, TOC_RESIZE_DEBOUNCE);
  });

  initializeTOCState(tocToggle, tocContent);
  if (!entries.length) return;

  // Highlight immediately on click; smooth scrolling would otherwise delay it.
  entries.forEach(({ link }) => {
    link.addEventListener("click", () => setActive(entries, { link }, tocContent));
  });

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateActiveTOCItem(entries, tocContent);
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("hashchange", onScroll);
  window.addEventListener("load", onScroll);
  updateActiveTOCItem(entries, tocContent);
}

(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTOC);
  } else {
    initTOC();
  }
})();
