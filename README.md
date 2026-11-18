# Teuto-Tour

Kleine PWA für den Wandertag im Teutoburger Wald (Sa, 21.11.2026): geheime Missionen + Wander-Tagebuch.
Vanilla HTML/CSS/JS, kein Build, kein Backend. Daten bleiben per localStorage auf dem jeweiligen Handy.

- **Konfiguration:** alles in `config.js` (Namen, Codes, Tag, Missions-Vorschläge, Zähler).
- **Persönliche Links:** `https://<user>.github.io/teuto-tour/?p=<code>`
- **Testmodus:** in `config.js` `TEST_MODE: true` setzen und `?test=1` anhängen → Zeit-Simulator. Veröffentlicht: `false`.
- **Updates nach dem Verteilen:** in `sw.js` `VERSION` hochzählen, damit Handys die neue Version laden.
- Karte: Leaflet (lokal in `vendor/`), Kacheln © OpenStreetMap-Mitwirkende © CARTO, werden für die Region offline vorgeladen.
