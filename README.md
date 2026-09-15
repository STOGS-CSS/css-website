# St. Olave's Computer Science Society

<!-- WHY ARE YOU TOUCHING THE README?? BE CAREFUL!! -->
<!-- WHY ARE YOU TOUCHING THE README?? BE CAREFUL!! -->
<!-- WHY ARE YOU TOUCHING THE README?? BE CAREFUL!! -->

A responsive, static website for the St. Olave's Grammar School Computer Science Society (CSS). It is designed to be uploaded directly to GitHub Pages or any static web host: there is no build process, framework, package manager, or server-side code.

The site uses semantic HTML5, vanilla CSS, and vanilla JavaScript. Content that changes regularly is held in small JSON files so that it can be updated without editing the page layout or JavaScript.

> [!TIP]
> Stuck or unsure? Read this `README.md`! It will explain almost everything you need to know.

## Pages

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Society introduction, highlights, joining information, and primary calls to action. |
| Schedule | `schedule.html` | Session timetable populated from `data/schedule.json`. |
| Hypertext | `hypertext.html` | The Hypertext publication, with the newest edition featured and older editions listed below. |
| Question of the Week | `qotw.html` | The newest QOTW plus an expandable archive, populated from `data/qotw.json`. |
| Hall of Fame | `hall-of-fame.html` | A permanent showcase page for notable people and achievements. |

The navigation, white header, and dark footer are shared visually across every page.

## Project structure

```text
.
├── Assets/
│   ├── Logo.svg                         # Wide school/society logo used on white backgrounds
│   └── Hypertext/                       # Hypertext PDF editions and optional cover images
├── data/
│   ├── schedule.json                    # Schedule entries
│   ├── qotw.json                        # Questions of the Week
│   └── hypertext.json                   # Hypertext editions
├── index.html
├── schedule.html
├── qotw.html
├── hypertext.html
├── hall-of-fame.html
├── style.css                            # Shared responsive styling and palette
├── script.js                            # Navigation, Schedule, and QOTW rendering
└── hypertext.js                         # Hypertext edition rendering
```

## Running locally

The Schedule, QOTW, and Hypertext pages load JSON with `fetch()`. Browsers usually block that when an HTML file is opened directly with `file://`, so preview the site through a local web server.

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser. Stop the server with `Ctrl+C` when finished.

Navigation uses extensionless URLs such as `schedule` and `qotw`; the production provider resolves these to the corresponding HTML files. Python's basic server does not provide that mapping, so preview individual pages at paths such as `/schedule.html`, or use a preview server that supports clean URLs.

## Publishing on GitHub Pages

1. Create a GitHub repository and upload every file and folder in this project, preserving the existing capitalisation in paths such as `Assets/Hypertext/`.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, then select the branch containing the site (usually `main`) and the `/ (root)` folder.
4. Save. GitHub will provide the public site address after the deployment completes.

> [!IMPORTANT]
> No build command is needed. GitHub Pages serves the HTML, CSS, JavaScript, JSON, SVG, images, and PDFs as static files. This Repository should already be linked to the domain. You should not need to publish via a new GitHub Page.

## Updating regular content

The files in `data/` are the content configurators. They must remain valid JSON:

- Keep property names in double quotes.
- Separate items and properties with commas, except after the final item.
- Use `""` for an intentionally blank optional text field.
- Keep paths relative to the website root, for example `Assets/Hypertext/edition-6-cover.jpg`.
- Do not rename the top-level `listings`, `questions`, or `editions` arrays.

After editing a JSON file, refresh the relevant page through the local server to check it before publishing.

### Schedule — `data/schedule.json`

The `listings` array is displayed in the same order as it appears in the file. Each listing supports these fields:

| Field | Required | Use |
| --- | --- | --- |
| `Date` | Yes | Numeric day shown prominently, such as `"15"`. |
| `Month` | Yes | Short month label, such as `"SEP"`. |
| `Day` | Yes | Day name, such as `"Monday"`. |
| `Time` | Yes | Start time, such as `"13:00"`. |
| `Title` | Yes | Name of the event. |
| `Host` | No | Presenter or team. Leave blank to hide it. |
| `Description` | Yes | Short event description. |
| `Link` | No | Optional destination for the arrow at the right of the row. Leave blank to keep that space empty. |

Example:

