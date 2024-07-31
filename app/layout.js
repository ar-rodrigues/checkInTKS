"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { useEffect } from "react"
import { metadata as siteMetadata, viewport as siteViewport } from "./metadata"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  useEffect(() => {
    let deferredPrompt;
    const installButton = document.getElementById("installButton");
  
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installButton.style.display = "block"; // Show the install button
    };
  
    const handleAppInstalled = () => {
      installButton.style.display = "none"; // Hide the install button
    };
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
      });
    }
    if ('beforeinstallprompt' in window) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    } else if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      if (window.navigator.standalone) {
        // If the app is already installed on the home screen, hide the button
        installButton.style.display = "none";
      } else {
        // Show instructions for iOS users
        installButton.style.display = "block";
        installButton.innerText = "Instalar";
        installButton.onclick = () => {
          alert('Para instalar esta aplicación, ábrela en Safari, toca el botón Compartir y selecciona «Agregar a inicio».');
        };
      }
    }
  
    window.addEventListener("appinstalled", handleAppInstalled);
  
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
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
          className="fixed flex items-center hidden h-10 px-4 py-2 text-white bg-blue-500 rounded-md shadow-lg w-fit left-4 bottom-5"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          Instalar
        </button>
        {children}
      </body>
    </html>
  );
}
