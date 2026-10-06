"use client";

import { useEffect, useMemo, useState } from "react";
import "./globals.css";

const VERSION = "0.3.0";
const RELEASE_DATE = "October 6, 2026";

const DOWNLOADS = {
  windows: {
    label: "Windows",
    subtitle: "Windows 10 / 11 · 64-bit",
    icon: "⊞",
    href: "#",
    filename: "Fades-Browser-Setup-0.3.0.exe",
    type: "EXE",
  },
  macos: {
    label: "macOS",
    subtitle: "Apple Silicon · Intel",
    icon: "●",
    href: "#",
    filename: "Fades-Browser-0.3.0.dmg",
    type: "DMG",
  },
  linux: {
    label: "Linux",
    subtitle: "AppImage · 64-bit",
    icon: "◈",
    href: "#",
    filename: "Fades-Browser-0.3.0.AppImage",
    type: "APPIMAGE",
  },
};

const FEATURES = [
  {
    icon: "✦",
    title: "Built around Fades",
    description:
      "A browser experience designed from the ground up around the Fades ecosystem.",
  },
  {
    icon: "⌕",
    title: "Fades Search",
    description:
      "Search the web through Fades without being pushed into another browser's interface.",
  },
  {
    icon: "◉",
    title: "Private browsing",
    description:
      "Open private windows and keep your browsing session separate from your normal browser state.",
  },
  {
    icon: "⚡",
    title: "Fast by default",
    description:
      "A clean, lightweight interface with native browser controls and minimal visual clutter.",
  },
  {
    icon: "◆",
    title: "Fades design",
    description:
      "The same glass surfaces, gradients, rounded controls and visual language used throughout Fades.",
  },
  {
    icon: "⌘",
    title: "Keyboard focused",
    description:
      "Navigate tabs, search, find pages and control the browser without constantly reaching for the mouse.",
  },
];

const RELEASE_NOTES = [
  "Refined the complete browser interface",
  "Improved tabs and native browser navigation",
  "Updated Fades Search experience",
  "Added download management UI",
  "Improved private browsing visuals",
  "Updated light and dark theme support",
];

function detectPlatform() {
  if (typeof navigator === "undefined") return "windows";

  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("mac")) return "macos";
  if (ua.includes("linux")) return "linux";

  return "windows";
}

function PlatformIcon({ platform }) {
  if (platform === "windows") {
    return <span className="platform-icon windows-icon">⊞</span>;
  }

  if (platform === "macos") {
    return <span className="platform-icon apple-icon">●</span>;
  }

  return <span className="platform-icon linux-icon">◈</span>;
}

