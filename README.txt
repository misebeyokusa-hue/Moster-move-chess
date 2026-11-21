# Master Move Chess — corrected PWA package

This package is based on the uploaded GitHub Pages archive. It preserves the supplied `index.html`, manifest, and icons. The supplied HTML uses embedded CSS, so no separate stylesheet is required for this build.

## Upload/update on GitHub
1. Open the `master-move-chess` repository.
2. Choose Add file → Upload files.
3. Upload/replace these items in the repository root: `index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, and `icon-512-maskable.png`.
5. Commit the changes to `main`.
6. Keep GitHub Pages set to `main` and `/(root)`.

## Fix included
The previous service worker requested icons from `./icons/`, but the archive stores them in the repository root. This version corrects those paths and uses cache name v2 so browsers replace the old cache. The install process is also resilient if an optional local asset is missing.

## Current app scope
The supplied app includes a local two-player chessboard and page sections for Home, Play, AI, Learn, Events, Clubs, Connect, and Profile. The source does not implement real account storage, online multiplayer, server-backed club administration, payments, or a working chess AI. The chess rules library is imported from `https://esm.sh/chess.js@1.4.0`, so gameplay requires an internet connection to load that library. This package does not add those missing backend services.
