# eduardvandermerwe.com

Personal academic website of Eduard van der Merwe, built with Jekyll and hosted on GitHub Pages.

## Where things are

| File or folder | What it controls |
|---|---|
| `_config.yml` | Site name, tagline, URL, email and footer social links |
| `_data/navigation.yml` | Menu items and their order |
| `_layouts/default.html` | The page shell every page uses |
| `_includes/head.html` | Page titles, descriptions, link previews, fonts, icons |
| `_includes/header.html` | Name banner and menu |
| `_includes/footer.html` | Footer |
| `_includes/icon.html` | Draws an icon, e.g. `{% include icon.html name="database" %}` |
| `assets/images/icons.svg` | The icons themselves (add a `<symbol>` here to use a new one) |
| `assets/fonts/` | The Lora font files |
| `index.html`, `research.html`, `teaching.html`, `cv.html`, `data.html`, `fieldwork.html` | Page content |
| `_data/job_market.yml` | Job market box on the homepage: paper PDF and date, abstract, statements, references |
| `jmp.html` | Short link eduardvandermerwe.com/jmp, which opens the job market paper PDF |
| `assets/` | CSS, JavaScript, images and PDFs |

Each page starts with a short block between `---` lines that sets its title and description.

## Preview locally

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle config set --local path vendor/bundle   # first time only
bundle install                                 # first time only
bundle exec jekyll serve
```

Then open http://localhost:4000. Pushing to `main` publishes the site.
