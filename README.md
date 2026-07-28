# Parentia — Frontend

Interface web de **Parentia**, la plateforme communautaire au service du bien-être des enfants.
Elle réunit **parents**, **éducatrices**, **psychologues** et **administrateurs** autour de publications,
ressources, discussions et **évènements**.

Construit avec **Vue 3** (`<script setup>`), **Vue Router** et **Vite**.

---

## 🚀 Prérequis

- **Node.js 20+** et npm
- Le **backend Parentia** démarré sur `http://localhost:8082` (voir `../backend`)

## ⚙️ Installation & lancement

```bash
npm install
npm run dev        # serveur de développement (http://localhost:5173)
npm run build      # build de production -> dist/
npm run preview    # prévisualiser le build
```

L'URL de l'API est définie dans `src/services/evenementService.js` :

```js
export const API_BASE_URL = 'http://localhost:8082/api'
```

---

## 🧭 Rôles & navigation

| Rôle | Accueil | Espace |
|------|---------|--------|
| Public | `/` | Accueil, Événements, À propos |
| Parent | `/homeparent` | Actu, Mes pub, Ressources, **Événements**, Discussions, Profil |
| Éducatrice | `/hometeacher` | Actu, Publications, Ressources, **Événements**, Discussions, Profil |
| Psychologue | `/homepsy` | Actu, Publications, Ressources, **Événements**, Discussions, Profil |
| **Admin** | `/admin` | Tableau de bord, Utilisateurs, Événements |

> Après connexion, la redirection vers l'espace du rôle est automatique
> (`PARENT → /homeparent`, `EDUCATEUR → /hometeacher`, `PSY → /homepsy`, `ADMIN → /admin`).

### Compte administrateur par défaut

Créé automatiquement par le backend au premier démarrage :

```
Email        : admin@parentia.mg
Mot de passe : admin123
```

---

## ✨ Fonctionnalités

- **Événements (tous les rôles)** — agenda partagé, filtres par type
  (atelier / conférence / rencontre / webinaire), **inscription / désinscription** en temps réel
  avec places restantes. Les rôles connectés peuvent **créer / modifier / supprimer** des évènements.
- **Espace administrateur** — tableau de bord (statistiques par rôle, totaux),
  **gestion des utilisateurs** (recherche, changement de rôle, suppression) et **modération des évènements**.
- **Ressources** — fiches, PDF et **vidéos lues directement** dans la page
  (lecteur intégré + liens YouTube/Vimeo), likes, notes et commentaires.
- **Communauté** — publications, likes, commentaires, discussions et messagerie.
- **Profils** — édition des informations (téléphone, adresse, lieu de travail, spécialité).
- **Interface** — icônes **SVG** (aucune emoji), design cohérent et responsive.

---

## 📁 Structure

```
src/
├── components/        Header*, Footer*, EventsBoard, ProfileCard …
├── pages/             Home, Login, Evenements*, Ressources*, Profil*, HomeAdmin, UsersAdmin …
├── router/            Définition des routes (par rôle + admin)
├── services/          evenementService.js, adminService.js (appels API)
└── App.vue            Layout dynamique (header/footer selon le rôle)
```

## 🔗 Composant clé : `EventsBoard.vue`

Composant réutilisable utilisé par toutes les pages d'évènements.

| Prop | Type | Description |
|------|------|-------------|
| `title` | String | Titre de la page |
| `subtitle` | String | Sous-titre |
| `canManage` | Boolean | Affiche la création / édition / suppression |
| `showAll` | Boolean | (Admin) inclut les évènements non publiés |