export default function Page() {
  const [platform, setPlatform] = useState("windows");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setPlatform(detectPlatform());

    const savedTheme = localStorage.getItem("fades-browser-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else {
      setTheme(
        window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark"
      );
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("fades-browser-theme", theme);
  }, [theme]);

  const recommended = useMemo(
    () => DOWNLOADS[platform] || DOWNLOADS.windows,
    [platform]
  );

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  function scrollToDownloads() {
    document
      .getElementById("downloads")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="download-page">
      <div className="download-background">
        <div className="download-grid" />
        <div className="download-orb download-orb-one" />
        <div className="download-orb download-orb-two" />
        <div className="download-orb download-orb-three" />
        <img
          className="download-background-logo"
          src="/logo.png"
          alt=""
          aria-hidden="true"
        />
      </div>

      <header className="download-header">
        <a className="download-brand" href="/">
          <span className="download-brand-icon">
            <img src="/logo.png" alt="Fades" />
          </span>

          <span className="download-brand-copy">
            <strong>Fades</strong>
            <small>Browser</small>
          </span>
        </a>

        <div className="download-header-actions">
          <span className="version-pill">
            <i />
            v{VERSION}
          </span>

          <button
            type="button"
            className="theme-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <a className="header-back" href="/">
            Back to Fades
            <span>↗</span>
          </a>
        </div>
      </header>

      <section className="download-hero">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          FADES BROWSER
          <span className="eyebrow-line" />
          <span>v{VERSION}</span>
        </div>

        <h1>
          The web,
          <br />
          <span>the Fades way.</span>
        </h1>

        <p className="hero-description">
          A fast, private and beautifully designed browser built for the Fades
          ecosystem.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="hero-download"
            onClick={scrollToDownloads}
          >
            <PlatformIcon platform={platform} />

            <span>
              <small>Recommended for you</small>
              Download for {recommended.label}
            </span>

            <b>↓</b>
          </button>

          <a className="hero-secondary" href="#downloads">
            View all platforms
            <span>→</span>
          </a>
        </div>

        <div className="hero-meta">
          <span>
            <i className="meta-check">✓</i>
            Free forever
          </span>

          <span>
            <i className="meta-check">✓</i>
            No account required
          </span>

          <span>
            <i className="meta-check">✓</i>
            Open the web
          </span>
        </div>
      </section>

      <section className="browser-preview-section">
        <div className="browser-preview">
          <div className="preview-glow" />

          <div className="preview-window">
            <div className="preview-tabs">
              <div className="preview-brand">
                <img src="/logo.png" alt="" />
              </div>

              <div className="preview-tab preview-tab-active">
                <span className="preview-favicon">
                  <img src="/logo.png" alt="" />
                </span>
                <span>New Tab</span>
                <b>×</b>
              </div>

              <div className="preview-new-tab">+</div>

              <div className="preview-window-controls">
                <span>−</span>
                <span>□</span>
                <span>×</span>
              </div>
            </div>

            <div className="preview-toolbar">
              <span className="preview-nav disabled">‹</span>
              <span className="preview-nav">›</span>
              <span className="preview-nav">↻</span>

              <div className="preview-address">
                <span className="preview-lock">●</span>
                <span>fades://newtab</span>
                <span className="preview-star">☆</span>
              </div>

              <span className="preview-search-badge">
                <img src="/logo.png" alt="" />
                Fades Search
              </span>

              <span className="preview-menu">⋮</span>
            </div>

            <div className="preview-content">
              <div className="preview-grid" />

              <div className="preview-content-inner">
                <div className="preview-brand-large">
                  <img src="/logo.png" alt="" />
                  <strong>Fades</strong>
                  <span>PRIVATE</span>
                </div>

                <div className="preview-welcome">
                  <small>WELCOME TO</small>
                  <h2>
                    The web,
                    <br />
                    <span>your way.</span>
                  </h2>

                  <div className="preview-search">
                    <span>⌕</span>
                    <span>Search with Fades...</span>
                    <b>↵</b>
                  </div>
                </div>

                <div className="preview-cards">
                  <div>
                    <span>◎</span>
                    <strong>Fades</strong>
                    <small>fades.lol</small>
                  </div>

                  <div>
                    <span>✦</span>
                    <strong>Fades Mail</strong>
                    <small>mail.fades.lol</small>
                  </div>

                  <div>
                    <span>◈</span>
                    <strong>Search</strong>
                    <small>Search the web</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="preview-caption">
          <span />
          Fades Browser · Your browser, redesigned.
        </p>
      </section>

      <section className="downloads-section" id="downloads">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">GET FADES BROWSER</span>
            <h2>Choose your platform.</h2>
          </div>

          <p>
            Download the latest version of Fades Browser for your computer.
          </p>
        </div>

        <div className="download-grid-cards">
          {Object.entries(DOWNLOADS).map(([key, item]) => {
            const isRecommended = key === platform;

            return (
              <a
                key={key}
                href={item.href}
                className={`platform-card ${
                  isRecommended ? "recommended" : ""
                }`}
                download={item.href !== "#"}
              >
                {isRecommended && (
                  <span className="recommended-badge">Recommended</span>
                )}

                <div className="platform-card-top">
                  <div className={`platform-logo ${key}`}>
                    <PlatformIcon platform={key} />
                  </div>

                  <span className="download-arrow">↗</span>
                </div>

                <div className="platform-card-copy">
                  <h3>{item.label}</h3>
                  <p>{item.subtitle}</p>
                </div>

                <div className="platform-card-bottom">
                  <span>{item.type}</span>
                  <span>v{VERSION}</span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="download-notice">
          <span className="notice-icon">i</span>

          <div>
            <strong>Not sure which version to download?</strong>
            <p>
              You're currently using{" "}
              <b>{DOWNLOADS[platform]?.label || "Windows"}</b>. We recommend
              downloading the highlighted version above.
            </p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading centered">
          <span className="section-eyebrow">WHY FADES</span>
          <h2>Everything you need. Nothing you don't.</h2>
          <p>
            Fades Browser brings the familiar power of a modern browser into a
            cleaner, more personal experience.
          </p>
        </div>

        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>

              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="release-section">
        <div className="release-card">
          <div className="release-header">
            <div>
              <span className="section-eyebrow">LATEST RELEASE</span>
              <h2>Fades Browser {VERSION}</h2>
              <p>Released {RELEASE_DATE}</p>
            </div>

            <span className="release-version">v{VERSION}</span>
          </div>

          <div className="release-body">
            <div className="release-title">
              <span>✦</span>
              <strong>What's new</strong>
            </div>

            <ul>
              {RELEASE_NOTES.map((note) => (
                <li key={note}>
                  <span>✓</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="install-section">
        <div className="section-heading centered">
          <span className="section-eyebrow">GET STARTED</span>
          <h2>You're a few clicks away.</h2>
          <p>Download Fades Browser, install it, and start browsing.</p>
        </div>

        <div className="steps">
          <div className="step">
            <span className="step-number">01</span>
            <div className="step-line" />
            <h3>Download</h3>
            <p>Choose your operating system and download the latest build.</p>
          </div>

          <div className="step">
            <span className="step-number">02</span>
            <div className="step-line" />
            <h3>Install</h3>
            <p>Open the installer and follow the simple installation steps.</p>
          </div>

          <div className="step">
            <span className="step-number">03</span>
            <div className="step-line" />
            <h3>Browse</h3>
            <p>Launch Fades Browser and make the web yours.</p>
          </div>
        </div>
      </section>

      <footer className="download-footer">
        <div className="footer-brand">
          <img src="/logo.png" alt="Fades" />
          <div>
            <strong>Fades Browser</strong>
            <span>Built by Fades.</span>
          </div>
        </div>

        <div className="footer-links">
          <a href="/">Fades</a>
          <a href="https://mail.fades.lol">Fades Mail</a>
          <a href="#downloads">Downloads</a>
        </div>

        <span className="footer-version">
          Fades Browser {VERSION} · © {new Date().getFullYear()} Fades
        </span>
      </footer>
    </main>
  );
}
