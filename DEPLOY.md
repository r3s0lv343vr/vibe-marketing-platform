# Deploy — Pixie Dust Cheesecake

## Vercel (preferred)

1. Authenticate CLI: `npx vercel login`
2. From repo root: `npx vercel --prod --yes --name pixie-dust-cheesecake`
3. Set env (optional): `NEXT_PUBLIC_SITE_URL`, `PLACEMENT_LEAD_EMAIL`, `INTRO_WEBHOOK_URL`
4. Production alias target: **https://pixie-dust-cheesecake.vercel.app**

Or import https://github.com/r3s0lv343vr/vibe-marketing-platform in the Vercel dashboard and set the project name to `pixie-dust-cheesecake`.

## GitHub Pages (fallback)

1. Repo **Settings → Pages**
2. Source: Deploy from branch **`gh-pages`** / `/` (root)
3. Site: https://r3s0lv343vr.github.io/vibe-marketing-platform/

The `gh-pages` branch is already published from a static export. Partner intro uses mailto fallback when `/api/request-intro` is unavailable.

## Cohort submission PR

As `@r3s0lv343vr`:

```bash
PROD_URL=https://pixie-dust-cheesecake.vercel.app ./scripts/open-cohort-pr.sh
```
