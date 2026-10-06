"use client";

import { useEffect, useMemo, useState } from "react";
import "./globals.css";

/* =========================================================
   FADES BROWSER DOWNLOAD PAGE
   ========================================================= */

const RELEASE = {
  version: "0.3.0",
  status: "Available now",
  updated: "October 2026",
};

const DOWNLOADS = {
  windows: {
    id: "windows",
    name: "Windows",
    short: "Windows",
    description: "Windows 10 and Windows 11",
    detail: "64-bit desktop",
    extension: ".exe",
    file: "FadesBrowserSetup.exe",
    icon: "windows",
    url: "https://downloads.fades.lol/FadesBrowserSetup.exe",
  },

  mac: {
    id: "mac",
    name: "macOS",
    short: "macOS",
    description: "Apple Silicon & Intel",
    detail: "Universal application",
    extension: ".dmg",
    file: "FadesBrowser.dmg",
    icon: "apple",
    url: "https://downloads.fades.lol/FadesBrowser.dmg",
  },

  linux: {
    id: "linux",
    name: "Linux",
    short: "Linux",
    description: "Debian, Ubuntu & more",
    detail: "64-bit AppImage",
    extension: ".AppImage",
    file: "FadesBrowser.AppImage",
    icon: "linux",
    url: "https://downloads.fades.lol/FadesBrowser.AppImage",
  },
};

/* =========================================================
   ICONS
   ========================================================= */

