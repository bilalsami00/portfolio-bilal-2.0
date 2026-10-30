/* ==========================================================================
   Dev Handbook — offline behaviour (no dependencies, works from file://)
   ========================================================================== */
(function () {
  "use strict";

  var THEME_KEY = "devhandbook-theme";
  var root = document.documentElement;
  var body = document.body;

  var chapters = Array.prototype.slice.call(
    document.querySelectorAll("article.chapter")
  );
  var navEl = document.getElementById("chapter-nav");
  var tocList = document.getElementById("toc-list");
  var tocAside = document.querySelector(".toc");
  var crumbPart = document.getElementById("crumb-part");
  var crumbChapter = document.getElementById("crumb-chapter");
  var crumbSection = document.getElementById("crumb-section");
  var progressBar = document.getElementById("progress-bar");
  var backToTop = document.getElementById("back-to-top");
  var navToggle = document.getElementById("nav-toggle");
  var scrim = document.getElementById("scrim");
  var sidebar = document.getElementById("sidebar");
  var themeToggle = document.getElementById("theme-toggle");
  var printBtn = document.getElementById("print-btn");
  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");
  var toast = document.getElementById("toast");

  var activeChapter = null;
  var activeHeadings = [];

  /* ------------------------------------------------------------------------
     Utilities
     ------------------------------------------------------------------------ */
  var escapeHtml = function (value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  var slugify = function (value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60);
  };

  var escapeRegExp = function (value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  var toastTimer = null;
  var showToast = function (message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 1600);
  };

  /* execCommand runs synchronously inside the click, so it keeps the user
     activation that some browsers require; the async API is the fallback. */
  var execCopy = function (text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    var previousFocus = document.activeElement;
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    if (previousFocus && previousFocus.focus) previousFocus.focus({ preventScroll: true });
    return ok;
  };

  var copyText = function (text) {
    if (execCopy(text)) return Promise.resolve();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return Promise.reject(new Error("copy unavailable"));
  };

  var selectContents = function (el) {
    try {
      var range = document.createRange();
      range.selectNodeContents(el);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      /* nothing else to try */
    }
  };

  /* ------------------------------------------------------------------------
     Theme
     ------------------------------------------------------------------------ */
  var applyTheme = function (theme) {
    root.setAttribute("data-theme", theme);
    if (!themeToggle) return;
    var next = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", "Switch to " + next + " theme");
    themeToggle.setAttribute("title", "Switch to " + next + " theme");
    themeToggle.querySelector(".icon-sun").style.display =
      theme === "dark" ? "block" : "none";
    themeToggle.querySelector(".icon-moon").style.display =
      theme === "dark" ? "none" : "block";
  };

  applyTheme(root.getAttribute("data-theme") || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (error) {
        /* storage unavailable: theme still applies for this visit */
      }
    });
  }

  /* ------------------------------------------------------------------------
     Code highlighting (tokenises textContent, escapes every token)
     ------------------------------------------------------------------------ */
  var JS_KEYWORDS =
    "import|from|export|default|const|let|var|function|return|if|else|for|while|do|type|interface|extends|implements|async|await|new|try|catch|finally|throw|typeof|instanceof|in|of|as|null|undefined|true|false|this|class|switch|case|break|continue|void|keyof|readonly|enum";

  var grammars = {
    js: new RegExp(
      [
        "(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)",
        "(?<string>\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*'|`(?:\\\\.|[^`\\\\])*`)",
        "(?<keyword>\\b(?:" + JS_KEYWORDS + ")\\b)",
        "(?<number>\\b\\d+(?:\\.\\d+)?\\b)",
      ].join("|"),
      "g"
    ),
    jsx: new RegExp(
      [
        "(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/|\\{\\/\\*[\\s\\S]*?\\*\\/\\})",
        "(?<string>\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*'|`(?:\\\\.|[^`\\\\])*`)",
        "(?<tag><\\/?[A-Z][\\w.]*|<\\/?[a-z][\\w-]*(?=[\\s>/])|(?<![=-])\\/?>)",
        "(?<keyword>\\b(?:" + JS_KEYWORDS + ")\\b)",
        "(?<number>\\b\\d+(?:\\.\\d+)?\\b)",
      ].join("|"),
      "g"
    ),
    css: new RegExp(
      [
        "(?<comment>\\/\\*[\\s\\S]*?\\*\\/)",
        "(?<string>\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')",
        "(?<keyword>@[\\w-]+|!important)",
        "(?<attr>--[\\w-]+|\\b[a-z-]+(?=\\s*:[^:]))",
        "(?<number>#[0-9a-fA-F]{3,8}\\b|\\b\\d+(?:\\.\\d+)?(?:px|rem|em|vh|vw|s|ms|%)?)",
      ].join("|"),
      "g"
    ),
    bash: new RegExp(
      [
        "(?<comment>(?:^|\\s)#[^\\n]*)",
        "(?<string>\"(?:\\\\.|[^\"\\\\\\n])*\"|'[^'\\n]*')",
        "(?<keyword>^\\s*(?:npm|npx|git|cd|node|copy|cp|rm|mkdir|firebase)\\b)",
      ].join("|"),
      "gm"
    ),
    json: new RegExp(
      [
        "(?<attr>\"(?:\\\\.|[^\"\\\\\\n])*\"(?=\\s*:))",
        "(?<string>\"(?:\\\\.|[^\"\\\\\\n])*\")",
        "(?<keyword>\\b(?:true|false|null)\\b)",
        "(?<number>-?\\b\\d+(?:\\.\\d+)?\\b)",
      ].join("|"),
      "g"
    ),
  };

  var grammarFor = function (lang) {
    if (lang === "tsx" || lang === "jsx" || lang === "html") return grammars.jsx;
    if (lang === "ts" || lang === "js") return grammars.js;
    if (lang === "css") return grammars.css;
    if (lang === "bash" || lang === "sh" || lang === "env" || lang === "powershell")
      return grammars.bash;
    if (lang === "json") return grammars.json;
    return null;
  };

  var highlight = function (code, lang) {
    var grammar = grammarFor(lang);
    if (!grammar) return;
    var source = code.textContent;
    var output = "";
    var last = 0;
    grammar.lastIndex = 0;
    var match = grammar.exec(source);
    while (match) {
      if (match[0] === "") {
        grammar.lastIndex += 1;
        match = grammar.exec(source);
        continue;
      }
      output += escapeHtml(source.slice(last, match.index));
      var groups = match.groups || {};
      var kind = null;
      Object.keys(groups).forEach(function (name) {
        if (!kind && groups[name] !== undefined) kind = name;
      });
      output += kind
        ? '<span class="tok-' + kind + '">' + escapeHtml(match[0]) + "</span>"
        : escapeHtml(match[0]);
      last = match.index + match[0].length;
      match = grammar.exec(source);
    }
    output += escapeHtml(source.slice(last));
    code.innerHTML = output;
  };

  /* ------------------------------------------------------------------------
     Code blocks: header, language label, copy button
     ------------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll("figure.code"), function (figure) {
    var code = figure.querySelector("pre code");
    if (!code) return;
    var lang = figure.getAttribute("data-lang") || "";
    var file = figure.getAttribute("data-file") || "";
    var headEl = document.createElement("div");
    headEl.className = "code-head";
    if (file) {
      var fileEl = document.createElement("span");
      fileEl.className = "code-file";
      fileEl.textContent = file;
      headEl.appendChild(fileEl);
    }
    if (lang) {
      var langEl = document.createElement("span");
      langEl.className = "code-lang";
      langEl.textContent = lang;
      headEl.appendChild(langEl);
    }
    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-btn";
    button.textContent = "Copy";
    button.setAttribute(
      "aria-label",
      "Copy code" + (file ? " from " + file : "")
    );
    if (!lang) button.style.marginLeft = "auto";
    button.addEventListener("click", function () {
      copyText(code.textContent.replace(/\n$/, ""))
        .then(function () {
          button.textContent = "Copied";
          button.classList.add("copied");
          window.setTimeout(function () {
            button.textContent = "Copy";
            button.classList.remove("copied");
          }, 1500);
        })
        .catch(function () {
          selectContents(code);
          showToast("Clipboard blocked — code selected, press Ctrl+C");
        });
    });
    headEl.appendChild(button);
    figure.insertBefore(headEl, figure.firstChild);
    highlight(code, lang);
  });

  /* ------------------------------------------------------------------------
     Copyable file paths
     ------------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll("code.path"), function (el) {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("title", "Copy path");
    el.setAttribute("aria-label", "Copy path " + el.textContent);
    var copyPath = function () {
      copyText(el.textContent.trim())
        .then(function () {
          el.classList.add("copied");
          showToast("Copied " + el.textContent.trim());
          window.setTimeout(function () {
            el.classList.remove("copied");
          }, 1200);
        })
        .catch(function () {
          selectContents(el);
          showToast("Clipboard blocked — path selected, press Ctrl+C");
        });
    };
    el.addEventListener("click", copyPath);
    el.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        copyPath();
      }
    });
  });

  /* ------------------------------------------------------------------------
     Heading ids + anchors
     ------------------------------------------------------------------------ */
  chapters.forEach(function (chapter) {
    var used = {};
    Array.prototype.forEach.call(chapter.querySelectorAll("h2, h3"), function (heading) {
      if (!heading.id) {
        var base = chapter.id + "-" + slugify(heading.textContent);
        var id = base;
        var n = 2;
        while (used[id] || document.getElementById(id)) {
          id = base + "-" + n;
          n += 1;
        }
        heading.id = id;
      }
      used[heading.id] = true;
      var anchor = document.createElement("a");
      anchor.className = "anchor";
      anchor.href = "#" + heading.id;
      anchor.textContent = "#";
      anchor.setAttribute("aria-label", "Link to " + heading.textContent);
      heading.appendChild(anchor);
    });
  });

  var headingText = function (heading) {
    var clone = heading.cloneNode(true);
    var anchor = clone.querySelector(".anchor");
    if (anchor) anchor.remove();
    return clone.textContent.trim();
  };

  /* ------------------------------------------------------------------------
     Sidebar navigation (generated from article data attributes)
     ------------------------------------------------------------------------ */
  var chevron =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var groups = [];
  chapters.forEach(function (chapter) {
    var part = chapter.getAttribute("data-part") || "Chapters";
    var group = groups[groups.length - 1];
    if (!group || group.part !== part) {
      group = { part: part, items: [] };
      groups.push(group);
    }
    group.items.push(chapter);
  });

  var navLinks = {};
  var groupButtons = [];
  groups.forEach(function (group, index) {
    var wrap = document.createElement("div");
    wrap.className = "nav-group";
    var listId = "nav-group-" + index;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-group-btn";
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-controls", listId);
    btn.innerHTML = "<span>" + escapeHtml(group.part) + "</span>" + chevron;
    var list = document.createElement("ul");
    list.className = "nav-list";
    list.id = listId;
    group.items.forEach(function (chapter) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.className = "nav-link";
      link.href = "#" + chapter.id;
      link.innerHTML =
        '<span class="num">' +
        escapeHtml(chapter.getAttribute("data-num") || "") +
        "</span><span>" +
        escapeHtml(chapter.getAttribute("data-title") || chapter.id) +
        "</span>";
      li.appendChild(link);
      list.appendChild(li);
      navLinks[chapter.id] = link;
    });
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      list.hidden = open;
    });
    groupButtons.push({ button: btn, list: list, chapters: group.items });
    wrap.appendChild(btn);
    wrap.appendChild(list);
    navEl.appendChild(wrap);
  });

  /* ------------------------------------------------------------------------
     Pager + "expand all" toolbars
     ------------------------------------------------------------------------ */
  var verified = body.getAttribute("data-verified") || "";
  chapters.forEach(function (chapter, index) {
    var detailsList = chapter.querySelectorAll("details");
    if (detailsList.length >= 3) {
      var toolbar = document.createElement("div");
      toolbar.className = "details-toolbar";
      var expand = document.createElement("button");
      expand.type = "button";
      expand.className = "icon-btn";
      expand.textContent = "Expand all";
      var collapse = document.createElement("button");
      collapse.type = "button";
      collapse.className = "icon-btn";
      collapse.textContent = "Collapse all";
      expand.addEventListener("click", function () {
        Array.prototype.forEach.call(detailsList, function (d) {
          d.open = true;
        });
      });
      collapse.addEventListener("click", function () {
        Array.prototype.forEach.call(detailsList, function (d) {
          d.open = false;
        });
      });
      toolbar.appendChild(expand);
      toolbar.appendChild(collapse);
      var head = chapter.querySelector(".chapter-head");
      if (head) head.appendChild(toolbar);
    }

    var pager = document.createElement("nav");
    pager.className = "pager";
    pager.setAttribute("aria-label", "Chapter navigation");
    var prev = chapters[index - 1];
    var next = chapters[index + 1];
    if (prev) {
      var p = document.createElement("a");
      p.href = "#" + prev.id;
      p.className = "prev";
      p.innerHTML =
        "<small>Previous</small><strong>" +
        escapeHtml(prev.getAttribute("data-num") + ". " + prev.getAttribute("data-title")) +
        "</strong>";
      pager.appendChild(p);
    }
    if (next) {
      var nx = document.createElement("a");
      nx.href = "#" + next.id;
      nx.className = "next";
      nx.innerHTML =
        "<small>Next</small><strong>" +
        escapeHtml(next.getAttribute("data-num") + ". " + next.getAttribute("data-title")) +
        "</strong>";
      pager.appendChild(nx);
    }
    chapter.appendChild(pager);

    if (verified) {
      var meta = document.createElement("p");
      meta.className = "page-meta";
      meta.textContent = "Verified against the repository at " + verified + ".";
      chapter.appendChild(meta);
    }
  });

  /* ------------------------------------------------------------------------
     Table of contents + active section
     ------------------------------------------------------------------------ */
  var tocLinks = [];
  var buildToc = function (chapter) {
    tocList.innerHTML = "";
    tocLinks = [];
    activeHeadings = Array.prototype.slice.call(chapter.querySelectorAll("h2, h3"));
    var shown = 0;
    activeHeadings.forEach(function (heading) {
      var li = document.createElement("li");
      li.className = heading.tagName === "H3" ? "depth-3" : "depth-2";
      var a = document.createElement("a");
      a.href = "#" + heading.id;
      a.textContent = headingText(heading);
      li.appendChild(a);
      tocList.appendChild(li);
      tocLinks.push(a);
      shown += 1;
    });
    if (tocAside) tocAside.style.visibility = shown > 1 ? "visible" : "hidden";
  };

  var currentHeading = null;
  var updateScrollState = function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0;
    if (progressBar) progressBar.style.width = pct + "%";
    if (backToTop) backToTop.hidden = scrollTop < 600;

    var offset = 90;
    var found = null;
    for (var i = 0; i < activeHeadings.length; i += 1) {
      if (activeHeadings[i].getBoundingClientRect().top - offset <= 0) {
        found = activeHeadings[i];
      } else {
        break;
      }
    }
    if (found !== currentHeading) {
      currentHeading = found;
      tocLinks.forEach(function (link) {
        link.classList.toggle(
          "is-current",
          Boolean(found) && link.getAttribute("href") === "#" + found.id
        );
      });
      if (crumbSection) crumbSection.textContent = found ? headingText(found) : "";
      crumbSection.hidden = !found;
    }
  };

  var scrollTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(function () {
        scrollTicking = false;
        updateScrollState();
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", updateScrollState);

  /* ------------------------------------------------------------------------
     Chapter routing (hash based, works on file://)
     ------------------------------------------------------------------------ */
  var chapterOf = function (el) {
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains("chapter")) return el;
      el = el.parentElement;
    }
    return null;
  };

  var showChapter = function (chapter) {
    if (activeChapter === chapter) return;
    chapters.forEach(function (c) {
      var active = c === chapter;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-hidden", active ? "false" : "true");
    });
    Object.keys(navLinks).forEach(function (id) {
      if (id === chapter.id) navLinks[id].setAttribute("aria-current", "page");
      else navLinks[id].removeAttribute("aria-current");
    });
    groupButtons.forEach(function (group) {
      if (group.chapters.indexOf(chapter) !== -1) {
        group.button.setAttribute("aria-expanded", "true");
        group.list.hidden = false;
      }
    });
    activeChapter = chapter;
    if (crumbPart) crumbPart.textContent = chapter.getAttribute("data-part") || "";
    if (crumbChapter)
      crumbChapter.textContent =
        chapter.getAttribute("data-num") + ". " + chapter.getAttribute("data-title");
    document.title =
      chapter.getAttribute("data-title") + " · Dev Handbook · Bilal Sami Portfolio";
    buildToc(chapter);
    currentHeading = undefined;
    var link = navLinks[chapter.id];
    if (link && sidebar) {
      var top = link.offsetTop - sidebar.clientHeight / 2;
      if (link.offsetTop < sidebar.scrollTop || link.offsetTop > sidebar.scrollTop + sidebar.clientHeight - 40) {
        sidebar.scrollTop = Math.max(0, top);
      }
    }
  };

  var clearSearchHits = function () {
    Array.prototype.forEach.call(document.querySelectorAll("mark.search-hit"), function (mark) {
      var parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  };

  var route = function (focusContent) {
    var id = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    var target = id ? document.getElementById(id) : null;
    var chapter = target ? chapterOf(target) : null;
    if (!chapter) chapter = chapters[0];
    var changed = activeChapter !== chapter;
    showChapter(chapter);
    if (target && target !== chapter) {
      target.scrollIntoView({ block: "start" });
    } else if (changed) {
      window.scrollTo(0, 0);
    }
    if (focusContent && changed) {
      var h1 = chapter.querySelector("h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      }
    }
    updateScrollState();
  };

  window.addEventListener("hashchange", function () {
    clearSearchHits();
    closeNav(false);
    route(true);
  });

  /* ------------------------------------------------------------------------
     Mobile navigation drawer
     ------------------------------------------------------------------------ */
  var mobileQuery = window.matchMedia("(max-width: 959px)");

  var openNav = function () {
    body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation");
    scrim.hidden = false;
    var current = sidebar.querySelector('[aria-current="page"]') || sidebar.querySelector("a, button");
    if (current) current.focus();
  };

  var closeNav = function (returnFocus) {
    if (!body.classList.contains("nav-open")) return;
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    scrim.hidden = true;
    if (returnFocus) navToggle.focus();
  };

  navToggle.addEventListener("click", function () {
    if (body.classList.contains("nav-open")) closeNav(true);
    else openNav();
  });
  scrim.addEventListener("click", function () {
    closeNav(true);
  });
  sidebar.addEventListener("click", function (event) {
    if (event.target.closest && event.target.closest("a.nav-link") && mobileQuery.matches) {
      closeNav(false);
    }
  });
  sidebar.addEventListener("keydown", function (event) {
    if (!body.classList.contains("nav-open") || event.key !== "Tab") return;
    var focusable = Array.prototype.filter.call(
      sidebar.querySelectorAll("a, button"),
      function (el) {
        return el.offsetParent !== null;
      }
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  var onViewportChange = function () {
    if (!mobileQuery.matches) closeNav(false);
  };
  if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", onViewportChange);
  else if (mobileQuery.addListener) mobileQuery.addListener(onViewportChange);

  /* ------------------------------------------------------------------------
     Search
     ------------------------------------------------------------------------ */
  var index = [];
  chapters.forEach(function (chapter) {
    var section = { title: chapter.getAttribute("data-title"), id: chapter.id };
    var nodes = chapter.querySelectorAll(
      "h1, h2, h3, h4, p, li, td, dt, dd, summary, figure.code pre"
    );
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.closest(".pager, .page-meta, .details-toolbar")) return;
      if (node.tagName === "H2" || node.tagName === "H3") {
        section = { title: headingText(node), id: node.id };
      }
      if (node.tagName === "LI" && node.querySelector("p, ul, ol, li")) return;
      if (node.tagName === "DD" && node.querySelector("p, ul, ol")) return;
      var text = (node.tagName.charAt(0) === "H" ? headingText(node) : node.textContent)
        .replace(/\s+/g, " ")
        .trim();
      if (!text) return;
      var detailsParent = node.tagName === "SUMMARY" ? null : node.closest("details");
      var detailsSummary = detailsParent ? detailsParent.querySelector("summary") : null;
      index.push({
        el: node,
        chapter: chapter,
        sectionTitle: detailsSummary
          ? detailsSummary.textContent.replace(/\s+/g, " ").trim()
          : section.title,
        sectionId: section.id,
        isHeading: /^H[1-4]$/.test(node.tagName),
        isCode: node.tagName === "PRE",
        text: text,
        lower: text.toLowerCase(),
      });
    });
  });

  var results = [];
  var selected = -1;

  var termsOf = function (query) {
    var terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter(function (t) {
        return t.length > 0;
      });
    if (terms.length > 1) {
      terms = terms.filter(function (t) {
        return t.length > 1;
      });
    }
    return terms;
  };

  var snippetFor = function (entry, terms) {
    var text = entry.text;
    var first = text.length;
    terms.forEach(function (t) {
      var at = entry.lower.indexOf(t);
      if (at !== -1 && at < first) first = at;
    });
    var start = Math.max(0, first - 50);
    var end = Math.min(text.length, start + 170);
    var slice = (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
    var html = escapeHtml(slice);
    var pattern = new RegExp(
      "(" + terms.map(function (t) { return escapeRegExp(escapeHtml(t)); }).join("|") + ")",
      "gi"
    );
    return html.replace(pattern, "<mark>$1</mark>");
  };

  var renderResults = function (query) {
    var terms = termsOf(query);
    selected = -1;
    if (!terms.length) {
      searchResults.hidden = true;
      searchInput.setAttribute("aria-expanded", "false");
      results = [];
      return;
    }
    var scored = [];
    index.forEach(function (entry) {
      for (var i = 0; i < terms.length; i += 1) {
        if (entry.lower.indexOf(terms[i]) === -1) return;
      }
      var score = 0;
      if (entry.isHeading) score += 12;
      var sectionLower = (entry.sectionTitle || "").toLowerCase();
      terms.forEach(function (t) {
        if (sectionLower.indexOf(t) !== -1) score += 4;
        score += Math.min(4, entry.lower.split(t).length - 1);
      });
      if (entry.isCode) score -= 2;
      scored.push({ entry: entry, score: score });
    });
    scored.sort(function (a, b) {
      return b.score - a.score;
    });
    results = scored.slice(0, 40).map(function (s) {
      return s.entry;
    });

    var html =
      '<div class="search-meta" id="search-meta">' +
      (scored.length
        ? scored.length + " match" + (scored.length === 1 ? "" : "es") +
          (scored.length > results.length ? " · showing top " + results.length : "") +
          " · ↑↓ to move, Enter to open"
        : "") +
      "</div>";
    if (!results.length) {
      html =
        '<div class="search-empty">No results for <strong>' +
        escapeHtml(query) +
        "</strong>. Try a file name, component, or concept.</div>";
    } else {
      results.forEach(function (entry, i) {
        var where =
          entry.chapter.getAttribute("data-num") +
          ". " +
          entry.chapter.getAttribute("data-title");
        var title = entry.isHeading ? entry.text : entry.sectionTitle || "";
        html +=
          '<button type="button" class="search-result" role="option" id="sr-' + i +
          '" aria-selected="false" data-index="' + i + '">' +
          '<span class="sr-where">' + escapeHtml(where) + (entry.isCode ? " · code" : "") + "</span>" +
          '<span class="sr-title">' + escapeHtml(title) + "</span>" +
          (entry.isHeading ? "" : '<span class="sr-snippet">' + snippetFor(entry, terms) + "</span>") +
          "</button>";
      });
    }
    searchResults.innerHTML = html;
    searchResults.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  };

  var setSelected = function (next) {
    var buttons = searchResults.querySelectorAll(".search-result");
    if (!buttons.length) return;
    selected = (next + buttons.length) % buttons.length;
    Array.prototype.forEach.call(buttons, function (b, i) {
      b.setAttribute("aria-selected", i === selected ? "true" : "false");
    });
    var current = buttons[selected];
    searchInput.setAttribute("aria-activedescendant", current.id);
    current.scrollIntoView({ block: "nearest" });
  };

  var markTerms = function (el, terms) {
    var pattern = new RegExp(
      "(" + terms.map(escapeRegExp).join("|") + ")",
      "gi"
    );
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement.closest(".anchor, .copy-btn")) {
        textNodes.push(walker.currentNode);
      }
    }
    var firstMark = null;
    textNodes.forEach(function (node) {
      var value = node.nodeValue;
      pattern.lastIndex = 0;
      if (!pattern.test(value)) return;
      pattern.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var last = 0;
      var m = pattern.exec(value);
      while (m) {
        frag.appendChild(document.createTextNode(value.slice(last, m.index)));
        var mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = m[0];
        frag.appendChild(mark);
        if (!firstMark) firstMark = mark;
        last = m.index + m[0].length;
        m = pattern.exec(value);
      }
      frag.appendChild(document.createTextNode(value.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
    return firstMark;
  };

  var openResult = function (i) {
    var entry = results[i];
    if (!entry) return;
    var terms = termsOf(searchInput.value);
    closeResults();
    clearSearchHits();
    closeNav(false);
    showChapter(entry.chapter);
    var detailsParent = entry.el.closest("details");
    if (detailsParent) detailsParent.open = true;
    var hash = "#" + (entry.sectionId || entry.chapter.id);
    try {
      history.replaceState(null, "", hash);
    } catch (error) {
      /* some file:// contexts block history writes; navigation still works */
    }
    var firstMark = markTerms(entry.el, terms);
    var target = firstMark || entry.el;
    target.scrollIntoView({ block: "center" });
    updateScrollState();
  };

  var closeResults = function () {
    searchResults.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    selected = -1;
  };

  var searchTimer = null;
  searchInput.addEventListener("input", function () {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(function () {
      renderResults(searchInput.value);
    }, 90);
  });

  searchInput.addEventListener("focus", function () {
    if (searchInput.value.trim()) renderResults(searchInput.value);
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (searchResults.hidden) renderResults(searchInput.value);
      setSelected(selected + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected(selected - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!results.length) renderResults(searchInput.value);
      openResult(selected >= 0 ? selected : 0);
    } else if (event.key === "Escape") {
      if (!searchResults.hidden) {
        event.stopPropagation();
        closeResults();
      } else if (searchInput.value) {
        searchInput.value = "";
        clearSearchHits();
      } else {
        searchInput.blur();
      }
    }
  });

  searchResults.addEventListener("click", function (event) {
    var btn = event.target.closest ? event.target.closest(".search-result") : null;
    if (btn) openResult(Number(btn.getAttribute("data-index")));
  });

  // Keep focus in the input when results are clicked with the mouse.
  searchResults.addEventListener("mousedown", function (event) {
    event.preventDefault();
  });

  document.addEventListener("click", function (event) {
    if (!searchResults.hidden && !event.target.closest(".search")) closeResults();
  });

  /* ------------------------------------------------------------------------
     Global keyboard shortcuts
     ------------------------------------------------------------------------ */
  document.addEventListener("keydown", function (event) {
    var tag = event.target && event.target.tagName;
    var typing = tag === "INPUT" || tag === "TEXTAREA" || (event.target && event.target.isContentEditable);
    if (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      closeNav(true);
    }
  });

  /* ------------------------------------------------------------------------
     Back to top + print
     ------------------------------------------------------------------------ */
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (activeChapter) {
      var h1 = activeChapter.querySelector("h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      }
    }
  });

  var reopen = [];
  window.addEventListener("beforeprint", function () {
    reopen = [];
    Array.prototype.forEach.call(document.querySelectorAll("details:not([open])"), function (d) {
      d.open = true;
      reopen.push(d);
    });
  });
  window.addEventListener("afterprint", function () {
    reopen.forEach(function (d) {
      d.open = false;
    });
    reopen = [];
  });
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  route(false);
})();
