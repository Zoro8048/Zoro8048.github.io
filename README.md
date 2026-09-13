# Keerthan Nandigama — Portfolio

A single-page personal portfolio built with React, TypeScript, Tailwind CSS, and Lucide icons.

## Run locally

```bash
yarn install
yarn start
```

The development server runs at [http://localhost:3000](http://localhost:3000).

## Validate and build

```bash
yarn test
yarn build
```

`yarn build` produces the deployable static site in `out/`.

Netlify uses `netlify.toml` to build with Node 20 and publish `out/`.

## Update portfolio content

The site sections are individual components under `src/components/`. Update the content arrays in `Experience.tsx`, `Education.tsx`, `Achievements.tsx`, and `Skills.tsx` to change portfolio data.

Organization logos are remote images with a local fallback at `public/images/placeholder-logo.svg`. For reliable branding, replace remote URLs with assets you have permission to host in `public/images/`.

## Integrations

- The contact form is embedded from Tally in `src/components/Contact.tsx`.
- Google Analytics uses the single measurement ID configured in `src/app/layout.tsx`. Replace or remove it before deploying to another site.
