# GitHub Pages 404 Troubleshooting

If you see "404 - There isn't a GitHub Pages site here":

## 1. Check Pages settings

1. Go to **https://github.com/devjainshourya-alt/BMO-Careers**
2. Click **Settings** (tab)
3. Click **Pages** (left sidebar)
4. Under **Build and deployment**:
   - **Source**: must be **Deploy from a branch**
   - **Branch**: select **main**
   - **Folder**: select **/ (root)** — **not** /docs

5. Click **Save** and wait 1–2 minutes

## 2. Verify the URL

Use: **https://devjainshourya-alt.github.io/BMO-Careers/**

Include the trailing slash. Do not add `index.html`.

## 3. Check deployment status

On the **Pages** settings screen, you should see:
- "Your site is live at https://devjainshourya-alt.github.io/BMO-Careers/"
- Or "GitHub Pages is currently building your site"

If it says "Waiting for deployment", wait a few minutes and refresh.

## 4. Re-trigger deployment

1. Go to **Actions** tab
2. Find a "pages build and deployment" workflow
3. If it failed, open it and read the error
4. Or push a small change to trigger a new build:
   ```bash
   git commit --allow-empty -m "Trigger Pages rebuild"
   git push
   ```
