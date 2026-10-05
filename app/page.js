"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api-fades.lol";

const HOME_URL = "fades://newtab";

const DEFAULT_BOOKMARKS = [
  {
    id: "fades",
    title: "Fades",
    url: "https://fades.lol",
  },
  {
    id: "mail",
    title: "Fades Mail",
    url: "https://mail.fades.lol",
  },
];

const DEFAULT_SEARCH = "https://www.google.com/search?q=";

function normalizeUrl(value) {
  const input = value.trim();

  if (!input) return HOME_URL;

  if (
    input.startsWith("fades://") ||
    input.startsWith("about:") ||
    input.startsWith("http://") ||
    input.startsWith("https://")
  ) {
    return input;
  }

  if (
    input.includes(".") &&
    !input.includes(" ")
  ) {
    return `https://${input}`;
  }

  return `${DEFAULT_SEARCH}${encodeURIComponent(input)}`;
}

function getDisplayUrl(url) {
  if (url === HOME_URL) return "";

  try {
    const parsed = new URL(url);

    return `${parsed.hostname}${parsed.pathname === "/" ? "" : parsed.pathname}`;
  } catch {
    return url;
  }
}

function isInternal(url) {
  return (
    url.startsWith("fades://") ||
    url.startsWith("about:")
  );
}

