# Chatterie des Hauts de Toucas

## Ajouter des photos aux carrousels

Déposez vos photos directement dans le dossier correspondant :

- `nos-males/` — mâles
- `nos-femelles/` — femelles
- `mariages/` — mariages
- `nos-chatons/` — chatons

Formats pris en charge : JPG, JPEG, PNG, WebP, GIF et AVIF. Placez les photos directement dans le dossier (sans sous-dossier). Elles apparaissent dans l’ordre alphabétique de leur nom de fichier.

Après avoir ajouté ou supprimé des photos, générez la liste statique des galeries :

```sh
python3 build_galleries.py
```

Le script met à jour `galleries.json` sans dépendance à installer. Actualisez ensuite la page locale pour vérifier les carrousels. Incluez les photos et `galleries.json` dans votre commit ; chaque envoi sur la branche `main` publie automatiquement le site sur GitHub Pages.

Par exemple, pour publier une mise à jour des photos :

```sh
python3 build_galleries.py
git add galleries.json nos-males nos-femelles mariages nos-chatons
git commit -m "Update cat gallery photos"
git push
```

Les fichiers `demo-...` présents dans les dossiers sont des photos d’illustration provenant d’Unsplash. Elles servent uniquement à prévisualiser les carrousels et ne représentent pas les chats de la chatterie. Remplacez-les par vos photos avant publication. Images consultées sur [Unsplash](https://unsplash.com/) et distribuées selon la [licence Unsplash](https://unsplash.com/license).

## Lancer le site en local

À la racine du projet, lancez :

```sh
python3 server.py
```

Puis ouvrez [http://localhost:8000](http://localhost:8000). Gardez le terminal ouvert pendant la visite du site.

## Activer GitHub Pages

Dans les paramètres du dépôt GitHub, ouvrez **Settings → Pages** et choisissez **GitHub Actions** comme source de publication. Après avoir poussé la branche `main`, le workflow `.github/workflows/pages.yml` publie le site à l’adresse [https://raphaelmartin83.github.io/maine_coon_website/](https://raphaelmartin83.github.io/maine_coon_website/).

Pour publier cette configuration pour la première fois, incluez également le workflow et le script de génération dans votre commit :

```sh
git add .github/workflows/pages.yml build_galleries.py galleries.json README.md index.html script.js server.py styles.css nos-males nos-femelles mariages nos-chatons
git commit -m "Configure GitHub Pages deployment"
git push
```
