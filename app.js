const projects = window.KELLY_PROJECTS || [];
const orbitTrack = document.querySelector('#orbit-track');
const projectGrid = document.querySelector('#project-grid');
const filterHeadingMain = document.querySelector('#work-heading-main');
const filterHeadingAccent = document.querySelector('#work-heading-accent');
const signatureSource = document.querySelector('#signature-source');
const signatureCanvas = document.querySelector('#signature-canvas');

const renderSignature = () => {
  if (!signatureSource || !signatureCanvas || !signatureSource.naturalWidth) return;
  const context = signatureCanvas.getContext('2d', { willReadFrequently: true });
  signatureCanvas.width = signatureSource.naturalWidth;
  signatureCanvas.height = signatureSource.naturalHeight;
  context.drawImage(signatureSource, 0, 0);

  const imageData = context.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height);
  const pixels = imageData.data;
  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const isSignaturePink = red > 210
      && green > 100
      && green < 235
      && blue > 110
      && blue < 245
      && red > green + 12
      && red > blue + 5
      && Math.abs(blue - green) < 70;
    if (!isSignaturePink) pixels[index + 3] = 0;
  }
  context.putImageData(imageData, 0, 0);
  signatureCanvas.closest('.signature-mark')?.classList.add('is-ready');
};

if (signatureSource?.complete) renderSignature();
else signatureSource?.addEventListener('load', renderSignature, { once: true });

const homepageCategories = [
  { filter: 'selected', label: 'Favourite work', ids: ['eyes-have-it', 'human-organ-auction', 'snow-dragon'] },
  { filter: 'editorial', label: 'Editorial', ids: ['human-organ-auction', 'drop-of-light', 'eyes-have-it'] },
  { filter: 'narrative', label: 'Narrative fantasy', ids: ['untitled-room', 'gate-of-fire', 'ancient-tree'] },
  { filter: 'character', label: 'Creature', ids: ['sugar-rush', 'snow-dragon', 'star-cloud'] },
  { filter: 'environment', label: 'Architecture', ids: ['city-lines', 'floating-temple', 'submerged-garden'] },
  { filter: 'sketchbook', label: 'Sketchbook', ids: ['sketchbook-05', 'sketchbook-09', 'sketchbook-03'] }
];

orbitTrack.innerHTML = homepageCategories.map((category, index) => {
  const stackProjects = category.ids
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean);
  return `
  <a class="orbit-item stack-item p${index + 1}" href="#work" data-filter-target="${category.filter}" aria-label="View ${category.label} projects">
    <span class="stack-cards">
      ${stackProjects.map((project, cardIndex) => `
        <span class="stack-card">
          <img src="${project.image}" alt="${project.alt}" decoding="async" ${index < 3 && cardIndex === 0 ? 'fetchpriority="high"' : ''}>
        </span>
      `).join('')}
    </span>
    <span class="stack-label"><b>${String(index + 1).padStart(2, '0')}</b>${category.label}</span>
  </a>
  `;
}).join('');

const categoryCount = { selected: 0, sketchbook: 0 };
const genreLabels = {
  editorial: 'Editorial',
  narrative: 'Narrative Fantasy',
  character: 'Creature',
  environment: 'Architecture',
  sketchbook: 'Sketchbook'
};
projectGrid.innerHTML = projects.map((project) => {
  categoryCount[project.category] += 1;
  const collection = genreLabels[project.genre] || 'Favourite Work';
  const number = String(categoryCount[project.category]).padStart(2, '0');
  return `
    <article class="project-card ${project.cardClass} ${project.category === 'sketchbook' ? 'sketch-card' : ''}" data-category="${project.category}" data-genre="${project.genre}">
      <a href="project.html?id=${project.id}">
        <figure><img src="${project.image}" alt="${project.alt}" loading="lazy" decoding="async"></figure>
        <div class="project-meta"><span>${project.title}</span><span>${collection} · ${number}</span></div>
      </a>
    </article>
  `;
}).join('');

const filterButtons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.project-card');
const headingLabels = {
  all: ['All', 'work.'],
  selected: ['Favourite', 'work.'],
  editorial: ['Editorial', 'work.'],
  narrative: ['Narrative', 'fantasy.'],
  character: ['Creature', 'work.'],
  environment: ['Architecture', 'work.'],
  sketchbook: ['Sketchbook', 'pages.']
};

const applyFilter = (filter) => {
  filterButtons.forEach((item) => item.classList.toggle('active', item.dataset.filter === filter));
  cards.forEach((card) => {
    const visible = filter === 'all' || card.dataset.category === filter || card.dataset.genre === filter;
    card.classList.toggle('hidden', !visible);
  });
  const [main, accent] = headingLabels[filter] || headingLabels.all;
  filterHeadingMain.textContent = main;
  filterHeadingAccent.textContent = accent;
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
});

document.querySelectorAll('[data-filter-target]').forEach((stack) => {
  stack.addEventListener('click', (event) => {
    event.preventDefault();
    applyFilter(stack.dataset.filterTarget);
    document.querySelector('#work').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [{ opacity: 0, transform: 'translateY(32px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 720, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }
        );
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .06 });

  document.querySelectorAll('.project-card, .about-grid, .contact h2').forEach((el) => revealObserver.observe(el));
}
