"use client";

import { useEffect, useMemo, useState } from "react";
import "./globals.css";

const DOWNLOADS = {
  windows: {
    name: "Windows",
    subtitle: "Windows 10 and 11",
    extension: ".exe",
    icon: "windows",
    url: "#windows-download",
  },
  mac: {
    name: "macOS",
    subtitle: "Intel & Apple Silicon",
    extension: ".dmg",
    icon: "apple",
    url: "#mac-download",
  },
  linux: {
    name: "Linux",
    subtitle: "Debian, Ubuntu & more",
    extension: ".AppImage",
    icon: "linux",
    url: "#linux-download",
  },
};

function Icon({ name, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  if (name === "windows") {
    return (
      <svg {...common}>
        <path
          d="M2.5 4.25 10.25 3.2v8.05H2.5V4.25Zm9.25-1.27L21.5 1.75v9.5h-9.75V2.98ZM2.5 12.75h7.75v8.05L2.5 19.75v-7Zm9.25 0h9.75v9.5l-9.75-1.23v-8.27Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "apple") {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path
          d="M17.05 12.53c-.02-2.25 1.84-3.34 1.92-3.39a4.15 4.15 0 0 0-3.25-1.76c-1.38-.14-2.7.81-3.4.81-.71 0-1.8-.79-2.96-.77-1.52.02-2.92.88-3.7 2.24-1.59 2.75-.4 6.81 1.14 9.03.76 1.08 1.66 2.29 2.84 2.25 1.14-.05 1.57-.73 2.95-.73 1.37 0 1.76.73 2.96.7 1.23-.02 2-1.09 2.75-2.18.86-1.25 1.21-2.47 1.23-2.53-.03-.01-2.46-.94-2.48-3.67Zm-2.24-6.61c.62-.75 1.04-1.8.92-2.84-.89.04-1.97.59-2.61 1.34-.57.66-1.07 1.73-.94 2.75.99.08 2.01-.5 2.63-1.25Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "linux") {
    return (
      <svg {...common}>
        <path
          d="M12 2.25c-3.02 0-4.75 2.62-4.75 6.17 0 1.74-.53 3.12-1.28 4.43-.66 1.16-1.47 2.52-1.47 4.12 0 2.68 2.23 4.78 7.5 4.78s7.5-2.1 7.5-4.78c0-1.6-.81-2.96-1.47-4.12-.75-1.31-1.28-2.69-1.28-4.43C16.75 4.87 15.02 2.25 12 2.25Zm-3.5 7.5c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05-1.05-.47-1.05-1.05.47-1.05 1.05-1.05Zm7 0c.58 0 1.05.47 1.05 1.05s-.47 1.05-1.05 1.05-1.05-.47-1.05-1.05.47-1.05 1.05-1.05ZM9.1 15.5c.92.58 1.84.82 2.9.82s1.98-.24 2.9-.82c-.12 1.35-1.3 2.42-2.9 2.42s-2.78-1.07-2.9-2.42Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (name === "download") {
    return (
      <svg {...common}>
        <path
          d="M12 3v11m0 0 4-4m-4 4-4-4M4 17.5v1.25A2.25 2.25 0 0 0 6.25 21h11.5A2.25 2.25 0 0 0 20 18.75V17.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...common}>
        <path
          d="M12 3 19 6v5.25c0 4.35-2.94 7.84-7 9.75-4.06-1.91-7-5.4-7-9.75V6l7-3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="m9.2 12 1.85 1.85L15 9.9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "zap") {
    return (
      <svg {...common}>
        <path
          d="m13.25 2.5-8 11h6l-.5 8 8-11h-6l.5-8Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg {...common}>
        <rect
          x="5"
          y="10"
          width="14"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8 10V7.5a4 4 0 0 1 8 0V10"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg {...common}>
        <path
          d="M5 12h13m-5-5 5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return null;
}

function FadesLogo() {
  return (
    <div className="fades-logo">
      <div className="fades-logo-mark">
        <span />
        <span />
        <span />
      </div>

      <span>Fades</span>
    </div>
  );
}

export default function DownloadPage() {
  const [platform, setPlatform] = useState("windows");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes("mac")) {
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

  function handleDownload() {
    /*
     * Replace these with your real release URLs.
     *
     * Example:
     *
     * Windows:
     * https://downloads.fades.lol/FadesBrowserSetup.exe
     *
     * macOS:
     * https://downloads.fades.lol/FadesBrowser.dmg
     *
     * Linux:
     * https://downloads.fades.lol/FadesBrowser.AppImage
     */

    const urls = {
      windows: "https://downloads.fades.lol/FadesBrowserSetup.exe",
      mac: "https://downloads.fades.lol/FadesBrowser.dmg",
      linux: "https://downloads.fades.lol/FadesBrowser.AppImage",
    };

    window.location.href = urls[platform];
  }

  return (
    <main className="download-page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <nav className="download-nav">
        <a href="https://fades.lol" className="brand">
          <FadesLogo />
        </a>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#platforms">Platforms</a>
          <a href="https://fades.lol">Fades</a>
        </div>

        <a
          href="#download"
          className="nav-download"
        >
          Download
        </a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            Fades Browser
          </div>

          <h1>
            The web,
            <br />
            <span>without the noise.</span>
          </h1>

          <p className="hero-description">
            A fast, private browser built around the
            Fades experience. Clean by default. Powerful
            when you need it.
          </p>

          <div className="hero-actions">
            <button
              className="primary-download"
              onClick={handleDownload}
            >
              <Icon name="download" size={20} />

              <span>
                Download for {selected.name}
                <small>{selected.subtitle}</small>
              </span>

              <Icon name="arrow" size={19} />
            </button>

            <a
              href="#platforms"
              className="secondary-action"
            >
              Other platforms
            </a>
          </div>

          <div className="hero-meta">
            <span>
              <Icon name="shield" size={15} />
              Private by design
            </span>

            <span>
              <Icon name="zap" size={15} />
              Fast & lightweight
            </span>
          </div>
        </div>

        <div className="browser-stage">
          <div className="browser-shadow" />

          <div className="browser-window">
            <div className="browser-top">
              <div className="traffic-lights">
                <i />
                <i />
                <i />
              </div>

              <div className="browser-tabs">
                <div className="browser-tab active">
                  <div className="mini-logo">
                    <span />
                    <span />
                    <span />
                  </div>

                  <span>New Tab</span>

                  <b>×</b>
                </div>

                <div className="new-tab">+</div>
              </div>

              <div className="browser-controls">
                <span>−</span>
                <span>□</span>
                <span>×</span>
              </div>
            </div>

            <div className="browser-toolbar">
              <div className="toolbar-arrows">
                <span>‹</span>
                <span>›</span>
                <span>↻</span>
              </div>

              <div className="address-bar">
                <Icon name="lock" size={14} />
                <span>fades://newtab</span>
              </div>

              <div className="toolbar-menu">⋮</div>
            </div>

            <div className="browser-content">
              <div className="browser-content-glow" />

              <div className="browser-brand">
                <div className="large-logo">
                  <span />
                  <span />
                  <span />
                </div>

                <h3>Fades</h3>

                <p>
                  The web, your way.
                </p>
              </div>

              <div className="fake-search">
                <span>Search the web</span>
                <div>⌕</div>
              </div>

              <div className="fake-bookmarks">
                <div>F</div>
                <div>G</div>
                <div>+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="features-section"
        id="features"
      >
        <div className="section-heading">
          <span>BUILT DIFFERENT</span>

          <h2>
            Everything you need.
            <br />
            Nothing you don't.
          </h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Icon name="zap" />
            </div>

            <h3>Fast by default</h3>

            <p>
              Fades is designed to stay responsive,
              lightweight, and out of your way.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Icon name="shield" />
            </div>

            <h3>Private browsing</h3>

            <p>
              Your browsing experience belongs to you.
              Fades keeps privacy at the center.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Icon name="lock" />
            </div>

            <h3>Your browser</h3>

            <p>
              A clean interface with the tools you
              actually need, without unnecessary clutter.
            </p>
          </div>
        </div>
      </section>

      <section
        className="platform-section"
        id="platforms"
      >
        <div className="platform-heading">
          <div>
            <span>DOWNLOAD FADES</span>

            <h2>
              Available on your desktop.
            </h2>
          </div>

          <p>
            Choose your platform and get started.
            More platforms are coming.
          </p>
        </div>

        <div className="platform-grid">
          {Object.entries(DOWNLOADS).map(
            ([key, item]) => (
              <button
                key={key}
                className={`platform-card ${
                  platform === key ? "selected" : ""
                }`}
                onClick={() => setPlatform(key)}
              >
                <div className="platform-icon">
                  <Icon
                    name={item.icon}
                    size={28}
                  />
                </div>

                <div className="platform-info">
                  <strong>{item.name}</strong>
                  <span>{item.subtitle}</span>
                </div>

                <div className="platform-arrow">
                  <Icon
                    name="arrow"
                    size={18}
                  />
                </div>
              </button>
            )
          )}
        </div>

        <div className="download-bottom">
          <button
            className="big-download"
            onClick={handleDownload}
          >
            <Icon name="download" size={20} />

            Download Fades for {selected.name}

            <span>{selected.extension}</span>
          </button>

          <p>
            By downloading Fades, you agree to the
            applicable terms and privacy policy.
          </p>
        </div>
      </section>

      <footer className="download-footer">
        <FadesLogo />

        <div className="footer-links">
          <a href="https://fades.lol">
            Fades
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#platforms">
            Downloads
          </a>
        </div>

        <span>
          © {new Date().getFullYear()} Fades
        </span>
      </footer>
    </main>
  );
}
