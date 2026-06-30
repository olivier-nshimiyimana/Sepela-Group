"use client";

import { useEffect } from "react";

export function DevOverlayHide(): null {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const style = document.createElement("style");
    style.setAttribute("data-dev-overlay-hide", "true");
    style.textContent = `
      nextjs-portal,
      [data-nextjs-toast],
      [data-nextjs-dialog-overlay] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  return null;
}
