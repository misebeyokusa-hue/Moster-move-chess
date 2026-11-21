# Master Move Chess — first PWA web release

Upload all six app files in this folder to the ROOT of your GitHub repository:
- index.html
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png
- icon-512-maskable.png

Then enable GitHub Pages:
1. Repository → Settings → Pages.
2. Under Build and deployment, choose Deploy from a branch.
3. Branch: main. Folder: / (root). Save.
4. Wait for the published URL to appear.

Open the HTTPS URL in Chrome on Android. Use the three-dot menu and choose Install app or Add to Home screen if offered.

Limitations: this is the existing version 0.2 local prototype packaged as a PWA. The chess rules library loads from an external CDN and needs internet. No accounts, online multiplayer, Stockfish AI, cloud game storage, tournaments backend, payments, or CHCA PLAY integration are included.
