# The Sunless Street GM Runner

Static, desktop-first GM website generated from the content-locked manuscript at `lore/gm/campaigns/opening-adventure/the-sunless-street.md`.

From the repository root, run:

```powershell
py -3 -m http.server 8000 --directory web/the-sunless-street-gm
```

Then open <http://127.0.0.1:8000/>.

The directory is directly deployable as static output. No build step, database, framework, authentication service, or external runtime dependency is required.
