const projects = window.KELLY_PROJECTS || [];
const orbitTrack = document.querySelector('#orbit-track');
const projectGrid = document.querySelector('#project-grid');

const selectedWorks = projects.filter((project) => project.category === 'selected');

orbitTrack.innerHTML = selectedWorks.slice(0, 8).map((project, index) => `
  <a class="orbit-item p${index + 1}" href="project.html?id=${project.id}" aria-label="View ${project.title}">
    <span class="orbit-card ${project.cardClass}">
      <img src="${project.image}" alt="${project.alt}" decoding="async" ${index < 3 ? 'fetchpriority="high"' : ''}>
    </span>
  </a>
`).join('');

const categoryCount = { selected: 0, sketchbook: 0 };
projectGrid.innerHTML = projects.map((project) => {
  categoryCount[project.category] += 1;
  const collection = project.category === 'selected' ? 'Selected Work' : 'Sketchbook';
  const number = String(categoryCount[project.category]).padStart(2, '0');
  return `
    <article class="project-card ${project.cardClass} ${project.category === 'sketchbook' ? 'sketch-card' : ''}" data-category="${project.category}">
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
      const visible = filter === 'all' || card.dataset.category === filter;
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
