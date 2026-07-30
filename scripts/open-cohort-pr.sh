#!/usr/bin/env bash
# Open the Hult Cohort Project 3 submission PR (run as @r3s0lv343vr).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SUBMISSION="$ROOT/submissions/r3s0lv343vr-project-3.md"
WORKDIR="${TMPDIR:-/tmp}/hult-cohort-program-p3"
PROD_URL="${PROD_URL:-https://pixie-dust-cheesecake.vercel.app}"

if [[ ! -f "$SUBMISSION" ]]; then
  echo "Missing $SUBMISSION" >&2
  exit 1
fi

rm -rf "$WORKDIR"
git clone --depth 1 https://github.com/r3s0lv343vr/hult-cohort-program.git "$WORKDIR"
cd "$WORKDIR"
git fetch https://github.com/rogerSuperBuilderAlpha/hult-cohort-program.git \
  projects/summer26/phase-1-project-3:projects/summer26/phase-1-project-3
git checkout -B participants/summer26/phase-1-project-3/r3s0lv343vr \
  projects/summer26/phase-1-project-3
mkdir -p submissions
cp "$SUBMISSION" submissions/r3s0lv343vr-project-3.md
# Refresh production URLs in the copied submission if overridden
if [[ "$PROD_URL" != "https://pixie-dust-cheesecake.vercel.app" ]]; then
  sed -i.bak "s|https://pixie-dust-cheesecake.vercel.app|${PROD_URL}|g" \
    submissions/r3s0lv343vr-project-3.md
  rm -f submissions/r3s0lv343vr-project-3.md.bak
fi

git add submissions/r3s0lv343vr-project-3.md
git commit -m "Add Project 3 submission for r3s0lv343vr"
git push -u origin participants/summer26/phase-1-project-3/r3s0lv343vr

gh pr create \
  --repo rogerSuperBuilderAlpha/hult-cohort-program \
  --base projects/summer26/phase-1-project-3 \
  --head "r3s0lv343vr:participants/summer26/phase-1-project-3/r3s0lv343vr" \
  --title "[Project 3] Submission — r3s0lv343vr" \
  --body "$(cat <<EOF
## Summary
Pixie Dust Cheesecake — vibe marketing platform for the Hult Cohort Summer Pilot 2026. Ships cohort profiles, partner intro flow, PM status snapshot, and an AI Brand Designer studio. Build repo: https://github.com/r3s0lv343vr/vibe-marketing-platform

## Production URL
${PROD_URL}

## Sample profile URLs
- ${PROD_URL}/profiles/r3s0lv343vr
- ${PROD_URL}/profiles/maya-sugarveil
- ${PROD_URL}/profiles/jordan-crumbtrail

## Vibe / positioning notes
**One-liner:** Pixie Dust Cheesecake plates cohort proof for hiring partners — Brand DNA, live profiles, and intros you can taste.

**Tone:** Warm, sensorial, lightly magical (rose sugar, champagne gold, mint frosting) without soft standards — partners skim for GitHub-visible evidence, not hype.

**Audience:** Hiring partners evaluating Summer Pilot builders; secondary public / Hult community.

**Differentiators:** Brand-first showcase, conversational Brand DNA studio, PM snapshot deep-linked to Forth, request-intro pathway aligned with the partner fee model.

## Partner-facing README
https://github.com/r3s0lv343vr/vibe-marketing-platform/blob/main/README.md

## Agent usage
- Research: Project 3 public-showcase curriculum, hiring-partner docs, prior @r3s0lv343vr submissions
- Dev: Next.js App Router platform (profiles, partners, studio, PM snapshot, partner README)
- QA: \`npm run typecheck\` / \`npm run build\`; smoke home, profiles, studio, partners, request-intro API

## Test plan
- [ ] Production URL loads over HTTPS with no auth wall
- [ ] Sample profile URLs open
- [ ] \`/partners\` intro form succeeds
- [ ] \`/status\` shows PM snapshot + Forth link
- [ ] \`/studio\` generates Brand DNA from a prompt
- [ ] Fresh clone: \`npm install && npm run build\`
EOF
)"
