# Portfolio de Djamel Harrous

Site d'une page, statique, pour Djamel Harrous, Senior Data & AI Engineer freelance.
Astro, TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText) et Lenis.

## Démarrer

Node 22.23 ou plus récent (Node 23.6+ pour les scripts de `scripts/`).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # site statique dans dist/
npm run preview    # sert dist/ en local
npm run check      # vérification des types
```

## Modifier le contenu

Tout le contenu est dans **`src/content/site.ts`** : textes, chiffres, missions, logos, offres.
Aucun composant n'est à toucher pour changer un texte ou un chiffre.

- **Chiffres** : tous provisoires, repérés par `// TODO: chiffre provisoire`.
- **Logos clients** : un fichier par client dans `public/logos/clients/`, SVG de préférence
  (PNG et JPEG acceptés : un fond blanc se fond dans la page). Les fichiers au nom en capitales
  sont des placeholders à remplacer par les logos officiels, en gardant le même nom de fichier ;
  la hauteur, les niveaux de gris et l'opacité sont normalisés par le site.
- **Activer ou retirer un logo** : `enabled: true | false` sur chaque client et chaque outil.
  Un logo désactivé disparaît partout (bandeau, études de cas, parcours, stack).
- **Logos d'outils** : champ `icon`, un slug [simple-icons](https://simpleicons.org). Sans icône
  disponible, le nom s'affiche en wordmark texte.
- **Portrait** : `public/portrait.jpg`, format 4:5 (960 × 1200 px conseillé, moins de 150 Ko).
  Il est affiché en noir et blanc.
- **Image de partage** : `npm run og` régénère `public/og.png` à partir du titre de une.

## Mise en ligne

Vercel ou Cloudflare Pages, sans adaptateur :

| Réglage | Valeur |
| --- | --- |
| Commande de build | `npm run build` |
| Dossier de sortie | `dist` |
| Variable d'environnement | `SITE_URL=https://votre-domaine.fr` |

`SITE_URL` alimente l'URL canonique, les balises Open Graph, le JSON-LD, le sitemap et
`robots.txt`. Sans elle, le site se construit avec `https://example.com`.

## Organisation

```
src/content/site.ts      contenu du site
src/styles/global.css    tokens du design system, composants, intro de la une
src/layouts/Base.astro   <head>, SEO, JSON-LD, polices
src/components/          une section par composant ; viz/ = schémas des études de cas
src/scripts/motion.ts    animations au scroll, smooth scroll, curseur
src/lib/                 résolution des logos, formatage, géométrie des schémas
scripts/                 placeholders, image OG, captures de vérification
```

## Animations

- Seules `transform` et `opacity` sont animées.
- Le HTML livré est l'état final : sans JavaScript ou avec `prefers-reduced-motion`, tout le
  contenu est visible et rien ne bouge.
- L'intro de la une est en CSS, pour que le texte s'affiche dès le premier rendu.
- Les autres animations sont créées quand leur section approche de l'écran.
- La scène épinglée du Parcours n'existe qu'au-delà de 1024 px de large ; en dessous, une simple
  apparition.
- Chaque étude de cas a son schéma animé, décrit en SVG dans `src/components/viz/` avec des
  attributs `data-a` (type d'animation) et `data-t` (instant). Le vocabulaire est documenté dans
  `src/lib/viz.ts`.

## Vérifier

```bash
npm run build && npm run preview
npm run shots                 # captures 1440 et 390 px dans shots/
npm run shots -- --reduce     # page entière avec prefers-reduced-motion
npx lighthouse http://localhost:4321/ --view
```

Les captures utilisent Edge installé sur le poste (`--channel chrome` pour Chrome).

## Avant la mise en ligne

- [ ] Remplacer les chiffres provisoires dans `site.ts`.
- [ ] Vérifier les autorisations clients, puis déposer les SVG officiels.
- [ ] Déposer le portrait.
- [ ] Renseigner l'URL LinkedIn (`identity.linkedin`).
- [ ] Définir `SITE_URL` avec le domaine définitif, puis relancer `npm run og` si le titre a changé.
- [ ] Confirmer les libellés du schéma Data Mesh (`meshDomains`).
