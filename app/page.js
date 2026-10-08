"use client";

import { useEffect, useMemo, useState } from "react";
import "./globals.css";

const VERSION = "0.1.4";
const RELEASE_DATE = "October 6, 2026";

const DOWNLOADS = {
  windows: {
    label: "Windows",
    subtitle: "Windows 10 / 11 · 64-bit",
    href: "https://downloads.fades.lol/Fades Browser_0.1.4_x64-setup.exe",
    filename: "Fades Browser_0.1.4_x64-setup.exe",
    type: "EXE",
  },
  macos: {
    label: "macOS",
    subtitle: "Apple Silicon · Intel",
    href: "#",
    filename: "Fades-Browser-0.1.4.dmg",
    type: "DMG",
  },
  linux: {
    label: "Linux",
    subtitle: "AppImage · 64-bit",
    href: "#",
    filename: "Fades-Browser-0.1.4.AppImage",
    type: "APPIMAGE",
  },
};

const FEATURES = [
  {
    icon: "sparkles",
    title: "Built around Fades",
    description:
      "A browser experience designed from the ground up around the Fades ecosystem.",
  },
  {
    icon: "search",
    title: "Fades Search",
    description:
      "Search the web through Fades without being pushed into another browser's interface.",
  },
  {
    icon: "shield",
    title: "Private browsing",
    description:
      "Open private windows and keep your browsing session separate from your normal browser state.",
  },
  {
    icon: "bolt",
    title: "Fast by default",
    description:
      "A clean, lightweight interface with native browser controls and minimal visual clutter.",
  },
  {
    icon: "diamond",
    title: "Fades design",
    description:
      "The same glass surfaces, gradients, rounded controls and visual language used throughout Fades.",
  },
  {
    icon: "keyboard",
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

function Icon({ name, size = 20, strokeWidth = 1.8, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "windows":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M2.5 4.2 10.7 3v8.3H2.5V4.2Zm9.8-1.45L21.5 1.5v9.8h-9.2V2.75ZM2.5 12.7h8.2V21L2.5 19.7v-7Zm9.8 0h9.2v9.8l-9.2-1.35V12.7Z" />
        </svg>
      );

    case "apple":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M15.7 12.7c0-2 1.6-3 1.7-3.1-.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.8-3.2 1.9-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.2-.1 0-2.7-1-2.7-3.1Z" />
          <path d="M14.4 6.6c.6-.7 1-1.6.9-2.6-.8 0-1.8.5-2.4 1.2-.5.6-1 1.6-.9 2.5.9.1 1.8-.4 2.4-1.1Z" />
        </svg>
      );

    case "linux":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 3.2c-2.5 0-3.8 2.5-3.8 5.4 0 1.7-.4 2.7-1.3 4.2-.8 1.3-1.4 2.7-.9 4.1.4 1.2 1.5 1.7 2.7 1.7 1 0 2-.4 3.3-.4s2.3.4 3.3.4c1.2 0 2.3-.5 2.7-1.7.5-1.4-.1-2.8-.9-4.1-.9-1.5-1.3-2.5-1.3-4.2C15.8 5.7 14.5 3.2 12 3.2Z" />
          <path
            d="M8.4 13.2c.7.6 1.5.9 2.4.9s1.7-.3 2.4-.9M9.2 9.2h.01M14.8 9.2h.01"
            fill="none"
            stroke="currentColor"
          />
          <path
            d="M10 15.3c.7.4 1.3.6 2 .6s1.3-.2 2-.6"
            fill="none"
            stroke="currentColor"
          />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "arrow-up-right":
      return (
        <svg {...common}>
          <path d="M7 17 17 7" />
          <path d="M7 7h10v10" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
        </svg>
      );

    case "moon":
      return (
        <svg {...common}>
          <path d="M20.5 15.4A8.5 8.5 0 0 1 8.6 3.5 8.5 8.5 0 1 0 20.5 15.4Z" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5.5c0 4.7-3.2 7.9-8 9.5-4.8-1.6-8-4.8-8-9.5V6l8-3Z" />
          <path d="m8.5 12 2.2 2.2 4.8-5" />
        </svg>
      );

    case "bolt":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M13.5 2 5 13h5l-.7 9L19 10h-5l-.5-8Z" />
        </svg>
      );

    case "sparkles":
      return (
        <svg {...common}>
          <path d="m12 3-1.1 4.1L7 8.2l3.9 1.1L12 13l1.1-3.7L17 8.2l-3.9-1.1L12 3Z" />
          <path d="m19 13-.7 2.3L16 16l2.3.7L19 19l.7-2.3L22 16l-2.3-.7L19 13ZM5 15l-.6 1.9L2.5 17.5l1.9.6L5 20l.6-1.9 1.9-.6-1.9-.6L5 15Z" />
        </svg>
      );

    case "diamond":
      return (
        <svg {...common}>
          <path d="m12 3 8 8-8 10-8-10 8-8Z" />
          <path d="m4 11 8 2 8-2" />
        </svg>
      );

    case "keyboard":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M7 10h.01M10 10h.01M13 10h.01M16 10h.01M7 13h.01M10 13h.01M13 13h4" />
        </svg>
      );

    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14.8-4L3 9" />
          <path d="M3 4v5h5" />
          <path d="M4 13a8 8 0 0 0 14.8 4L21 15" />
          <path d="M21 20v-5h-5" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    case "minus":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      );

    case "maximize":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
        </svg>
      );

    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      );

    case "back":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m11 18-6-6 6-6" />
        </svg>
      );

    case "external":
      return (
        <svg {...common}>
          <path d="M14 5h5v5" />
          <path d="M19 5 11 13" />
          <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
        </svg>
      );

    case "command":
      return (
        <svg {...common}>
          <path d="M18 8a3 3 0 1 0-3-3v14a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V5a3 3 0 1 0-3 3h12Z" />
        </svg>
      );

    default:
      return null;
  }
}

