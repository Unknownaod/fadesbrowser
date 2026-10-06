"use client";

import { useEffect, useState } from "react";
import "./terms.css";

const LAST_UPDATED = "October 6, 2026";

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    back: (
      <>
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </>
    ),
    moon: (
      <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5a8.5 8.5 0 1 0 12 12Z" />
    ),
    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8.1-8 9-4.6-.9-8-4-8-9V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    document: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

export default function TermsPage() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("fades-theme");

    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";

    setTheme(next);
    localStorage.setItem("fades-theme", next);
    document.documentElement.dataset.theme = next;
  }

  return (
    <main className="terms-page">
      <div className="terms-grid" />
      <div className="terms-glow terms-glow-one" />
      <div className="terms-glow terms-glow-two" />

      <header className="terms-header">
        <a href="https://fades.lol" className="brand">
          <img src="/logo.png" alt="Fades" />
          <span>Fades</span>
        </a>

        <div className="header-actions">
          <button
            className="theme-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>

          <a href="https://fades.lol" className="back-button">
            <Icon name="back" size={17} />
            Back to Fades
          </a>
        </div>
      </header>

      <section className="terms-hero">
        <div className="hero-icon">
          <Icon name="document" size={27} />
        </div>

        <div className="eyebrow">FADES BROWSER</div>

        <h1>
          Terms of
          <span> Service.</span>
        </h1>

        <p>
          The rules and policies that govern your use of Fades Browser and
          related Fades services.
        </p>

        <div className="updated">
          Last updated <strong>{LAST_UPDATED}</strong>
        </div>
      </section>

      <div className="terms-layout">
        <aside className="terms-sidebar">
          <div className="sidebar-card">
            <span className="sidebar-label">ON THIS PAGE</span>

            <a href="#acceptance">Acceptance</a>
            <a href="#use">Using Fades</a>
            <a href="#content">Your Content</a>
            <a href="#privacy">Privacy</a>
            <a href="#security">Security</a>
            <a href="#availability">Availability</a>
            <a href="#changes">Changes</a>
            <a href="#contact">Contact</a>
          </div>
        </aside>

        <article className="terms-content">
          <section id="acceptance">
            <span className="section-number">01</span>
            <h2>Acceptance of these terms</h2>

            <p>
              By downloading, installing, accessing, or using Fades Browser,
              you agree to these Terms of Service. If you do not agree with
              these terms, you should not use the browser or related Fades
              services.
            </p>

            <p>
              These terms apply to Fades Browser and features or services
              provided directly by Fades unless a separate agreement states
              otherwise.
            </p>
          </section>

          <section id="use">
            <span className="section-number">02</span>
            <h2>Using Fades Browser</h2>

            <p>
              Fades Browser is provided for lawful personal and commercial
              use. You agree not to use Fades Browser to violate applicable
              laws, interfere with other users, distribute malicious software,
              or attempt to compromise the security of Fades or third-party
              systems.
            </p>

            <div className="info-box">
              <div className="info-box-icon">
                <Icon name="shield" size={20} />
              </div>

              <div>
                <strong>Use the web responsibly.</strong>
                <p>
                  You are responsible for the websites you visit, content you
                  access, and actions you take while using the browser.
                </p>
              </div>
            </div>
          </section>

          <section id="content">
            <span className="section-number">03</span>
            <h2>Your content</h2>

            <p>
              Fades Browser may allow you to store browser information such as
              bookmarks, preferences, settings, or other locally stored data.
              You retain responsibility for that information.
            </p>

            <p>
              You should maintain appropriate backups of anything important
              that you store through the browser or related services.
            </p>
          </section>

          <section id="privacy">
            <span className="section-number">04</span>
            <h2>Privacy statement</h2>

            <p>
              We believe your browsing experience should remain as private as
              reasonably possible. Fades does not sell your personal
              information to advertisers or data brokers.
            </p>

            <h3>Information we may collect</h3>

            <ul>
              <li>
                Basic technical information required to operate and secure our
                services.
              </li>
              <li>
                Crash reports or diagnostic information when enabled or
                necessary to troubleshoot problems.
              </li>
              <li>
                Information you voluntarily provide when using Fades services.
              </li>
              <li>
                Basic usage information needed to maintain reliability,
                security, and performance.
              </li>
            </ul>

            <h3>Information we do not intentionally collect</h3>

            <p>
              Fades does not intentionally collect or store the contents of
              your private browsing sessions merely because you use Fades
              Browser. Your local browser data, including browsing history,
              bookmarks, and saved settings, may remain stored on your device
              depending on your browser configuration.
            </p>

            <h3>Searches and websites</h3>

            <p>
              When you search or visit a website, your request may be processed
              by the search provider or website you choose to use. Those
              third-party services have their own privacy policies and may
              collect information independently from Fades.
            </p>

            <h3>Cookies and local storage</h3>

            <p>
              Fades websites may use cookies, local storage, or similar
              technologies for things such as authentication, preferences,
              security, and basic functionality.
            </p>

            <p>
              Fades does not use these technologies to intentionally create a
              detailed advertising profile of your browsing activity.
            </p>
          </section>

          <section id="security">
            <span className="section-number">05</span>
            <h2>Security</h2>

            <p>
              We take reasonable measures to protect Fades services and the
              information handled by them. However, no software, network, or
              internet service can be guaranteed to be completely secure.
            </p>

            <p>
              You are responsible for keeping your device, operating system,
              and accounts secure, including using appropriate passwords and
              security settings.
            </p>
          </section>

          <section id="availability">
            <span className="section-number">06</span>
            <h2>Availability</h2>

            <p>
              We work to keep Fades Browser and its services available and
              reliable, but we cannot guarantee uninterrupted operation.
              Features may occasionally be changed, temporarily unavailable,
              discontinued, or replaced.
            </p>
          </section>

          <section id="changes">
            <span className="section-number">07</span>
            <h2>Changes to these terms</h2>

            <p>
              We may update these Terms of Service or our privacy practices
              from time to time. When changes are made, the updated version
              will be published on this page with a new “Last updated” date.
            </p>

            <p>
              Continuing to use Fades after an updated version becomes
              effective means you accept the updated terms.
            </p>
          </section>

          <section id="contact">
            <span className="section-number">08</span>
            <h2>Contact</h2>

            <p>
              If you have questions about these Terms of Service or the Fades
              privacy statement, please contact the Fades team through the
              official Fades website.
            </p>

            <a href="https://fades.lol" className="contact-link">
              Visit Fades
              <Icon name="arrow" size={17} />
            </a>
          </section>

          <div className="terms-footer-card">
            <div>
              <Icon name="shield" size={23} />
            </div>

            <section>
              <strong>Privacy is part of the product.</strong>
              <p>
                We aim to keep Fades simple, private, and transparent about
                how our services operate.
              </p>
            </section>
          </div>
        </article>
      </div>

      <footer className="terms-footer">
        <div className="footer-brand">
          <img src="/logo.png" alt="Fades" />
          <span>Fades</span>
        </div>

        <span>© {new Date().getFullYear()} Fades. All rights reserved.</span>

        <div className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="https://fades.lol">Fades</a>
        </div>
      </footer>
    </main>
  );
}
