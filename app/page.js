"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api-fades.lol";

const features = [
  {
    icon: "◈",
    title: "Cloud Sync",
    text: "Keep tabs, bookmarks, settings, history and browser data synchronized across your devices.",
  },
  {
    icon: "⌁",
    title: "Private by Design",
    text: "Sensitive browser data such as passwords, cookies and encryption keys remain local-only.",
  },
  {
    icon: "▣",
    title: "Your Browser",
    text: "Tabs, windows, bookmarks, history, downloads, sessions, extensions and more.",
  },
  {
    icon: "◌",
    title: "Built for Fades",
    text: "A browser experience designed around the Fades ecosystem and your account.",
  },
];

const capabilityGroups = [
  {
    title: "Browsing",
    items: [
      "Tabs",
      "Windows",
      "Private windows",
      "Tab groups",
      "Pinned tabs",
      "Recently closed",
      "Workspaces",
    ],
  },
  {
    title: "Organization",
    items: [
      "Bookmarks",
      "Bookmark folders",
      "Favorites",
      "Reading list",
      "Collections",
      "Saved pages",
      "Notes",
    ],
  },
  {
    title: "Account",
    items: [
      "Cloud sync",
      "Cloud backup",
      "Export",
      "Restore",
      "Device management",
    ],
  },
  {
    title: "Privacy & Security",
    items: [
      "Site permissions",
      "Site settings",
      "Security events",
      "Safe browsing",
      "Do Not Track",
      "HTTPS-only mode",
    ],
  },
];

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [apiInfo, setApiInfo] = useState(null);
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);

  useEffect(() => {
    checkAPI();
    loadAccount();
  }, []);

  async function checkAPI() {
    try {
      setApiStatus("checking");

      const response = await fetch(`${API_URL}/health`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("API unavailable");
      }

      setApiInfo(data);
      setApiStatus("online");
    } catch (error) {
      console.error("API health check failed:", error);
      setApiStatus("offline");
    }
  }

  async function loadAccount() {
    try {
      setLoadingAccount(true);

      const response = await fetch(`${API_URL}/account`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load account");
      }

      const data = await response.json();

      if (!data.success || !data.user) {
        setAuthenticated(false);
        return;
      }

      setAccount(data.user);
      setAuthenticated(true);

      await Promise.all([
        loadProfile(),
        loadSettings(),
        loadStats(),
      ]);
    } catch (error) {
      console.error("Account request failed:", error);
      setAuthenticated(false);
    } finally {
      setLoadingAccount(false);
    }
  }

  async function loadProfile() {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Profile request failed:", error);
    }
  }

  async function loadSettings() {
    try {
      const response = await fetch(`${API_URL}/settings`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Settings request failed:", error);
    }
  }

  async function loadStats() {
    try {
      const response = await fetch(`${API_URL}/stats`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Stats request failed:", error);
    }
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function totalBrowserRecords() {
    if (!stats) return 0;

    return Object.values(stats).reduce(
      (total, value) =>
        total + (typeof value === "number" ? value : 0),
      0
    );
  }

  const displayName =
    account?.displayName ||
    account?.username ||
    "Fades User";

  return (
    <main className="site">
      <div className="background">
        <div className="orb orbOne" />
        <div className="orb orbTwo" />
        <div className="orb orbThree" />

        <div className="grid" />
      </div>

      <nav className="navbar">
        <div className="navInner">
          <button
            className="brand"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="brandMark">
              F
            </div>

            <div className="brandText">
              <strong>Fades</strong>
              <span>Browser</span>
            </div>
          </button>

          <div className="navLinks">
            <button onClick={() => scrollTo("features")}>
              Features
            </button>

            <button onClick={() => scrollTo("capabilities")}>
              Capabilities
            </button>

            <button onClick={() => scrollTo("dashboard")}>
              Dashboard
            </button>
          </div>

          <div className="navActions">
            {authenticated ? (
              <button
                className="accountButton"
                onClick={() => scrollTo("dashboard")}
              >
                <span className="accountDot" />
                {displayName}
              </button>
            ) : (
              <button
                className="ghostButton"
                onClick={() => scrollTo("dashboard")}
              >
                Sign in
              </button>
            )}

            <button
              className="primaryButton small"
              onClick={() => scrollTo("download")}
            >
              Get Fades
            </button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="heroContent">
          <div className="statusPill">
            <span
              className={`statusDot ${
                apiStatus === "online"
                  ? "online"
                  : apiStatus === "offline"
                    ? "offline"
                    : ""
              }`}
            />

            {apiStatus === "online"
              ? "Fades API is online"
              : apiStatus === "offline"
                ? "API unavailable"
                : "Connecting to Fades API"}
          </div>

          <h1>
            The browser
            <br />
            <span>built around you.</span>
          </h1>

          <p className="heroText">
            Fades Browser brings your browsing experience into
            the Fades ecosystem. Sync your browser, organize
            everything, and keep control of your data.
          </p>

          <div className="heroActions">
            <button
              className="primaryButton"
              onClick={() => scrollTo("download")}
            >
              <span>Download Fades Browser</span>
              <span className="arrow">→</span>
            </button>

            <button
              className="secondaryButton"
              onClick={() => scrollTo("features")}
            >
              Explore features
            </button>
          </div>

          <div className="heroMeta">
            <div>
              <span className="metaValue">01</span>
              <span className="metaLabel">Cloud sync</span>
            </div>

            <div>
              <span className="metaValue">∞</span>
              <span className="metaLabel">Your data</span>
            </div>

            <div>
              <span className="metaValue">0</span>
              <span className="metaLabel">AI tracking</span>
            </div>
          </div>
        </div>

        <div className="browserPreview">
          <div className="previewGlow" />

          <div className="browserWindow">
            <div className="windowTop">
              <div className="windowControls">
                <span />
                <span />
                <span />
              </div>

              <div className="fakeTabs">
                <div className="fakeTab active">
                  <div className="miniLogo">F</div>
                  Fades Browser
                </div>

                <div className="newTab">+</div>
              </div>
            </div>

            <div className="addressBar">
              <span className="lock">⌁</span>
              <span>fades.lol</span>
              <span className="addressActions">☆ ⋮</span>
            </div>

            <div className="previewPage">
              <div className="previewLogo">F</div>

              <h3>Welcome back.</h3>

              <p>
                Everything you need is right here.
              </p>

              <div className="previewSearch">
                <span>⌕</span>
                <span>Search with Fades</span>
                <span className="searchShortcut">⌘ K</span>
              </div>

              <div className="previewCards">
                <div />
                <div />
                <div />
              </div>
            </div>

            <div className="windowBottom">
              <span>Fades Browser</span>
              <span>
                {apiStatus === "online"
                  ? "Connected"
                  : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="sectionHeading">
          <div className="eyebrow">WHY FADES</div>

          <h2>
            Everything you need.
            <br />
            <span>Nothing you don't.</span>
          </h2>

          <p>
            Fades Browser is designed to make the web feel
            faster, cleaner, and more personal.
          </p>
        </div>

        <div className="featureGrid">
          {features.map((feature) => (
            <div className="featureCard" key={feature.title}>
              <div className="featureIcon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

              <div className="cardArrow">↗</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section capabilitySection" id="capabilities">
        <div className="sectionHeading centered">
          <div className="eyebrow">CAPABILITIES</div>

          <h2>
            Your browser,
            <br />
            <span>fully connected.</span>
          </h2>

          <p>
            The Fades API supports a complete browser cloud
            layer instead of just storing a few preferences.
          </p>
        </div>

        <div className="capabilityGrid">
          {capabilityGroups.map((group) => (
            <div className="capabilityCard" key={group.title}>
              <div className="capabilityHeader">
                <span className="capabilityNumber">
                  {String(
                    capabilityGroups.indexOf(group) + 1
                  ).padStart(2, "0")}
                </span>

                <h3>{group.title}</h3>
              </div>

              <div className="capabilityItems">
                {group.items.map((item) => (
                  <div className="capabilityItem" key={item}>
                    <span className="check">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboardSection" id="dashboard">
        <div className="dashboardShell">
          <div className="dashboardHeader">
            <div>
              <div className="eyebrow">FADE ACCOUNT</div>

              <h2>
                {authenticated
                  ? `Welcome back, ${displayName}.`
                  : "Your Fades account."}
              </h2>

              <p>
                {authenticated
                  ? "Your browser is connected to the Fades cloud."
                  : "Sign in through your Fades account to access browser sync."}
              </p>
            </div>

            <div
              className={`connectionBadge ${
                authenticated ? "connected" : ""
              }`}
            >
              <span />
              {authenticated ? "Connected" : "Not signed in"}
            </div>
          </div>

          {authenticated ? (
            <>
              <div className="accountGrid">
                <div className="accountCard profileCard">
                  <div className="profileAvatar">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt=""
                      />
                    ) : (
                      (
                        displayName?.[0] || "F"
                      ).toUpperCase()
                    )}
                  </div>

                  <div>
                    <span className="cardLabel">
                      PROFILE
                    </span>

                    <strong>
                      {profile?.browserName ||
                        "Fades Browser"}
                    </strong>

                    <span className="muted">
                      {account?.email ||
                        account?.username ||
                        "Fades account"}
                    </span>
                  </div>
                </div>

                <div className="accountCard">
                  <span className="cardLabel">
                    PLAN
                  </span>

                  <strong className="planValue">
                    {(account?.plan || "free").toUpperCase()}
                  </strong>

                  <span className="muted">
                    Fades Browser account
                  </span>
                </div>

                <div className="accountCard">
                  <span className="cardLabel">
                    SYNCED DATA
                  </span>

                  <strong className="bigNumber">
                    {totalBrowserRecords().toLocaleString()}
                  </strong>

                  <span className="muted">
                    stored browser records
                  </span>
                </div>
              </div>

              <div className="settingsPanel">
                <div>
                  <span className="cardLabel">
                    CURRENT SETTINGS
                  </span>

                  <h3>
                    {settings?.defaultSearchEngine ||
                      "Fades"}{" "}
                    search
                  </h3>

                  <p>
                    Theme:{" "}
                    {settings?.appearance?.theme ||
                      "system"}{" "}
                    ·{" "}
                    {settings?.privacy?.blockThirdPartyCookies
                      ? "Third-party cookies blocked"
                      : "Third-party cookies allowed"}
                  </p>
                </div>

                <div className="syncIndicator">
                  <span className="syncIcon">↻</span>
                  <div>
                    <strong>Cloud sync ready</strong>
                    <span>
                      Your browser data can be synchronized
                      across devices.
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="loginPanel">
              <div className="loginIcon">F</div>

              <h3>Sign in to Fades</h3>

              <p>
                Your Fades session will automatically connect
                this page to your browser account.
              </p>

              <button
                className="primaryButton"
                onClick={() => {
                  window.location.href =
                    "https://fades.lol/login";
                }}
              >
                Continue to Fades
                <span className="arrow">→</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="downloadSection" id="download">
        <div className="downloadGlow" />

        <div className="downloadContent">
          <div className="eyebrow">FADE INTO THE WEB</div>

          <h2>
            Your next browser
            <br />
            <span>starts here.</span>
          </h2>

          <p>
            Experience Fades Browser with cloud synchronization,
            powerful organization tools, privacy controls and
            a browser experience built for the Fades ecosystem.
          </p>

          <div className="downloadButtons">
            <button
              className="primaryButton large"
              onClick={() => {
                window.location.href =
                  "https://fades.lol/download";
              }}
            >
              Download Fades Browser
              <span className="arrow">↓</span>
            </button>

            <button
              className="secondaryButton"
              onClick={() => scrollTo("features")}
            >
              Learn more
            </button>
          </div>

          <div className="apiStatusBox">
            <div className="apiStatusLeft">
              <span
                className={`statusDot ${
                  apiStatus === "online"
                    ? "online"
                    : apiStatus === "offline"
                      ? "offline"
                      : ""
                }`}
              />

              <div>
                <strong>
                  {apiStatus === "online"
                    ? "Fades API operational"
                    : apiStatus === "offline"
                      ? "Fades API unavailable"
                      : "Checking Fades API"}
                </strong>

                <span>
                  {API_URL}
                </span>
              </div>
            </div>

            {apiInfo?.version && (
              <span className="apiVersion">
                v{apiInfo.version}
              </span>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footerBrand">
          <div className="brandMark">F</div>

          <div>
            <strong>Fades Browser</strong>
            <span>Built for the Fades ecosystem.</span>
          </div>
        </div>

        <div className="footerLinks">
          <a href="https://fades.lol">Fades</a>
          <a href="https://fades.lol/download">
            Download
          </a>
          <a href="https://api-fades.lol/health">
            API
          </a>
        </div>

        <div className="footerCopyright">
          © {new Date().getFullYear()} Fades
        </div>
      </footer>
    </main>
  );
}
