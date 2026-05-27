# ADR-002: Dual-Deployment (Firebase Hosting + Railway)

**Status:** Accepted  
**Datum:** 2025

## Kontext
Die App muss sowohl das statische Frontend als auch Backend-Dienste (Cloud Functions) hosten. Verschiedene Deployment-Pfade werden evaluiert.

## Entscheidung
Firebase Hosting für das Frontend-SPA, Railway für Backend-Services (Node.js Backend-Functions).

## Abgewogene Alternativen
- **Nur Firebase:** Vollständig integriert, aber Cloud Functions haben Cold-Start-Probleme
- **Vercel:** Guter Vercel-Vercel-Support, aber zusätzliche Kosten
- **Render.com:** Ähnlich wie Railway, beides evaluated

## Konsequenzen
**Positiv:**
- Firebase Hosting für statische Assets sehr schnell (CDN)
- Railway für persistente Backend-Prozesse ohne Cold-Starts

**Negativ:**
- Zwei Deployment-Pipelines erhöhen Konfigurationsaufwand
- CORS-Konfiguration zwischen Firebase-Frontend und Railway-Backend
