const projects = window.KELLY_PROJECTS || [];
const orbitTrack = document.querySelector('#orbit-track');
const projectGrid = document.querySelector('#project-grid');

const homepageIds = [
  'human-organ-auction',
  'untitled-room',
  'eyes-have-it',
  'sugar-rush',
  'city-lines',
  'drop-of-light',
  'star-cloud',
  'submerged-garden',
  'snow-dragon'
];
const homepageWorks = homepageIds
  .map((id) => projects.find((project) => project.id === id))
  .filter(Boolean);

orbitTrack.innerHTML = homepageWorks.map((project, index) => `
  <a class="orbit-item ${project.cardClass} p${index + 1}" href="project.html?id=${project.id}" aria-label="View ${project.title}">
    <span class="orbit-card ${project.cardClass}">
      <img src="${project.image}" alt="${project.alt}" decoding="async" ${index < 3 ? 'fetchpriority="high"' : ''}>
    </span>
  </a>
`).join('');

const categoryCount = { selected: 0, sketchbook: 0 };
const genreLabels = {
  editorial: 'Editorial & Surreal',
  narrative: 'Narrative Fantasy',
  character: 'Character & Creature',
  environment: 'Environment & Architecture',
  sketchbook: 'Sketchbook'
};
projectGrid.innerHTML = projects.map((project) => {
  categoryCount[project.category] += 1;
  const collection = genreLabels[project.genre] || 'Selected Work';
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

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    cards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.category === filter || card.dataset.genre === filter;
      card.classList.toggle('hidden', !visible);
    });
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
