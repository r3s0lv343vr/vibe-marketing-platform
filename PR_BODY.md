## Summary
NextMove — vibe marketing platform for the Hult Cohort Summer Pilot 2026. Ships cohort profiles, partner intro flow, PM status snapshot, and an AI Brand Designer studio. Build repo: https://github.com/r3s0lv343vr/vibe-marketing-platform

## Production URL
https://nextmove-hult.vercel.app

## Sample profile URLs
- https://nextmove-hult.vercel.app/profiles/r3s0lv343vr
- https://nextmove-hult.vercel.app/profiles/maya-sugarveil
- https://nextmove-hult.vercel.app/profiles/jordan-crumbtrail

## Vibe / positioning notes
**One-liner:** NextMove plates cohort proof for hiring partners — Brand DNA, live profiles, and intros you can taste.

**Tone:** Warm, sensorial, lightly magical (rose sugar, champagne gold, mint frosting) without soft standards — partners skim for GitHub-visible evidence, not hype.

**Audience:** Hiring partners evaluating Summer Pilot builders; secondary public / Hult community.

**Differentiators:** Brand-first showcase, conversational Brand DNA studio, PM snapshot deep-linked to Forth, request-intro pathway aligned with the partner fee model.

## Partner-facing README
https://github.com/r3s0lv343vr/vibe-marketing-platform/blob/main/README.md

## Agent usage
- Research: Project 3 public-showcase curriculum, hiring-partner docs, prior @r3s0lv343vr submissions
- Dev: Next.js App Router platform (profiles, partners, studio, PM snapshot, partner README)
- QA: `npm run typecheck` / `npm run build`; production smoke on https://nextmove-hult.vercel.app

## Test plan
- [x] Production URL loads over HTTPS with no auth wall
- [x] Sample profile URLs open
- [x] `/partners` intro form succeeds
- [x] `/status` shows PM snapshot + Forth link
- [x] `/studio` generates Brand DNA from a prompt
- [x] Fresh clone: `npm install && npm run build`