function Icon({ name, size = 20, stroke = 1.7 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  if (name === "windows") {
    return (
      <svg {...props}>
        <path
          d="M2.5 4.25 10.3 3.2v8.05H2.5V4.25Zm9.2-1.3 9.8-1.2v9.5h-9.8V2.95ZM2.5 12.75h7.8v8.05l-7.8-1.05v-7Zm9.2 0h9.8v9.5l-9.8-1.2v-8.3Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "apple") {
    return (
      <svg {...props}>
        <path
          d="M17.05 12.53c-.02-2.25 1.84-3.34 1.92-3.39a4.15 4.15 0 0 0-3.25-1.76c-1.38-.14-2.7.81-3.4.81-.71 0-1.8-.79-2.96-.77-1.52.02-2.92.88-3.7 2.24-1.59 2.75-.4 6.81 1.14 9.03.76 1.08 1.66 2.29 2.84 2.25 1.14-.05 1.57-.73 2.95-.73 1.37 0 1.76.73 2.96.7 1.23-.02 2-1.09 2.75-2.18.86-1.25 1.21-2.47 1.23-2.53-.03-.01-2.46-.94-2.48-3.67Zm-2.24-6.61c.62-.75 1.04-1.8.92-2.84-.89.04-1.97.59-2.61 1.34-.57.66-1.07 1.73-.94 2.75.99.08 2.01-.5 2.63-1.25Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "linux") {
    return (
      <svg {...props}>
        <path
          d="M12 2.25c-3.02 0-4.75 2.62-4.75 6.17 0 1.74-.53 3.12-1.28 4.43-.66 1.16-1.47 2.52-1.47 4.12 0 2.68 2.23 4.78 7.5 4.78s7.5-2.1 7.5-4.78c0-1.6-.81-2.96-1.47-4.12-.75-1.31-1.28-2.69-1.28-4.43C16.75 4.87 15.02 2.25 12 2.25Z"
          fill="currentColor"
        />
        <circle cx="8.5" cy="10.7" r="1" fill="#08090b" />
        <circle cx="15.5" cy="10.7" r="1" fill="#08090b" />
        <path
          d="M9.2 15.5c.85.55 1.8.82 2.8.82s1.95-.27 2.8-.82"
          stroke="#08090b"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "download") {
    return (
      <svg {...props}>
        <path
          d="M12 3v11m0 0 4-4m-4 4-4-4M4.5 17v1.25A2.25 2.25 0 0 0 6.75 20.5h10.5a2.25 2.25 0 0 0 2.25-2.25V17"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg {...props}>
        <path
          d="M5 12h13m-5-5 5 5-5 5"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "chevron") {
    return (
      <svg {...props}>
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...props}>
        <path
          d="M12 3 19 6v5.1c0 4.38-2.94 7.86-7 9.9-4.06-2.04-7-5.52-7-9.9V6l7-3Z"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <path
          d="m9.2 12 1.8 1.8 3.8-4"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "bolt") {
    return (
      <svg {...props}>
        <path
          d="m13.2 2.5-8 10.9h6.1l-.5 8.1 8-11h-6.1l.5-8Z"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg {...props}>
        <rect
          x="5"
          y="10"
          width="14"
          height="11"
          rx="2.2"
          stroke="currentColor"
          strokeWidth={stroke}
        />
        <path
          d="M8 10V7.5a4 4 0 0 1 8 0V10"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "globe") {
    return (
      <svg {...props}>
        <circle
          cx="12"
          cy="12"
          r="8.75"
          stroke="currentColor"
          strokeWidth={stroke}
        />
        <path
          d="M3.7 12h16.6M12 3.25c2.15 2.35 3.25 5.27 3.25 8.75S14.15 18.4 12 20.75C9.85 18.4 8.75 15.48 8.75 12S9.85 5.6 12 3.25Z"
          stroke="currentColor"
          strokeWidth={stroke}
        />
      </svg>
    );
  }

  if (name === "spark") {
    return (
      <svg {...props}>
        <path
          d="m12 2 1.2 6.8L20 10l-6.8 1.2L12 18l-1.2-6.8L4 10l6.8-1.2L12 2Z"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...props}>
        <path
          d="m5 12.5 4.2 4.2L19 7"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "github") {
    return (
      <svg {...props} viewBox="0 0 24 24">
        <path
          d="M12 2.75a9.25 9.25 0 0 0-2.93 18.02c.46.08.63-.2.63-.44v-1.54c-2.56.56-3.1-1.09-3.1-1.09-.42-1.06-1.02-1.34-1.02-1.34-.84-.57.06-.56.06-.56.93.07 1.42.95 1.42.95.83 1.42 2.18 1.01 2.71.77.08-.6.32-1.01.59-1.24-2.04-.23-4.18-1.02-4.18-4.53 0-1 .36-1.82.95-2.46-.1-.23-.41-1.16.09-2.42 0 0 .78-.25 2.55.94A8.9 8.9 0 0 1 12 6.53c.79 0 1.58.11 2.32.32 1.77-1.2 2.55-.94 2.55-.94.5 1.26.19 2.19.09 2.42.59.64.95 1.46.95 2.46 0 3.52-2.15 4.3-4.2 4.53.33.28.62.83.62 1.67v2.34c0 .24.17.52.64.44A9.25 9.25 0 0 0 12 2.75Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "menu") {
    return (
      <svg {...props}>
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return null;
}

/* =========================================================
   FADES MARK
   ========================================================= */

function FadesMark({ large = false }) {
  return (
    <div className={`fades-mark ${large ? "large" : ""}`}>
      <span />
      <span />
      <span />
    </div>
  );
}

function FadesLogo() {
  return (
    <div className="fades-logo">
      <FadesMark />
      <span>Fades</span>
    </div>
  );
}

/* =========================================================
   BROWSER PREVIEW
   ========================================================= */

function BrowserPreview() {
  return (
    <div className="browser-visual-wrap">
      <div className="browser-orbit orbit-one" />
      <div className="browser-orbit orbit-two" />

      <div className="browser-visual">
        <div className="browser-window">
          <div className="browser-titlebar">
            <div className="browser-traffic">
              <i />
              <i />
              <i />
            </div>

            <div className="browser-tabs">
              <div className="browser-tab active">
                <FadesMark />

                <span>New Tab</span>

                <b>×</b>
              </div>

              <button className="tab-add">+</button>
            </div>

            <div className="window-actions">
              <span>−</span>
              <span>□</span>
              <span>×</span>
            </div>
          </div>

          <div className="browser-toolbar">
            <div className="browser-nav">
              <span>‹</span>
              <span>›</span>
              <span>↻</span>
            </div>

            <div className="browser-address">
              <Icon name="lock" size={13} />

              <span>fades://newtab</span>

              <div className="address-end">
                <span>☆</span>
              </div>
            </div>

            <div className="browser-menu">
              <Icon name="menu" size={16} />
            </div>
          </div>

          <div className="browser-bookmarkbar">
            <span>Apps</span>
            <span>Fades</span>
            <span>Search</span>
            <span>+</span>
          </div>

          <div className="browser-page">
            <div className="page-grid" />

            <div className="page-glow page-glow-one" />
            <div className="page-glow page-glow-two" />

            <div className="newtab-content">
              <div className="newtab-mark">
                <FadesMark large />
              </div>

              <div className="newtab-title">
                <strong>Fades</strong>
                <span>The web, your way.</span>
              </div>

              <div className="newtab-search">
                <Icon name="globe" size={15} />

                <span>Search the web</span>

                <kbd>⌘ K</kbd>
              </div>

              <div className="quick-links">
                <div>
                  <span>F</span>
                  <label>Fades</label>
                </div>

                <div>
                  <span>+</span>
                  <label>Add shortcut</label>
                </div>
              </div>
            </div>

            <div className="browser-status">
              <span className="status-live" />
              <span>Fades Browser</span>
              <span>Private browsing</span>
              <span>·</span>
              <span>Ready</span>
            </div>
          </div>
        </div>

        <div className="browser-reflection" />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function DownloadPage() {
  const [platform, setPlatform] = useState("windows");
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    if (
      ua.includes("mac") ||
      ua.includes("iphone") ||
      ua.includes("ipad")
    ) {
      setPlatform("mac");
    } else if (
      ua.includes("linux") ||
      ua.includes("x11")
    ) {
      setPlatform("linux");
    } else {
      setPlatform("windows");
    }
  }, []);

  const selected = useMemo(
    () => DOWNLOADS[platform],
    [platform]
  );

  function downloadBrowser(target = platform) {
    const item = DOWNLOADS[target];

    if (!item?.url) return;

    window.location.href = item.url;
  }

  const faq = [
    {
      question: "Which version of Windows does Fades support?",
      answer:
        "The desktop version is designed for modern 64-bit Windows installations, including Windows 10 and Windows 11.",
    },
    {
      question: "Does Fades work on Apple Silicon?",
      answer:
        "Yes. The macOS release is designed as a universal application supporting both Apple Silicon and Intel Macs.",
    },
    {
      question: "Is Fades Browser free?",
      answer:
        "The Fades Browser download itself is free. Any future Fades services or optional features may have their own terms.",
    },
    {
      question: "Will my settings be saved?",
      answer:
        "Fades stores browser preferences locally and is designed around a persistent desktop browsing experience.",
    },
    {
      question: "How do I update Fades?",
      answer:
        "Fades releases will be distributed through the official Fades download channel. When an automatic updater is available, updates can be installed directly from the browser.",
    },
  ];

  return (
    <main className="fades-download">
      {/* ===================================================
          ATMOSPHERE
          =================================================== */}

      <div className="noise-layer" />

      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />

      {/* ===================================================
          NAVIGATION
          =================================================== */}

      <header className="site-nav">
        <div className="nav-inner">
          <a
            href="https://fades.lol"
            className="brand-link"
          >
            <FadesLogo />
          </a>

          <nav className="desktop-nav">
            <a href="#features">Features</a>
            <a href="#platforms">Platforms</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="nav-right">
            <a
              href="https://fades.lol"
              className="nav-fades"
            >
              Fades
              <Icon name="arrow" size={14} />
            </a>

            <a
              href="#download"
              className="nav-button"
            >
              Download
            </a>

            <button
              className="mobile-menu-button"
              onClick={() =>
                setMobileMenu(!mobileMenu)
              }
              aria-label="Open menu"
            >
              <Icon name="menu" size={19} />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="mobile-nav">
            <a
              href="#features"
              onClick={() => setMobileMenu(false)}
            >
              Features
            </a>

            <a
              href="#platforms"
              onClick={() => setMobileMenu(false)}
            >
              Platforms
            </a>

            <a
              href="#faq"
              onClick={() => setMobileMenu(false)}
            >
              FAQ
            </a>
          </div>
        )}
      </header>

      {/* ===================================================
          HERO
          =================================================== */}

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-copy">
            <div className="release-pill">
              <span className="release-dot" />

              <span>{RELEASE.status}</span>

              <span className="pill-divider" />

              <span>v{RELEASE.version}</span>
            </div>

            <h1>
              Browse
              <br />
              <span>without limits.</span>
            </h1>

            <p className="hero-text">
              Fades is a modern desktop browser built
              around speed, simplicity, and control.
              Everything you need to browse the web.
              Nothing getting in the way.
            </p>

            <div
              className="hero-download"
              id="download"
            >
              <button
                className="main-download"
                onClick={() =>
                  downloadBrowser()
                }
              >
                <span className="download-icon">
                  <Icon
                    name="download"
                    size={19}
                  />
                </span>

                <span className="download-copy">
                  <strong>
                    Download for{" "}
                    {selected.name}
                  </strong>

                  <small>
                    {selected.description}
                  </small>
                </span>

                <span className="download-arrow">
                  <Icon
                    name="arrow"
                    size={18}
                  />
                </span>
              </button>

              <div className="download-meta">
                <span>
                  <Icon
                    name={selected.icon}
                    size={13}
                  />

                  {selected.detail}
                </span>

                <i />

                <span>
                  v{RELEASE.version}
                </span>

                <i />

                <span>
                  {selected.extension}
                </span>
              </div>
            </div>

            <div className="trust-row">
              <div>
                <span className="trust-icon">
                  <Icon
                    name="shield"
                    size={15}
                  />
                </span>

                <span>
                  Privacy focused
                </span>
              </div>

              <div>
                <span className="trust-icon">
                  <Icon
                    name="bolt"
                    size={15}
                  />
                </span>

                <span>
                  Lightweight
                </span>
              </div>

              <div>
                <span className="trust-icon">
                  <Icon
                    name="spark"
                    size={15}
                  />
                </span>

                <span>
                  Built by Fades
                </span>
              </div>
            </div>
          </div>

          <BrowserPreview />
        </div>

        <div className="hero-bottom-line">
          <div>
            <span>FADES BROWSER</span>
            <i />
            <span>DESKTOP</span>
          </div>

          <span className="scroll-indicator">
            Scroll to explore
            <Icon
              name="chevron"
              size={14}
            />
          </span>
        </div>
      </section>

      {/* ===================================================
          STATS / IDENTITY STRIP
          =================================================== */}

      <section className="identity-strip">
        <div className="identity-inner">
          <div className="identity-item">
            <span className="identity-number">
              01
            </span>

            <div>
              <strong>Clean UI</strong>
              <span>
                Designed around your browsing
              </span>
            </div>
          </div>

          <div className="identity-item">
            <span className="identity-number">
              02
            </span>

            <div>
              <strong>Private by design</strong>
              <span>
                Your browser belongs to you
              </span>
            </div>
          </div>

          <div className="identity-item">
            <span className="identity-number">
              03
            </span>

            <div>
              <strong>Fades integrated</strong>
              <span>
                Built for the Fades ecosystem
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          FEATURES
          =================================================== */}

      <section
        className="features-section"
        id="features"
      >
        <div className="section-container">
          <div className="section-label">
            <span>01</span>
            <i />
            <span>THE BROWSER</span>
          </div>

          <div className="section-heading-row">
            <h2>
              A browser that
              <br />
              <em>gets out of your way.</em>
            </h2>

            <p>
              Fades combines a focused interface
              with the features you actually use,
              creating a browser that feels like a
              native part of your desktop.
            </p>
          </div>

          <div className="feature-layout">
            <div className="feature-large-card">
              <div className="feature-card-glow" />

              <div className="feature-card-top">
                <span className="feature-number">
                  01
                </span>

                <span className="feature-card-icon">
                  <Icon
                    name="bolt"
                    size={21}
                  />
                </span>
              </div>

              <div className="feature-card-content">
                <h3>
                  Fast
                  <br />
                  <span>by default.</span>
                </h3>

                <p>
                  Fades is built to feel instant.
                  Lightweight interfaces, focused
                  navigation, and no unnecessary
                  visual noise.
                </p>
              </div>

              <div className="mini-performance">
                <div className="performance-head">
                  <span>Browser performance</span>
                  <strong>Excellent</strong>
                </div>

                <div className="performance-line">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>

            <div className="feature-stack">
              <div className="feature-small-card">
                <div className="small-card-icon">
                  <Icon
                    name="shield"
                    size={20}
                  />
                </div>

                <div>
                  <h3>Private</h3>
                  <p>
                    Your browsing experience
                    stays yours.
                  </p>
                </div>

                <span className="card-index">
                  02
                </span>
              </div>

              <div className="feature-small-card">
                <div className="small-card-icon">
                  <Icon
                    name="globe"
                    size={20}
                  />
                </div>

                <div>
                  <h3>Fades Search</h3>
                  <p>
                    Search from a browser made
                    for the Fades ecosystem.
                  </p>
                </div>

                <span className="card-index">
                  03
                </span>
              </div>

              <div className="feature-small-card">
                <div className="small-card-icon">
                  <Icon
                    name="spark"
                    size={20}
                  />
                </div>

                <div>
                  <h3>Familiar</h3>
                  <p>
                    Everything feels where you
                    expect it to be.
                  </p>
                </div>

                <span className="card-index">
                  04
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          UI SHOWCASE
          =================================================== */}

      <section className="showcase-section">
        <div className="showcase-container">
          <div className="showcase-copy">
            <div className="section-label">
              <span>02</span>
              <i />
              <span>YOUR WORKSPACE</span>
            </div>

            <h2>
              Your tabs.
              <br />
              <span>Your space.</span>
            </h2>

            <p>
              Fades keeps the browser chrome
              deliberately quiet so your websites
              remain the focus.
            </p>

            <div className="showcase-points">
              <div>
                <span>
                  <Icon
                    name="check"
                    size={14}
                  />
                </span>

                <p>
                  Minimal browser chrome
                </p>
              </div>

              <div>
                <span>
                  <Icon
                    name="check"
                    size={14}
                  />
                </span>

                <p>
                  Fast navigation
                </p>
              </div>

              <div>
                <span>
                  <Icon
                    name="check"
                    size={14}
                  />
                </span>

                <p>
                  Fades-native new tab
                </p>
              </div>
            </div>
          </div>

          <div className="showcase-window">
            <div className="showcase-bar">
              <div className="showcase-lights">
                <i />
                <i />
                <i />
              </div>

              <div className="showcase-url">
                <Icon
                  name="lock"
                  size={11}
                />

                fades.lol
              </div>
            </div>

            <div className="showcase-page">
              <div className="fake-site-nav">
                <FadesLogo />

                <div>
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="fake-site-content">
                <div className="fake-site-kicker">
                  FADES
                </div>

                <div className="fake-site-title">
                  <span>Build.</span>
                  <span>Explore.</span>
                  <span>Connect.</span>
                </div>

                <div className="fake-site-line" />

                <div className="fake-site-cards">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          PLATFORMS
          =================================================== */}

      <section
        className="platform-section"
        id="platforms"
      >
        <div className="section-container">
          <div className="section-label">
            <span>03</span>
            <i />
            <span>DOWNLOAD</span>
          </div>

          <div className="platform-heading">
            <div>
              <h2>
                One browser.
                <br />
                <span>Every desktop.</span>
              </h2>
            </div>

            <p>
              Select your operating system to
              download the latest Fades Browser
              release.
            </p>
          </div>

          <div className="platform-selector">
            {Object.values(DOWNLOADS).map(
              (item) => (
                <button
                  key={item.id}
                  className={`platform-option ${
                    platform === item.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setPlatform(item.id)
                  }
                >
                  <div className="platform-option-icon">
                    <Icon
                      name={item.icon}
                      size={27}
                    />
                  </div>

                  <div className="platform-option-copy">
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.description}
                    </span>
                  </div>

                  <div className="platform-radio">
                    <span />
                  </div>
                </button>
              )
            )}
          </div>

          <div className="download-panel">
            <div className="download-panel-main">
              <div className="selected-platform">
                <div className="selected-icon">
                  <Icon
                    name={selected.icon}
                    size={25}
                  />
                </div>

                <div>
                  <span>
                    DOWNLOAD FOR
                  </span>

                  <strong>
                    {selected.name}
                  </strong>
                </div>
              </div>

              <div className="download-file">
                <strong>
                  {selected.file}
                </strong>

                <span>
                  Fades Browser v
                  {RELEASE.version}
                  {" · "}
                  {selected.detail}
                </span>
              </div>

              <button
                className="panel-download"
                onClick={() =>
                  downloadBrowser()
                }
              >
                <Icon
                  name="download"
                  size={18}
                />

                Download

                <Icon
                  name="arrow"
                  size={17}
                />
              </button>
            </div>

            <div className="download-panel-footer">
              <span>
                <Icon
                  name="shield"
                  size={13}
                />
                Official Fades release
              </span>

              <span>
                <Icon
                  name="lock"
                  size={13}
                />
                Secure connection
              </span>

              <span>
                Updated {RELEASE.updated}
              </span>
            </div>
          </div>

          <div className="other-downloads">
            <span>
              Looking for another platform?
            </span>

            {Object.values(DOWNLOADS)
              .filter(
                (item) => item.id !== platform
              )
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setPlatform(item.id)
                  }
                >
                  <Icon
                    name={item.icon}
                    size={14}
                  />

                  {item.name}

                  <Icon
                    name="arrow"
                    size={13}
                  />
                </button>
              ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          RELEASE
          =================================================== */}

      <section className="release-section">
        <div className="release-card">
          <div className="release-card-left">
            <div className="release-badge">
              <span />
              CURRENT RELEASE
            </div>

            <h2>
              Fades Browser
              <br />
              <span>v{RELEASE.version}</span>
            </h2>

            <p>
              The first desktop release of the
              Fades Browser.
            </p>
          </div>

          <div className="release-card-right">
            <div>
              <span>VERSION</span>
              <strong>
                {RELEASE.version}
              </strong>
            </div>

            <div>
              <span>CHANNEL</span>
              <strong>Stable</strong>
            </div>

            <div>
              <span>UPDATED</span>
              <strong>Oct 2026</strong>
            </div>

            <button
              onClick={() =>
                downloadBrowser()
              }
            >
              Get Fades
              <Icon
                name="arrow"
                size={16}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          FAQ
          =================================================== */}

      <section
        className="faq-section"
        id="faq"
      >
        <div className="section-container">
          <div className="faq-layout">
            <div className="faq-heading">
              <div className="section-label">
                <span>04</span>
                <i />
                <span>FAQ</span>
              </div>

              <h2>
                Questions,
                <br />
                <span>answered.</span>
              </h2>

              <p>
                Everything you need to know before
                installing Fades Browser.
              </p>
            </div>

            <div className="faq-list">
              {faq.map((item, index) => {
                const open = openFaq === index;

                return (
                  <div
                    className={`faq-item ${
                      open ? "open" : ""
                    }`}
                    key={item.question}
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(
                          open ? null : index
                        )
                      }
                    >
                      <span>
                        {item.question}
                      </span>

                      <span className="faq-icon">
                        <Icon
                          name="chevron"
                          size={16}
                        />
                      </span>
                    </button>

                    <div className="faq-answer">
                      <p>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          FINAL CTA
          =================================================== */}

      <section className="final-section">
        <div className="final-grid" />

        <div className="final-glow" />

        <div className="final-content">
          <div className="final-mark">
            <FadesMark large />
          </div>

          <span className="final-kicker">
            WELCOME TO FADES
          </span>

          <h2>
            The web
            <br />
            <span>starts here.</span>
          </h2>

          <p>
            Download Fades Browser and make the
            web yours.
          </p>

          <button
            className="final-download"
            onClick={() =>
              downloadBrowser()
            }
          >
            <Icon
              name="download"
              size={18}
            />

            Download for {selected.name}

            <Icon
              name="arrow"
              size={17}
            />
          </button>

          <span className="final-version">
            Fades Browser v{RELEASE.version}
          </span>
        </div>
      </section>

      {/* ===================================================
          FOOTER
          =================================================== */}

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <FadesLogo />

            <span>
              The web, your way.
            </span>
          </div>

          <div className="footer-links">
            <a href="#features">
              Features
            </a>

            <a href="#platforms">
              Downloads
            </a>

            <a href="#faq">
              FAQ
            </a>

            <a href="https://fades.lol">
              Fades
            </a>
          </div>

          <div className="footer-right">
            <span>
              © {new Date().getFullYear()} Fades
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
