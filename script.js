const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.desktop-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav?.classList.toggle('open', !isOpen);
});

document.querySelectorAll('.desktop-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
  });
});

async function getJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path} (${response.status})`);
  return response.json();
}

function setDataError(container) {
  container.replaceChildren();
  const message = document.createElement('p');
  message.className = 'data-status data-error';
  message.textContent = 'This content could not be loaded. If you opened the HTML file directly, preview the site through a local web server.';
  container.append(message);
}

function configureLink(link, destination) {
  link.href = destination;
  if (/^https?:\/\//i.test(destination)) {
    link.target = '_blank';
    link.rel = 'noopener';
  }
}

function setupMarquee() {
  const marquee = document.querySelector('.marquee');
  const primaryGroup = document.querySelector('.marquee-group');
  const duplicateGroup = document.querySelector('.marquee-group[aria-hidden="true"]');
  const seed = primaryGroup?.querySelector('.marquee-item');
  if (!marquee || !primaryGroup || !duplicateGroup || !seed) return;

  const makeItem = () => seed.cloneNode(true);
  const fillTrack = () => {
    primaryGroup.replaceChildren(makeItem());
    const minimumWidth = marquee.clientWidth + primaryGroup.scrollWidth;
    while (primaryGroup.scrollWidth < minimumWidth) primaryGroup.append(makeItem());
    duplicateGroup.replaceChildren(...[...primaryGroup.children].map(item => item.cloneNode(true)));
  };

  let frame;
  const queueFill = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fillTrack);
  };

  queueFill();
  if ('ResizeObserver' in window) new ResizeObserver(queueFill).observe(marquee);
  else window.addEventListener('resize', queueFill, { passive: true });
  document.fonts?.ready.then(queueFill);
}

async function renderSchedule() {
  const list = document.querySelector('#schedule-list');
  if (!list) return;
  try {
    const data = await getJson('data/schedule.json');
    list.replaceChildren();
    data.listings.forEach(item => {
      const article = document.createElement('article');
      const time = document.createElement('time');
      const date = document.createElement('b');
      const month = document.createElement('span');
      const details = document.createElement('div');
      const meta = document.createElement('p');
      const title = document.createElement('h2');
      const description = document.createElement('p');

      date.textContent = item.Date;
      month.textContent = item.Month;
      meta.className = 'event-label';
      meta.textContent = `${item.Day} / ${item.Time}${item.Host ? ` · ${item.Host}` : ''}`;
      title.textContent = item.Title;
      description.textContent = item.Description;
      time.append(date, month);
      details.append(meta, title);
      article.append(time, details, description);

      if (item.Link?.trim()) {
        const link = document.createElement('a');
        link.className = 'row-link';
        link.textContent = '→';
        link.setAttribute('aria-label', `Open link for ${item.Title}`);
        configureLink(link, item.Link.trim());
        article.append(link);
      } else {
        const empty = document.createElement('span');
        empty.className = 'row-link-space';
        empty.setAttribute('aria-hidden', 'true');
        article.append(empty);
      }
      list.append(article);
    });
  } catch {
    setDataError(list);
  }
}

async function renderQuestion() {
  const card = document.querySelector('#qotw-card');
  if (!card) return;
  try {
    const data = await getJson('data/qotw.json');
    const questions = [...data.questions].sort((a, b) => Number(b.QOTW) - Number(a.QOTW));
    const question = questions[0];
    if (!question) throw new Error('No questions found');
    card.replaceChildren();

    const label = document.createElement('p');
    const number = document.createElement('span');
    label.className = 'section-index';
    label.textContent = 'QUESTION OF THE WEEK ';
    number.textContent = `/ ${String(question.QOTW).padStart(3, '0')}`;
    label.append(number);

    const title = document.createElement('h1');
    title.append(document.createTextNode(question.Title_Regular || 'Question'));
    if (question.Title_special?.trim()) {
      title.append(document.createElement('br'));
      const special = document.createElement('em');
      special.textContent = question.Title_special.trim();
      title.append(special);
    }

    const prompt = document.createElement('p');
    prompt.className = 'qotw-prompt';
    prompt.textContent = question.Question;
    card.append(label, title, prompt);

    if (question.Hint?.trim()) {
      const hint = document.createElement('p');
      hint.className = 'hint';
      hint.textContent = `Hint: ${question.Hint.trim()}`;
      card.append(hint);
    }
    if (question['Submission Instructions']?.trim()) {
      const instructions = document.createElement('p');
      instructions.className = 'submission-instructions';
      instructions.textContent = question['Submission Instructions'].trim();
      card.append(instructions);
    }
    if (question.Link?.trim()) {
      const submit = document.createElement('a');
      submit.className = 'button button-dark submission-link';
      submit.append(document.createTextNode(question.link_text?.trim() || 'Link'));
      const arrow = document.createElement('span');
      arrow.textContent = '→';
      submit.append(arrow);
      configureLink(submit, question.Link.trim());
      card.append(submit);
    }
    renderPastQuestions(questions.slice(1));
  } catch {
    setDataError(card);
    const toggle = document.querySelector('#past-questions-toggle');
    if (toggle) toggle.hidden = true;
  }
}

function renderPastQuestions(questions) {
  const list = document.querySelector('#past-questions');
  const toggle = document.querySelector('#past-questions-toggle');
  if (!list || !toggle) return;
  list.replaceChildren();
  toggle.hidden = questions.length === 0;

  questions.forEach(question => {
    const article = document.createElement('article');
    article.className = 'past-question';

    const number = document.createElement('p');
    number.className = 'section-index';
    number.textContent = `QUESTION OF THE WEEK / ${String(question.QOTW).padStart(3, '0')}`;

    const title = document.createElement('h2');
    title.append(document.createTextNode(question.Title_Regular || 'Question'));
    if (question.Title_special?.trim()) {
      title.append(document.createTextNode(' '));
      const special = document.createElement('em');
      special.textContent = question.Title_special.trim();
      title.append(special);
    }

    const prompt = document.createElement('p');
    prompt.className = 'past-question-prompt';
    prompt.textContent = question.Question;
    article.append(number, title, prompt);

    if (question.Hint?.trim()) {
      const hint = document.createElement('p');
      hint.className = 'hint';
      hint.textContent = `Hint: ${question.Hint.trim()}`;
      article.append(hint);
    }
    if (question['Submission Instructions']?.trim()) {
      const instructions = document.createElement('p');
      instructions.className = 'submission-instructions';
      instructions.textContent = question['Submission Instructions'].trim();
      article.append(instructions);
    }
    if (question.Link?.trim()) {
      const link = document.createElement('a');
      link.className = 'archive-link';
      link.textContent = `${question.link_text?.trim() || 'Link'} →`;
      configureLink(link, question.Link.trim());
      article.append(link);
    }
    list.append(article);
  });
}

document.querySelector('#past-questions-toggle')?.addEventListener('click', event => {
  const list = document.querySelector('#past-questions');
  if (!list) return;
  const willOpen = list.hidden;
  list.hidden = !willOpen;
  event.currentTarget.setAttribute('aria-expanded', String(willOpen));
  event.currentTarget.querySelector('span').textContent = willOpen ? 'Hide past questions' : 'View past questions';
  event.currentTarget.querySelector('b').textContent = willOpen ? '↑' : '↓';
});

renderSchedule();
renderQuestion();
setupMarquee();

document.querySelector('.teams-button')?.addEventListener('click', async event => {
  const button = event.currentTarget;
  const code = 'vqfd07z';
  const toast = document.querySelector('.toast');
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    const temporaryInput = document.createElement('textarea');
    temporaryInput.value = code;
    temporaryInput.setAttribute('readonly', '');
    temporaryInput.style.position = 'fixed';
    temporaryInput.style.opacity = '0';
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand('copy');
    temporaryInput.remove();
  }
  button.querySelector('b').textContent = 'Copied!';
  toast?.classList.add('show');
  window.setTimeout(() => {
    button.querySelector('b').textContent = code;
    toast?.classList.remove('show');
  }, 2200);
});
