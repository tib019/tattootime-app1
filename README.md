# TattooTime App

[![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Eine moderne Webanwendung zur Verwaltung von Tattoo-Terminen mit Echtzeit-Datenbankanbindung, Kalenderintegration und einem vollständigen Admin-Dashboard für Tattoo-Studios.

---

## Projektübersicht

| Eigenschaft | Details |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 6, TailwindCSS 4 |
| **Backend** | Firebase (Firestore, Auth, Functions) |
| **UI-Komponenten** | Radix UI, shadcn/ui, Lucide Icons |
| **Kalender** | react-big-calendar |
| **Formulare** | react-hook-form |
| **Deployment** | Vercel / Firebase Hosting |

---

## Features

- **Terminbuchung** – Kunden können Termine online buchen und verwalten
- **Admin-Dashboard** – Vollständige Studio-Verwaltung für Betreiber
- **Echtzeit-Updates** – Firestore-basierte Live-Synchronisation
- **Kalenderansicht** – Übersichtliche Terminplanung mit Woche/Monat/Tag-Ansicht
- **Authentifizierung** – Sichere Firebase-Auth für Kunden und Admins
- **Responsive Design** – Optimiert für Desktop und Mobile
- **Dark/Light Mode** – Umschaltbares Theme via next-themes
- **PWA-Support** – Progressive Web App für mobile Nutzung

---

## Projektstruktur

```
tattootime-app1/
 src/
 components/ # Wiederverwendbare UI-Komponenten
 pages/ # Seitenkomponenten (Routing)
 hooks/ # Custom React Hooks
 lib/ # Utilities und Firebase-Konfiguration
 types/ # TypeScript-Typdefinitionen
 functions/ # Firebase Cloud Functions (Backend)
 public/ # Statische Assets
 firebase.json # Firebase-Konfiguration
 firestore.rules # Firestore-Sicherheitsregeln
 package.json
```

---

## ️ Installation & Setup

### Voraussetzungen

- Node.js >= 18
- pnpm >= 7
- Firebase CLI (`npm install -g firebase-tools`)

### Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/tib019/tattootime-app1.git
cd tattootime-app1

# Abhängigkeiten installieren
pnpm install

# Umgebungsvariablen konfigurieren
cp .env.example .env.local
# Firebase-Konfiguration in .env.local eintragen

# Entwicklungsserver starten
pnpm run dev
```

### Firebase-Konfiguration

```bash
# Firebase-Projekt initialisieren
firebase login
firebase use --add

# Firestore-Regeln deployen
firebase deploy --only firestore:rules

# Cloud Functions deployen
firebase deploy --only functions
```

---

## Verfügbare Scripts

| Script | Beschreibung |
|---|---|
| `pnpm run dev` | Frontend + Backend Entwicklungsserver |
| `pnpm run build` | Production Build |
| `pnpm run lint` | ESLint Code-Analyse |
| `pnpm run test` | Tests ausführen |

---

## Deployment

Das Projekt ist für Deployment auf **Vercel** (Frontend) und **Firebase** (Backend/DB) konfiguriert.

```bash
# Vercel Deployment
vercel deploy

# Firebase Deployment (Functions + Hosting)
firebase deploy
```

---

## ‍ Autor

**Tobias** – [@tib019](https://github.com/tib019)

---

## Lizenz

MIT License – siehe [LICENSE](LICENSE) für Details.