```json
{
  "Date": "06",
  "Month": "OCT",
  "Day": "Monday",
  "Time": "13:00",
  "Title": "Algorithm workshop",
  "Host": "CSS Committee",
  "Description": "Work through a new problem together.",
  "Link": "https://example.com/sign-up"
}
```

If `Link` begins with `http://` or `https://`, it opens in a new tab. A relative destination such as `qotw` stays within the site.

### Question of the Week — `data/qotw.json`

The `questions` array is sorted automatically by `QOTW`. The largest number becomes the main QOTW card; every lower number appears when visitors select **View past questions**. Add a new question with the next number to make it current.

| Field | Required | Use |
| --- | --- | --- |
| `QOTW` | Yes | Unique question number, for example `9`. |
| `Title_Regular` | Yes | Main title text. |
| `Title_special` | No | Italic second part of the title. It is not shown when blank. |
| `Question` | Yes | The question prompt. |
| `Hint` | No | Hint text. It is not shown when blank. |
| `Submission Instructions` | No | Instructions for submitting or sharing an answer. It is not shown when blank. |
| `Link` | No | Optional submission or resource destination. No button is shown when blank. |
| `link_text` | No | Label for the link button. Used only when `Link` has a value; defaults to `Link` when blank. |

Example:

```json
{
  "QOTW": 9,
  "Title_Regular": "Trace the",
  "Title_special": "recursion.",
  "Question": "What does this recursive function return for an input of 5? Show each call.",
  "Hint": "Write down the calls from outermost to innermost.",
  "Submission Instructions": "Submit your working through the form below.",
  "Link": "https://example.com/qotw-9",
  "link_text": "Submit answer"
}
```

There are no multiple-choice, correct-answer, or automatic-marking fields: answers and marking are handled externally.

### Hypertext — `data/hypertext.json`

The `editions` array is sorted automatically by `Edition` in descending order. The highest edition number is the large featured edition; all earlier editions are displayed in the archive list.

| Field | Required | Use |
| --- | --- | --- |
| `Edition` | Yes | Unique edition number, for example `6`. |
| `Title` | Yes | Display title, such as `"Edition 6"`. |
| `Published` | No | Small publication line below the title. It is hidden when blank. |
| `Description` | No | Introductory description. It is hidden when blank. |
| `Contents` | No | List of article or feature names. Use `[]` when there are none. |
| `PDF` | No | Relative path or URL to the edition PDF. The **Read PDF** button is hidden when blank. |
| `Image` | No | Relative path or URL to a cover image for the featured edition. When blank, the purple Hypertext cover is used instead. |

Example:

```json
{
  "Edition": 6,
  "Title": "Edition 6",
  "Published": "Autumn 2026",
  "Description": "A new collection of ideas worth following.",
  "Contents": [
    "How a compiler thinks",
    "The hidden life of databases",
    "A student project diary"
  ],
  "PDF": "Assets/Hypertext/HYPERTEXT Issue 6.pdf",
  "Image": "Assets/Hypertext/edition-6-cover.jpg"
}
```

Put PDFs and cover images inside `Assets/Hypertext/` before referencing them. The `Image` is intentionally only used for the large, most recent edition panel; older editions remain a compact text archive.

## Design and accessibility notes

- The shared palette is based on St. Olave's colours: purple, white, gold, charcoal, and black, with selective brighter accents for creative sections.
- `Inter Tight` is the main typeface and `JetBrains Mono` is used for labels, metadata, and technical accents. They are loaded from Google Fonts.
- Layouts adapt for smaller screens, including a collapsible mobile navigation.
- The logo is placed on the white navigation background for legibility.
- Data-driven controls only appear when their corresponding optional JSON values are present—for example, a schedule arrow only appears when that event has a `Link`.

## Icons and placeholder media

No third-party icon package is used. Interface symbols such as arrows and menu controls are browser text characters or simple elements styled in CSS; the location pin on the home page is an inline SVG. Decorative graphics are CSS-built placeholder artwork. The supplied wide logo is stored at `Assets/Logo.svg`, and Hypertext PDFs and optional cover images belong in `Assets/Hypertext/`.

## Routine maintenance checklist

Before publishing an update:

1. Check that edited JSON has matching braces, brackets, commas, and double quotes.
2. Confirm every new image and PDF file has been uploaded and that its filename matches the JSON path exactly, including capital letters.
3. Start a local server and open the affected page.
4. Test new links on desktop and mobile widths.
5. Commit and push the content changes to GitHub; GitHub Pages will redeploy the static site.