function Favicon({ url, size = 16 }) {
  const [failed, setFailed] = useState(false);

  if (failed || !url || isInternal(url)) {
    return (
      <span
        className="faviconFallback"
        style={{
          width: size,
          height: size,
        }}
      >
        F
      </span>
    );
  }

  let hostname = "";

  try {
    hostname = new URL(url).hostname;
  } catch {
    hostname = "";
  }

  return (
    <img
      className="favicon"
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        hostname
      )}&sz=64`}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}

function Icon({ name, size = 18 }) {
  const paths = {
    back: (
      <>
        <path d="M15 6l-6 6 6 6" />
        <path d="M9 12h10" />
      </>
    ),
    forward: (
      <>
        <path d="M9 6l6 6-6 6" />
        <path d="M15 12H5" />
      </>
    ),
    reload: (
      <>
        <path d="M20 11a8 8 0 0 0-14.9-3" />
        <path d="M5 4v4h4" />
        <path d="M4 13a8 8 0 0 0 14.9 3" />
        <path d="M19 20v-4h-4" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    star: (
      <path d="M12 3.5l2.65 5.38 5.94.86-4.3 4.2 1.01 5.92L12 17.07l-5.3 2.79 1.01-5.92-4.3-4.2 5.94-.86L12 3.5z" />
    ),
    lock: (
      <>
        <rect x="5" y="9" width="14" height="11" rx="2" />
        <path d="M8 9V6a4 4 0 0 1 8 0v3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="M16 16l4 4" />
      </>
    ),
    menu: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    shield: (
      <path d="M12 3l7 3v5c0 4.6-2.8 8.2-7 10-4.2-1.8-7-5.4-7-10V6l7-3z" />
    ),
    download: (
      <>
        <path d="M12 4v10" />
        <path d="M8 11l4 4 4-4" />
        <path d="M5 20h14" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    bookmark: (
      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.8L6 21V4.5z" />
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6v-2.6h.5A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.5V14h-.5a1.7 1.7 0 0 0-1.5 1z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.8-3.5 3.1-5.2 7-5.2s6.2 1.7 7 5.2" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </>
    ),
    external: (
      <>
        <path d="M14 5h5v5" />
        <path d="M19 5l-8 8" />
        <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
      </>
    ),
  };

  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function HomePage() {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: "New Tab",
      url: HOME_URL,
      history: [HOME_URL],
      historyIndex: 0,
      loading: false,
    },
  ]);

  const [activeTabId, setActiveTabId] = useState(1);
  const [address, setAddress] = useState("");
  const [bookmarks, setBookmarks] = useState(DEFAULT_BOOKMARKS);
  const [history, setHistory] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addressRef = useRef(null);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) || tabs[0],
    [tabs, activeTabId]
  );

  const isBookmarked = useMemo(() => {
    if (!activeTab || isInternal(activeTab.url)) return false;

    return bookmarks.some(
      (bookmark) => bookmark.url === activeTab.url
    );
  }, [activeTab, bookmarks]);

  const apiFetch = useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return response.json();
    },
    []
  );

  useEffect(() => {
    checkAPI();
    loadCloudData();
  }, []);

  useEffect(() => {
    if (activeTab) {
      setAddress(
        activeTab.url === HOME_URL
          ? ""
          : activeTab.url
      );
    }
  }, [activeTabId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const modifier = event.ctrlKey || event.metaKey;

      if (modifier && event.key.toLowerCase() === "l") {
        event.preventDefault();
        addressRef.current?.focus();
        addressRef.current?.select();
        return;
      }

      if (modifier && event.key.toLowerCase() === "t") {
        event.preventDefault();
        createTab();
        return;
      }

      if (modifier && event.key.toLowerCase() === "w") {
        event.preventDefault();
        closeTab(activeTabId);
        return;
      }

      if (modifier && event.key.toLowerCase() === "d") {
        event.preventDefault();
        toggleBookmark();
        return;
      }

      if (event.altKey && event.key === "ArrowLeft") {
        event.preventDefault();
        goBack();
        return;
      }

      if (event.altKey && event.key === "ArrowRight") {
        event.preventDefault();
        goForward();
        return;
      }

      if (event.key === "Escape") {
        setShowMenu(false);
        setShowBookmarks(false);
        setShowHistory(false);
        setShowDownloads(false);
        setShowSettings(false);
        setShowAccount(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTabId, tabs, bookmarks]);

  async function checkAPI() {
    try {
      const response = await fetch(`${API_URL}/health`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("API unavailable");
      }

      const data = await response.json();

      setApiStatus(data.success ? "online" : "offline");
    } catch {
      setApiStatus("offline");
    }
  }

  async function loadCloudData() {
    try {
      const accountResponse = await apiFetch("/account");

      if (!accountResponse?.success || !accountResponse?.user) {
        return;
      }

      setAccount(accountResponse.user);

      const results = await Promise.allSettled([
        apiFetch("/profile"),
        apiFetch("/settings"),
        apiFetch("/stats"),
        apiFetch("/bookmarks"),
        apiFetch("/history"),
        apiFetch("/downloads"),
      ]);

      const [
        profileResult,
        settingsResult,
        statsResult,
        bookmarksResult,
        historyResult,
        downloadsResult,
      ] = results;

      if (
        profileResult.status === "fulfilled" &&
        profileResult.value?.success
      ) {
        setProfile(profileResult.value.profile);
      }

      if (
        settingsResult.status === "fulfilled" &&
        settingsResult.value?.success
      ) {
        setSettings(settingsResult.value.settings);
      }

      if (
        statsResult.status === "fulfilled" &&
        statsResult.value?.success
      ) {
        setStats(statsResult.value.stats);
      }

      if (
        bookmarksResult.status === "fulfilled" &&
        bookmarksResult.value?.success
      ) {
        const remote =
          bookmarksResult.value.bookmarks ||
          bookmarksResult.value.data ||
          [];

        if (Array.isArray(remote) && remote.length) {
          setBookmarks(remote);
        }
      }

      if (
        historyResult.status === "fulfilled" &&
        historyResult.value?.success
      ) {
        const remote =
          historyResult.value.history ||
          historyResult.value.items ||
          [];

        if (Array.isArray(remote)) {
          setHistory(remote);
        }
      }

      if (
        downloadsResult.status === "fulfilled" &&
        downloadsResult.value?.success
      ) {
        const remote =
          downloadsResult.value.downloads ||
          downloadsResult.value.items ||
          [];

        if (Array.isArray(remote)) {
          setDownloads(remote);
        }
      }
    } catch {
      // The browser remains fully usable without an account.
    }
  }

  function createTab(url = HOME_URL) {
    const id = Date.now() + Math.random();

    const newTab = {
      id,
      title: url === HOME_URL ? "New Tab" : "Loading...",
      url,
      history: [url],
      historyIndex: 0,
      loading: false,
    };

    setTabs((current) => [...current, newTab]);
    setActiveTabId(id);
    setAddress(url === HOME_URL ? "" : url);
  }

  function closeTab(id) {
    if (tabs.length === 1) {
      const replacement = {
        id: Date.now(),
        title: "New Tab",
        url: HOME_URL,
        history: [HOME_URL],
        historyIndex: 0,
        loading: false,
      };

      setTabs([replacement]);
      setActiveTabId(replacement.id);
      return;
    }

    const index = tabs.findIndex((tab) => tab.id === id);
    const remaining = tabs.filter((tab) => tab.id !== id);

    setTabs(remaining);

    if (activeTabId === id) {
      const next =
        remaining[Math.max(0, index - 1)] ||
        remaining[0];

      setActiveTabId(next.id);
    }
  }

  function navigate(value, { replace = false } = {}) {
    const url = normalizeUrl(value);

    if (!activeTab) return;

    setTabs((current) =>
      current.map((tab) => {
        if (tab.id !== activeTabId) return tab;

        const history = replace
          ? [...tab.history.slice(0, tab.historyIndex), url]
          : [
              ...tab.history.slice(0, tab.historyIndex + 1),
              url,
            ];

        return {
          ...tab,
          url,
          title: isInternal(url)
            ? "New Tab"
            : "Loading...",
          history,
          historyIndex: history.length - 1,
          loading: !isInternal(url),
        };
      })
    );

    setAddress(url === HOME_URL ? "" : url);

    if (!isInternal(url)) {
      addHistory(url);
    }
  }

  function submitAddress(event) {
    event.preventDefault();
    navigate(address);
  }

  function goBack() {
    setTabs((current) =>
      current.map((tab) => {
        if (tab.id !== activeTabId) return tab;

        if (tab.historyIndex <= 0) return tab;

        const nextIndex = tab.historyIndex - 1;
        const url = tab.history[nextIndex];

        setAddress(url === HOME_URL ? "" : url);

        return {
          ...tab,
          url,
          historyIndex: nextIndex,
          title: isInternal(url)
            ? "New Tab"
            : "Loading...",
          loading: !isInternal(url),
        };
      })
    );
  }

  function goForward() {
    setTabs((current) =>
      current.map((tab) => {
        if (tab.id !== activeTabId) return tab;

        if (tab.historyIndex >= tab.history.length - 1) {
          return tab;
        }

        const nextIndex = tab.historyIndex + 1;
        const url = tab.history[nextIndex];

        setAddress(url === HOME_URL ? "" : url);

        return {
          ...tab,
          url,
          historyIndex: nextIndex,
          title: isInternal(url)
            ? "New Tab"
            : "Loading...",
          loading: !isInternal(url),
        };
      })
    );
  }

  function reload() {
    if (!activeTab || isInternal(activeTab.url)) return;

    setTabs((current) =>
      current.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              loading: true,
            }
          : tab
      )
    );

    setTimeout(() => {
      setTabs((current) =>
        current.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                loading: false,
              }
            : tab
        )
      );
    }, 500);
  }

  function addHistory(url) {
    if (isInternal(url)) return;

    setHistory((current) => {
      const item = {
        id: Date.now(),
        url,
        title: getDisplayUrl(url),
        visitedAt: new Date().toISOString(),
      };

      return [
        item,
        ...current.filter((entry) => entry.url !== url),
      ].slice(0, 100);
    });
  }

  function toggleBookmark() {
    if (!activeTab || isInternal(activeTab.url)) return;

    if (isBookmarked) {
      setBookmarks((current) =>
        current.filter(
          (bookmark) => bookmark.url !== activeTab.url
        )
      );
      return;
    }

    setBookmarks((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        title:
          activeTab.title === "Loading..."
            ? getDisplayUrl(activeTab.url)
            : activeTab.title,
        url: activeTab.url,
      },
    ]);
  }

  function openBookmark(url) {
    navigate(url);
    setShowBookmarks(false);
  }

  function openHistory(item) {
    navigate(item.url);
    setShowHistory(false);
  }

  function setTabTitle(id, title) {
    setTabs((current) =>
      current.map((tab) =>
        tab.id === id
          ? {
              ...tab,
              title:
                title ||
                getDisplayUrl(tab.url) ||
                "New Tab",
              loading: false,
            }
          : tab
      )
    );
  }

  function renderNewTab() {
    return (
      <div className="newTabPage">
        <div className="newTabGlow glowA" />
        <div className="newTabGlow glowB" />

        <div className="newTabContent">
          <div className="fadesMark large">
            F
          </div>

          <h1>
            Welcome to <span>Fades.</span>
          </h1>

          <p className="newTabSubtitle">
            A browser built around you.
          </p>

          <form
            className="newTabSearch"
            onSubmit={submitAddress}
          >
            <Icon name="search" size={21} />
            <input
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              placeholder="Search or enter a URL"
              aria-label="Search or enter a URL"
            />

            <kbd>⌘ K</kbd>
          </form>

          <div className="quickLinks">
            {bookmarks.slice(0, 6).map((bookmark) => (
              <button
                className="quickLink"
                key={bookmark.id}
                onClick={() =>
                  openBookmark(bookmark.url)
                }
              >
                <span className="quickIcon">
                  <Favicon url={bookmark.url} size={18} />
                </span>
                <span>{bookmark.title}</span>
              </button>
            ))}

            <button
              className="quickLink"
              onClick={() =>
                addressRef.current?.focus()
              }
            >
              <span className="quickIcon">
                <Icon name="plus" size={17} />
              </span>
              <span>Add shortcut</span>
            </button>
          </div>

          <div className="newTabInfo">
            <div>
              <span className="newTabInfoNumber">
                {apiStatus === "online" ? "●" : "○"}
              </span>
              <span>
                {apiStatus === "online"
                  ? "Fades Cloud connected"
                  : "Local browser mode"}
              </span>
            </div>

            <div>
              <span className="newTabInfoNumber">
                {bookmarks.length}
              </span>
              <span>Bookmarks</span>
            </div>

            <div>
              <span className="newTabInfoNumber">
                {history.length}
              </span>
              <span>History</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderPage() {
    if (!activeTab || isInternal(activeTab.url)) {
      return renderNewTab();
    }

    return (
      <div className="webPage">
        <div className="webPageTopGlow" />

        <div className="loadingBar">
          {activeTab.loading && (
            <span />
          )}
        </div>

        <div className="webPageContent">
          <div className="webPageIcon">
            <Favicon url={activeTab.url} size={28} />
          </div>

          <h1>{getDisplayUrl(activeTab.url)}</h1>

          <p>
            Fades Browser is ready to navigate to this
            website.
          </p>

          <div className="externalNotice">
            <Icon name="external" size={17} />

            <div>
              <strong>Web navigation</strong>
              <span>
                In a production desktop build, this surface
                should be backed by the browser engine/webview.
              </span>
            </div>
          </div>

          <button
            className="openExternal"
            onClick={() => {
              window.open(
                activeTab.url,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Open website
            <Icon name="external" size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="browser">
      <header className="browserChrome">
        <div className="topChrome">
          <div className="windowControls">
            <button
              className="windowButton close"
              aria-label="Close"
            />
            <button
              className="windowButton minimize"
              aria-label="Minimize"
            />
            <button
              className="windowButton maximize"
              aria-label="Maximize"
            />
          </div>

          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${
                  tab.id === activeTabId ? "active" : ""
                }`}
                onClick={() =>
                  setActiveTabId(tab.id)
                }
              >
                <Favicon
                  url={tab.url}
                  size={14}
                />

                <span className="tabTitle">
                  {tab.title}
                </span>

                <span
                  className="tabClose"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  <Icon name="close" size={13} />
                </span>
              </button>
            ))}

            <button
              className="newTabButton"
              onClick={() => createTab()}
              aria-label="New tab"
            >
              <Icon name="plus" size={17} />
            </button>
          </div>

          <div className="chromeRight">
            <button
              className={`chromeIconButton ${
                showAccount ? "active" : ""
              }`}
              onClick={() =>
                setShowAccount((value) => !value)
              }
              aria-label="Account"
            >
              <Icon name="user" size={17} />
            </button>

            <button
              className="chromeIconButton"
              onClick={() =>
                setShowMenu((value) => !value)
              }
              aria-label="Menu"
            >
              <Icon name="menu" size={18} />
            </button>
          </div>
        </div>

        <div className="toolbar">
          <div className="navigationButtons">
            <button
              className="toolbarButton"
              disabled={
                !activeTab ||
                activeTab.historyIndex <= 0
              }
              onClick={goBack}
              aria-label="Back"
            >
              <Icon name="back" size={18} />
            </button>

            <button
              className="toolbarButton"
              disabled={
                !activeTab ||
                activeTab.historyIndex >=
                  activeTab.history.length - 1
              }
              onClick={goForward}
              aria-label="Forward"
            >
              <Icon name="forward" size={18} />
            </button>

            <button
              className="toolbarButton"
              onClick={reload}
              aria-label="Reload"
            >
              <Icon name="reload" size={17} />
            </button>
          </div>

          <form
            className="addressContainer"
            onSubmit={submitAddress}
          >
            <div className="addressSecurity">
              {activeTab?.url?.startsWith(
                "https://"
              ) ? (
                <Icon name="lock" size={14} />
              ) : (
                <Icon name="search" size={15} />
              )}
            </div>

            <input
              ref={addressRef}
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              onFocus={(event) =>
                event.currentTarget.select()
              }
              placeholder="Search or enter address"
              spellCheck={false}
              autoComplete="off"
            />

            <button
              type="button"
              className={`addressStar ${
                isBookmarked ? "bookmarked" : ""
              }`}
              onClick={toggleBookmark}
              aria-label="Bookmark"
            >
              <Icon name="star" size={16} />
            </button>
          </form>

          <div className="toolbarActions">
            <button
              className={`toolbarButton ${
                showBookmarks ? "active" : ""
              }`}
              onClick={() =>
                setShowBookmarks((value) => !value)
              }
              aria-label="Bookmarks"
            >
              <Icon name="bookmark" size={17} />
            </button>

            <button
              className={`toolbarButton ${
                showHistory ? "active" : ""
              }`}
              onClick={() =>
                setShowHistory((value) => !value)
              }
              aria-label="History"
            >
              <Icon name="history" size={17} />
            </button>

            <button
              className={`toolbarButton ${
                showDownloads ? "active" : ""
              }`}
              onClick={() =>
                setShowDownloads((value) => !value)
              }
              aria-label="Downloads"
            >
              <Icon name="download" size={17} />
            </button>

            <button
              className="toolbarButton"
              onClick={() =>
                setShowSettings((value) => !value)
              }
              aria-label="Settings"
            >
              <Icon name="settings" size={17} />
            </button>
          </div>
        </div>

        <div className="bookmarksBar">
          <button
            className="bookmarksBarItem"
            onClick={() => createTab()}
          >
            <span className="bookmarkFolderIcon">
              F
            </span>
            New Tab
          </button>

          {bookmarks.slice(0, 8).map((bookmark) => (
            <button
              className="bookmarksBarItem"
              key={bookmark.id}
              onClick={() =>
                openBookmark(bookmark.url)
              }
            >
              <Favicon
                url={bookmark.url}
                size={14}
              />
              <span>{bookmark.title}</span>
            </button>
          ))}

          <button
            className="bookmarksBarMore"
            onClick={() =>
              setShowBookmarks(true)
            }
          >
            More
          </button>
        </div>
      </header>

      <section className="browserViewport">
        {renderPage()}
      </section>

      {showBookmarks && (
        <div className="floatingPanel bookmarksPanel">
          <PanelHeader
            title="Bookmarks"
            icon="bookmark"
            onClose={() => setShowBookmarks(false)}
          />

          <div className="panelBody">
            {bookmarks.length === 0 ? (
              <EmptyPanel text="No bookmarks yet." />
            ) : (
              bookmarks.map((bookmark) => (
                <button
                  className="panelItem"
                  key={bookmark.id}
                  onClick={() =>
                    openBookmark(bookmark.url)
                  }
                >
                  <span className="panelItemIcon">
                    <Favicon
                      url={bookmark.url}
                      size={16}
                    />
                  </span>

                  <span className="panelItemText">
                    <strong>{bookmark.title}</strong>
                    <span>{bookmark.url}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {showHistory && (
        <div className="floatingPanel historyPanel">
          <PanelHeader
            title="History"
            icon="history"
            onClose={() => setShowHistory(false)}
          />

          <div className="panelBody">
            {history.length === 0 ? (
              <EmptyPanel text="Your browsing history will appear here." />
            ) : (
              history.slice(0, 30).map((item) => (
                <button
                  className="panelItem"
                  key={item.id}
                  onClick={() =>
                    openHistory(item)
                  }
                >
                  <span className="panelItemIcon">
                    <Favicon
                      url={item.url}
                      size={16}
                    />
                  </span>

                  <span className="panelItemText">
                    <strong>{item.title}</strong>
                    <span>{item.url}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {showDownloads && (
        <div className="floatingPanel downloadsPanel">
          <PanelHeader
            title="Downloads"
            icon="download"
            onClose={() => setShowDownloads(false)}
          />

          <div className="panelBody">
            {downloads.length === 0 ? (
              <EmptyPanel text="No downloads yet." />
            ) : (
              downloads.map((item, index) => (
                <div
                  className="panelItem"
                  key={item.id || index}
                >
                  <span className="downloadFileIcon">
                    ↓
                  </span>

                  <span className="panelItemText">
                    <strong>
                      {item.filename ||
                        item.name ||
                        "Download"}
                    </strong>
                    <span>
                      {item.url ||
                        item.status ||
                        "Completed"}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showAccount && (
        <div className="floatingPanel accountPanel">
          <PanelHeader
            title="Fades Account"
            icon="user"
            onClose={() => setShowAccount(false)}
          />

          <div className="accountPanelBody">
            <div className="accountAvatar">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt=""
                />
              ) : (
                (
                  account?.displayName?.[0] ||
                  account?.username?.[0] ||
                  "F"
                ).toUpperCase()
              )}
            </div>

            <strong>
              {account?.displayName ||
                account?.username ||
                "Fades Browser"}
            </strong>

            <span className="accountEmail">
              {account?.email ||
                "Not signed in"}
            </span>

            <div className="accountStatus">
              <span
                className={
                  apiStatus === "online"
                    ? "onlineDot"
                    : "offlineDot"
                }
              />
              {apiStatus === "online"
                ? "Fades Cloud connected"
                : "Local browser mode"}
            </div>

            <button
              className="accountManage"
              onClick={() => {
                window.location.href =
                  "https://fades.lol";
              }}
            >
              Manage Fades account
              <Icon name="external" size={14} />
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settingsOverlay">
          <div className="settingsWindow">
            <div className="settingsHeader">
              <div>
                <span className="settingsEyebrow">
                  FADES BROWSER
                </span>
                <h2>Settings</h2>
              </div>

              <button
                className="settingsClose"
                onClick={() =>
                  setShowSettings(false)
                }
              >
                <Icon name="close" size={19} />
              </button>
            </div>

            <div className="settingsLayout">
              <aside className="settingsSidebar">
                <button className="settingsNav active">
                  General
                </button>
                <button className="settingsNav">
                  Privacy
                </button>
                <button className="settingsNav">
                  Sync
                </button>
                <button className="settingsNav">
                  Appearance
                </button>
                <button className="settingsNav">
                  Downloads
                </button>
                <button className="settingsNav">
                  About Fades
                </button>
              </aside>

              <div className="settingsContent">
                <SettingsRow
                  title="Search engine"
                  description="The service used when you search from the address bar."
                >
                  <span className="settingValue">
                    {settings?.defaultSearchEngine ||
                      "Google"}
                  </span>
                </SettingsRow>

                <SettingsRow
                  title="Cloud synchronization"
                  description="Synchronize your browser data with Fades Cloud."
                >
                  <Toggle
                    enabled={
                      apiStatus === "online"
                    }
                  />
                </SettingsRow>

                <SettingsRow
                  title="Third-party cookies"
                  description="Control third-party cookie access."
                >
                  <Toggle
                    enabled={
                      settings?.privacy
                        ?.blockThirdPartyCookies ??
                      true
                    }
                  />
                </SettingsRow>

                <SettingsRow
                  title="Do Not Track"
                  description="Ask websites not to track your browsing."
                >
                  <Toggle
                    enabled={
                      settings?.privacy
                        ?.doNotTrack ?? true
                    }
                  />
                </SettingsRow>

                <SettingsRow
                  title="HTTPS-only mode"
                  description="Prefer secure HTTPS connections."
                >
                  <Toggle
                    enabled={
                      settings?.privacy
                        ?.httpsOnly ?? true
                    }
                  />
                </SettingsRow>

                <div className="aboutCard">
                  <div className="aboutLogo">
                    F
                  </div>

                  <div>
                    <strong>
                      Fades Browser
                    </strong>

                    <span>
                      Cloud API: {API_URL}
                    </span>

                    <span>
                      {apiStatus === "online"
                        ? "Connected"
                        : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMenu && (
        <div className="browserMenu">
          <button
            onClick={() => {
              createTab();
              setShowMenu(false);
            }}
          >
            <Icon name="plus" size={16} />
            New tab
            <kbd>Ctrl T</kbd>
          </button>

          <button
            onClick={() => {
              setShowHistory(true);
              setShowMenu(false);
            }}
          >
            <Icon name="history" size={16} />
            History
          </button>

          <button
            onClick={() => {
              setShowDownloads(true);
              setShowMenu(false);
            }}
          >
            <Icon name="download" size={16} />
            Downloads
          </button>

          <button
            onClick={() => {
              setShowBookmarks(true);
              setShowMenu(false);
            }}
          >
            <Icon name="bookmark" size={16} />
            Bookmarks
          </button>

          <div className="menuDivider" />

          <button
            onClick={() => {
              setShowSettings(true);
              setShowMenu(false);
            }}
          >
            <Icon name="settings" size={16} />
            Settings
          </button>

          <button
            onClick={() => {
              window.location.href =
                "https://fades.lol/download";
            }}
          >
            <Icon name="download" size={16} />
            Download Fades
          </button>
        </div>
      )}

      {sidebarOpen && (
        <div
          className="mobileSidebarBackdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </main>
  );
}

function PanelHeader({
  title,
  icon,
  onClose,
}) {
  return (
    <div className="panelHeader">
      <div>
        <Icon name={icon} size={17} />
        <strong>{title}</strong>
      </div>

      <button onClick={onClose}>
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

function EmptyPanel({ text }) {
  return (
    <div className="emptyPanel">
      <div className="emptyIcon">F</div>
      <span>{text}</span>
    </div>
  );
}

function SettingsRow({
  title,
  description,
  children,
}) {
  return (
    <div className="settingsRow">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      {children}
    </div>
  );
}

function Toggle({ enabled }) {
  return (
    <span
      className={`toggle ${
        enabled ? "enabled" : ""
      }`}
    >
      <span />
    </span>
  );
}
