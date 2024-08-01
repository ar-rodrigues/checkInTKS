"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { metadata as siteMetadata } from "./metadata";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    let deferredPrompt;
    const installButton = document.getElementById("installButton");
  
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Detect if the device is mobile and app is not installed
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
      const isAppInstalled = localStorage.getItem("appInstalled");

      if (isMobile && !isAppInstalled) {
        installButton.style.display = "block"; // Show button only on mobile if app not installed
      }
    };
  
    const handleAppInstalled = () => {
      installButton.style.display = "none";
      localStorage.setItem("appInstalled", "true"); // Mark app as installed
    };

    const handleInstallButtonClick = () => {
      if (navigator.userAgent.includes('Android')) {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the A2HS prompt");
            } else {
              console.log("User dismissed the A2HS prompt");
            }
            deferredPrompt = null;
          });
        }
      } else if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        alert('Para instalar esta aplicación, ábrela en Safari, toca el botón Compartir y selecciona «Agregar a inicio».');
      }
    };

    const isAppInstalled = localStorage.getItem("appInstalled");

    // Initialize the install button visibility based on installation status and device type
    if (installButton) {
      if (isAppInstalled || !/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)) {
        installButton.style.display = "none"; // Hide button if app is installed or not on mobile
      } else {
        installButton.style.display = "block";
      }

      installButton.addEventListener("click", handleInstallButtonClick);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (installButton) {
        installButton.removeEventListener("click", handleInstallButtonClick);
      }
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <title>{siteMetadata.title.default}</title>
        <meta name="description" content={siteMetadata.description} />
        {/* Add other meta tags from siteMetadata as needed */}
      </head>
      <body className={inter.className}>
        <button
          id="installButton"
          className="fixed hidden h-10 px-4 py-2 text-white bg-blue-500 rounded-md shadow-lg w-fit left-4 bottom-5"
        >
          Instalar
        </button>
        {children}
      </body>
    </html>
  );
}
