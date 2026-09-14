async function loadHypertextEditions() {
  const latest = document.querySelector('#latest-edition');
  const past = document.querySelector('#past-editions-list');
  if (!latest || !past) return;

  try {
    const response = await fetch('data/hypertext.json');
    if (!response.ok) throw new Error('Unable to load editions');
    const data = await response.json();
    const editions = [...data.editions].sort((a, b) => Number(b.Edition) - Number(a.Edition));
    if (!editions.length) throw new Error('No editions found');

    latest.replaceChildren(createLatestEdition(editions[0]));
    past.replaceChildren(...editions.slice(1).map(createPastEdition));
  } catch {
    const message = document.createElement('p');
    message.className = 'data-status data-error';
    message.textContent = 'The edition archive could not be loaded. If you opened this file directly, preview the site through a local web server.';
    latest.replaceChildren(message);
    past.replaceChildren();
  }
}

function createPdfLink(edition, className) {
  if (!edition.PDF?.trim()) return null;
  const link = document.createElement('a');
  link.className = className;
  link.href = edition.PDF.trim();
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Read PDF ↗';
  return link;
}

function createLatestEdition(edition) {
  const fragment = document.createDocumentFragment();
  const cover = document.createElement('div');
  cover.className = 'edition-cover';
  if (edition.Image?.trim()) {
    cover.classList.add('has-image');
    const image = document.createElement('img');
    image.className = 'edition-cover-image';
    image.src = edition.Image.trim();
    image.alt = `Cover image for ${edition.Title || `Edition ${edition.Edition}`}`;
    cover.append(image);
  } else {
    const wordmark = document.createElement('span');
    wordmark.append('HYPER', document.createElement('br'), 'TEXT');
    const number = document.createElement('strong');
    number.textContent = String(edition.Edition).padStart(2, '0');
    cover.append(wordmark, number);
  }

  const details = document.createElement('div');
  details.className = 'latest-details';
  const label = document.createElement('p');
  label.className = 'section-index';
  label.textContent = `EDITION / ${String(edition.Edition).padStart(2, '0')}`;
  const title = document.createElement('h1');
  title.textContent = edition.Title || `Edition ${edition.Edition}`;
  details.append(label, title);

  if (edition.Published?.trim()) {
    const published = document.createElement('p');
    published.className = 'edition-published';
    published.textContent = edition.Published.trim();
    details.append(published);
  }
  if (edition.Description?.trim()) {
    const description = document.createElement('p');
    description.className = 'edition-description';
    description.textContent = edition.Description.trim();
    details.append(description);
  }
  if (Array.isArray(edition.Contents) && edition.Contents.length) {
    const contents = document.createElement('ul');
    contents.className = 'edition-contents';
    edition.Contents.forEach(item => {
      const entry = document.createElement('li');
      entry.textContent = item;
      contents.append(entry);
    });
    details.append(contents);
  }
  const link = createPdfLink(edition, 'button button-dark edition-link');
  if (link) details.append(link);
  fragment.append(cover, details);
  return fragment;
}

function createPastEdition(edition) {
  const article = document.createElement('article');
  article.className = 'past-edition';
  const number = document.createElement('span');
  number.textContent = String(edition.Edition).padStart(2, '0');
  const title = document.createElement('h2');
  title.textContent = edition.Title || `Edition ${edition.Edition}`;
  const published = document.createElement('p');
  published.textContent = edition.Published?.trim() || 'HYPERTEXT archive';
  article.append(number, title, published);
  const link = createPdfLink(edition, 'archive-link');
  if (link) article.append(link);
  return article;
}

loadHypertextEditions();
