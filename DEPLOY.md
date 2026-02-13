# Deploy to Hosting — GitHub Pages

This project uses **GitHub Pages** for hosting. Pushing to the `main` branch triggers deployment. The AI runs `npm run deploy` as part of the FigJam feedback procedure.

---

## One-Time Setup

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com/new).
2. Create a new repository (e.g. `bmo-career-site`).
3. Do **not** initialize with README—the project already has files.

### 2. Initialize Git and Connect

In the project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bmo-career-site.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `bmo-career-site` with your GitHub username and repo name.

### 3. Enable GitHub Pages

1. In the repo: **Settings** → **Pages** (left sidebar).
2. Under **Source**, choose **Deploy from a branch**.
3. Branch: **main** (or **master**).
4. Folder: **/ (root)**.
5. Click **Save**.

The site will be at `https://YOUR_USERNAME.github.io/bmo-career-site/` (or your custom domain if configured).

---

## Deploying Changes

After implementing FigJam feedback, the AI runs:

```bash
npm run deploy
```

Or with a custom message:

```bash
npm run deploy -- "Fix hero section spacing per FigJam feedback"
```

This runs `scripts/deploy.js`, which:
1. Adds all changes
2. Commits with the given message (or default)
3. Pushes to `origin/main`

GitHub Pages automatically rebuilds and deploys within a few minutes.

---

## Alternative: Custom Domain

1. Add a `CNAME` file in the project root with your domain (e.g. `careers.yourdomain.com`).
2. In GitHub Pages settings, set the custom domain.
3. Configure DNS with your provider (add CNAME or A records as GitHub instructs).