function detectPlatform() {
  if (typeof navigator === "undefined") return "windows";

  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("mac")) return "macos";
  if (ua.includes("linux")) return "linux";

  return "windows";
}

function PlatformIcon({ platform, size = 22 }) {
  return (
    <span className={`platform-icon ${platform}-icon`}>
      <Icon name={platform} size={size} strokeWidth={1.7} />
    </span>
  );
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
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
          </button>

          <a className="header-back" href="/">
            <Icon name="back" size={14} />
            Back to Fades
            <Icon name="external" size={13} />
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
            <PlatformIcon platform={platform} size={21} />

            <span>
              <small>Recommended for you</small>
              Download for {recommended.label}
            </span>

            <b>
              <Icon name="download" size={19} />
            </b>
          </button>

          <a className="hero-secondary" href="#downloads">
            View all platforms
            <Icon name="arrow-right" size={16} />
          </a>
        </div>

        <div className="hero-meta">
          <span>
            <i className="meta-check">
              <Icon name="check" size={10} strokeWidth={2.5} />
            </i>
            Free forever
          </span>

          <span>
            <i className="meta-check">
              <Icon name="check" size={10} strokeWidth={2.5} />
            </i>
            No account required
          </span>

          <span>
            <i className="meta-check">
              <Icon name="check" size={10} strokeWidth={2.5} />
            </i>
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

                <b>
                  <Icon name="close" size={13} strokeWidth={1.7} />
                </b>
              </div>

              <div className="preview-new-tab">
                <Icon name="plus" size={15} />
              </div>

              <div className="preview-window-controls">
                <span>
                  <Icon name="minus" size={13} />
                </span>
                <span>
                  <Icon name="maximize" size={12} />
                </span>
                <span>
                  <Icon name="close" size={13} />
                </span>
              </div>
            </div>

            <div className="preview-toolbar">
              <span className="preview-nav disabled">
                <Icon name="back" size={17} />
              </span>

              <span className="preview-nav">
                <Icon
                  name="back"
                  size={17}
                  className="preview-forward-icon"
                />
              </span>

              <span className="preview-nav">
                <Icon name="refresh" size={16} />
              </span>

              <div className="preview-address">
                <span className="preview-lock">
                  <Icon name="lock" size={12} />
                </span>

                <span>fades://newtab</span>

                <span className="preview-star">
                  <Icon name="star" size={14} />
                </span>
              </div>

              <span className="preview-search-badge">
                <img src="/logo.png" alt="" />
                Fades Search
              </span>

              <span className="preview-menu">
                <Icon name="menu" size={19} />
              </span>
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
                    <span>
                      <Icon name="search" size={17} />
                    </span>

                    <span>Search with Fades...</span>

                    <b>
                      <Icon name="command" size={13} />
                    </b>
                  </div>
                </div>

                <div className="preview-cards">
                  <div>
                    <span>
                      <Icon name="sparkles" size={14} />
                    </span>

                    <strong>Fades AI</strong>
                    <small>fades.lol</small>
                  </div>

                  <div>
                    <span>
                      <Icon name="shield" size={14} />
                    </span>

                    <strong>Fades Mail</strong>
                    <small>mail.fades.lol</small>
                  </div>

                  <div>
                    <span>
                      <Icon name="search" size={14} />
                    </span>

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
                  <span className="recommended-badge">
                    <Icon name="check" size={10} strokeWidth={2.4} />
                    Recommended
                  </span>
                )}

                <div className="platform-card-top">
                  <div className={`platform-logo ${key}`}>
                    <PlatformIcon platform={key} size={24} />
                  </div>

                  <span className="download-arrow">
                    <Icon name="arrow-up-right" size={18} />
                  </span>
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
          <span className="notice-icon">
            <Icon name="info" size={13} />
          </span>

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
              <div className="feature-icon">
                <Icon name={feature.icon} size={18} />
              </div>

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
              <span>
                <Icon name="sparkles" size={15} />
              </span>

              <strong>What's new</strong>
            </div>

            <ul>
              {RELEASE_NOTES.map((note) => (
                <li key={note}>
                  <span>
                    <Icon name="check" size={10} strokeWidth={2.5} />
                  </span>

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

            <p>
              Choose your operating system and download the latest build.
            </p>
          </div>

          <div className="step">
            <span className="step-number">02</span>

            <div className="step-line" />

            <h3>Install</h3>

            <p>
              Open the installer and follow the simple installation steps.
            </p>
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
