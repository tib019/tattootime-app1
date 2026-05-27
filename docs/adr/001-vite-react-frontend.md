# ADR-001: Vite + React als Frontend-Stack

**Status:** Accepted  
**Datum:** 2025

## Kontext
Tattootime-App1 ist eine verbesserte Version des Tattoo-Buchungssystems. Der Frontend-Stack soll moderner und schneller als CRA sein.

## Entscheidung
Vite als Build-Tool mit React und Tailwind CSS als Frontend-Stack.

## Abgewogene Alternativen
- **Create React App:** Älter, langsamer, kaum noch maintained
- **Next.js:** Für diese SPA unnötiges SSR-Overhead

## Konsequenzen
**Positiv:**
- Sehr schnelle HMR (Hot Module Replacement) in Entwicklung
- Kleines Build-Output
- Native ESM-Unterstützung

**Negativ:**
- Kein SSR out-of-the-box
