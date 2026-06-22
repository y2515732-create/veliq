import { useEffect, useState } from "react";

type Platform = "android" | "ios" | "none";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isInStandaloneMode =
    "standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true;

  if (isIOS && !isInStandaloneMode) return "ios";

  // Android/Chrome install prompt is handled via beforeinstallprompt event
  return "none";
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "vilo-install-dismissed";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<Platform>("none");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const detected = detectPlatform();
    setPlatform(detected);
    if (detected === "ios") setVisible(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function installAndroid() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
    dismiss();
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-start justify-between gap-4 border-t border-primary/30 bg-card/95 backdrop-blur-md px-5 py-4 shadow-2xl"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/icons/icon-192.png"
          alt="Vilo AI"
          className="w-10 h-10 rounded-xl flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="font-bold text-sm uppercase tracking-wide text-foreground leading-tight">
            Install Vilo AI
          </p>
          {platform === "ios" ? (
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              Tap the Share button, then{" "}
              <span className="text-primary font-semibold">Add to Home Screen</span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">
              Add to your home screen for instant access
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {platform !== "ios" && deferredPrompt && (
          <button
            onClick={installAndroid}
            className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Install
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground text-lg leading-none px-2 py-1 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
