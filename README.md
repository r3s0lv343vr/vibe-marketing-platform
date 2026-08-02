# NextMove

Vibe marketing platform for the **Hult Cohort Developer Program · Summer Pilot 2026**.

NextMove presents the cohort — and each participant’s shipped work — with energy that attracts hiring partners. It is also an AI Brand Designer studio: from a single conversation it drafts Brand DNA, assets, campaign starters, and a live preview you can refine in plain English.

**Production:** [https://nextmove-hult.vercel.app](https://nextmove-hult.vercel.app)

**Build repo:** [r3s0lv343vr/vibe-marketing-platform](https://github.com/r3s0lv343vr/vibe-marketing-platform)

**GitHub:** [@r3s0lv343vr](https://github.com/r3s0lv343vr)

---

## Project overview

Hiring partners should not have to trust a résumé. They should open a profile, click into production apps, and let GitHub tell the story. NextMove is that outward-facing surface:

- Public cohort homepage with narrative and brand presence
- Per-student profiles (GitHub, campus, skills, portfolio links)
- Partner page with fee-model summary and **Request intro** form
- Read-only **PM status** snapshot linked to Forth / participant PM
- **Studio** — conversational Brand DNA, Vibe Meter, mood board, marketing feed

Privacy: profiles are **opt-in by default**; opt-out pages render as private.

---

## Features

| Area | What shipped |
|------|----------------|
| Landing | Full-bleed hero, brand-first composition, ≥200-word cohort narrative |
| Cohort directory | Public + private placeholder roster |
| Profiles | `/profiles/[slug]` with portfolio evidence (PM / comms / showcase) |
| Partners | How to hire, fee summary, intro form → placement lead intake API |
| PM integration | Static snapshot JSON + deep links to live PM apps |
| Studio | Prompt → Brand DNA, vibes, mood board, campaign feed, HTML preview |
| SEO | Titles, meta description, Open Graph, sitemap, robots |
| Deploy | Vercel HTTPS, no auth on public pages |

**Studio pathways (demo):** Email, Facebook, and Instagram goals are selectable via natural-language prompts; lifecycle/campaign copy lands in the marketing feed for handoff.

---

## Installation

```bash
git clone https://github.com/r3s0lv343vr/vibe-marketing-platform.git
cd vibe-marketing-platform
npm install
cp .env.example .env.local   # optional for local defaults
npm run dev                  # http://localhost:3000
```

Node 20+ recommended.

---

## Usage

1. Open `/` for the partner-facing landing experience.
2. Browse `/cohort` and open sample profiles (e.g. `/profiles/r3s0lv343vr`).
3. Try `/studio` with prompts like “Launching a coffee shop” or “Instagram campaign for handmade products”.
4. Review `/status` for the PM snapshot.
5. Submit a partner intro on `/partners#request-intro`.

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run import:roster -- data/handles.txt --write` | Bulk-import classmates from GitHub handles into the Partners directory |

### Bulk-import classmates from GitHub

1. Copy `data/handles.example.txt` → `data/handles.txt`
2. Add one handle per line (or `github,Name,Campus`)
3. Run:

```bash
GITHUB_TOKEN=ghp_xxx npm run import:roster -- data/handles.txt --write
```

This fetches **name, avatar, public repos, homepage URLs, and PRs** authored in
`rogerSuperBuilderAlpha/hult-cohort-program` (override with `COHORT_REPO=owner/repo`),
then writes `src/data/profiles.generated.json`. The site merges that file with
`src/data/profiles.ts`. Live homepages appear in the **Partners** project slider.

---

## Architecture overview

```text
Browser (no auth on public pages)
   │
   ├─ App Router pages: / /cohort /profiles/[slug] /partners /studio /status
   ├─ Client StudioApp → deterministic Brand DNA / vibe / campaign generator
   └─ POST /api/request-intro → log + optional INTRO_WEBHOOK_URL
            │
            └─ PM snapshot: src/data/pm-snapshot.ts (refreshed manually / daily)
                 deep links → Forth + participant PM deploys
```

Data for the roster lives in `src/data/profiles.ts` so placeholders can be swapped as enrollment fills without a database dependency for MVP.

---

## Technology stack

- **Frontend:** Next.js (App Router) · React 19 · TypeScript
- **Styling:** Tailwind CSS 4 · custom CSS variables (Fraunces + Figtree)
- **Hosting:** Vercel
- **Integrations:** PM snapshot JSON · optional intro webhook / placement email env

---

## Roadmap

- [ ] Live PM API sync when ecosystem unification exposes a shared read endpoint
- [ ] Real email delivery for intro requests (Resend/Postmark)
- [ ] Partner login for gated contact details
- [ ] GitHub activity feed per profile
- [ ] Week-8 showcase RSVP
- [ ] Multi-agent orchestration wired to image/video generation providers

---

## Contributing

This submission is part of the Hult Cohort Summer Pilot. Improvements welcome via PR on the build repo:

1. Fork / branch from `main`
2. Keep partner-facing copy accurate — no invented metrics
3. Run `npm run lint`, `npm run typecheck`, and `npm run build`
4. Describe smoke checks in the PR

Cohort submission PRs target `rogerSuperBuilderAlpha/hult-cohort-program` base `projects/summer26/phase-1-project-3`.

---

## Sample profile URLs

Once deployed:

- https://nextmove-hult.vercel.app/profiles/r3s0lv343vr
- https://nextmove-hult.vercel.app/profiles/maya-sugarveil
- https://nextmove-hult.vercel.app/profiles/jordan-crumbtrail

(Additional placeholders: `aisha-glaze`; opt-out demo: `private-opt-out`.)
