(() => {
  'use strict';

  const manuscript = document.querySelector('.manuscript');
  const sidebar = document.querySelector('.sidebar');
  const navLinks = [...document.querySelectorAll('.nav-list a[href^="#"]')];
  const navById = new Map(navLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link]));

  function closeSidebarOnMobile() {
    if (window.matchMedia('(max-width: 980px)').matches) sidebar.classList.remove('open');
  }

  document.querySelector('[data-action="toggle-nav"]').addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  navLinks.forEach((link) => link.addEventListener('click', closeSidebarOnMobile));

  const observedHeadings = [...manuscript.querySelectorAll('h1[id], h2[id]')]
    .filter((heading) => navById.has(heading.id));

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!visible.length) return;
    const active = visible[0].target.id;
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${active}`));
  }, { rootMargin: '-10% 0px -76% 0px', threshold: [0, 1] });

  observedHeadings.forEach((heading) => observer.observe(heading));

  // Persistent, fully manual Ragling Attention utility.
  const attention = document.querySelector('.attention');
  const attentionValue = document.querySelector('[data-attention-value]');
  const attentionName = document.querySelector('[data-attention-name]');
  const attentionStates = ['Unaware', 'Curious', 'Following', 'Alarmed'];
  const storageKey = 'sunless-street-ragling-attention';
  let currentAttention = 0;

  try {
    const saved = Number.parseInt(localStorage.getItem(storageKey), 10);
    if (Number.isInteger(saved)) currentAttention = Math.max(0, Math.min(3, saved));
  } catch (_) {
    currentAttention = 0;
  }

  function renderAttention() {
    attention.dataset.state = String(currentAttention);
    attentionValue.textContent = String(currentAttention);
    attentionName.textContent = attentionStates[currentAttention];
    try { localStorage.setItem(storageKey, String(currentAttention)); } catch (_) { /* file previews may block storage */ }
  }

  document.querySelector('[data-action="attention-down"]').addEventListener('click', () => {
    currentAttention = Math.max(0, currentAttention - 1);
    renderAttention();
  });

  document.querySelector('[data-action="attention-up"]').addEventListener('click', () => {
    currentAttention = Math.min(3, currentAttention + 1);
    renderAttention();
  });

  renderAttention();

  // Player display and GM image enlargement.
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = lightbox.querySelector('img');

  document.addEventListener('click', (event) => {
    const playerButton = event.target.closest('[data-player-token]');
    if (playerButton) {
      const token = playerButton.dataset.playerToken;
      window.open(`player.html#${encodeURIComponent(token)}`, '_blank', 'noopener');
      return;
    }

    const enlargeButton = event.target.closest('[data-enlarge-image]');
    if (enlargeButton) {
      lightboxImage.src = enlargeButton.dataset.enlargeImage;
      lightbox.hidden = false;
      document.body.classList.add('no-scroll');
    }
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    document.body.classList.remove('no-scroll');
  }

  lightbox.querySelector('[data-action="close-lightbox"]').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });

  // Quick-reference modal clones existing locked appendix content.
  const quickModal = document.querySelector('#quick-reference');
  const quickBody = quickModal.querySelector('.modal-body');
  const quickTitle = quickModal.querySelector('.modal-title');
  const quickTabs = [...quickModal.querySelectorAll('[data-quick-target]')];

  function cloneTopLevelSection(id) {
    const start = document.getElementById(id);
    if (!start) return null;
    const fragment = document.createDocumentFragment();
    let node = start;
    while (node) {
      if (node !== start && node.matches?.('h1')) break;
      const clone = node.cloneNode(true);
      if (clone.removeAttribute) clone.removeAttribute('id');
      clone.querySelectorAll?.('[id]').forEach((item) => item.removeAttribute('id'));
      clone.querySelectorAll?.('.collapse-toggle').forEach((item) => item.remove());
      fragment.appendChild(clone);
      node = node.nextElementSibling;
    }
    return fragment;
  }

  function showQuickReference(id, label) {
    const content = cloneTopLevelSection(id);
    if (!content) return;
    quickBody.replaceChildren(content);
    quickTitle.textContent = label;
    quickTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.quickTarget === id));
    quickModal.hidden = false;
    document.body.classList.add('no-scroll');
  }

  document.querySelectorAll('[data-open-quick]').forEach((button) => {
    button.addEventListener('click', () => showQuickReference(button.dataset.openQuick, button.textContent.trim()));
  });

  quickTabs.forEach((button) => {
    button.addEventListener('click', () => showQuickReference(button.dataset.quickTarget, button.textContent.trim()));
  });

  function closeQuickReference() {
    quickModal.hidden = true;
    document.body.classList.remove('no-scroll');
  }

  quickModal.querySelector('[data-action="close-quick"]').addEventListener('click', closeQuickReference);
  quickModal.addEventListener('click', (event) => { if (event.target === quickModal) closeQuickReference(); });

  // Selective manual collapsing. Content remains expanded by default.
  const collapsibleNames = new Set(['GM Truth', 'Mechanics', 'Conditional Reactions']);
  const collapsibleHeadings = [...manuscript.querySelectorAll('h1, h2, h3')]
    .filter((heading) => heading.textContent.startsWith('Appendix ') || collapsibleNames.has(heading.textContent.trim()));

  collapsibleHeadings.forEach((heading) => {
    const level = Number(heading.tagName.slice(1));
    const controlled = [];
    let sibling = heading.nextElementSibling;
    while (sibling) {
      const match = sibling.tagName?.match(/^H([1-6])$/);
      if (match && Number(match[1]) <= level) break;
      controlled.push(sibling);
      sibling = sibling.nextElementSibling;
    }
    if (!controlled.length) return;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'collapse-toggle';
    toggle.textContent = 'Collapse';
    toggle.setAttribute('aria-expanded', 'true');
    heading.appendChild(toggle);
    toggle.addEventListener('click', () => {
      const collapsed = heading.dataset.collapsed !== 'true';
      heading.dataset.collapsed = String(collapsed);
      controlled.forEach((item) => { item.hidden = collapsed; });
      toggle.textContent = collapsed ? 'Expand' : 'Collapse';
      toggle.setAttribute('aria-expanded', String(!collapsed));
    });
  });

  // Lightweight search navigates to the closest heading and leaves content untouched.
  const searchInput = document.querySelector('#gm-search');
  const searchResults = document.querySelector('#search-results');
  const searchable = [];
  let nearestHeading = null;

  [...manuscript.querySelectorAll('h1, h2, h3, p, li, td, blockquote')].forEach((element) => {
    if (element.matches('h1, h2, h3')) nearestHeading = element;
    const text = element.textContent.replace(/\s+/g, ' ').trim();
    if (text.length >= 3 && nearestHeading) searchable.push({ text, target: nearestHeading });
  });

  function clearSearch() {
    searchResults.replaceChildren();
    searchResults.hidden = true;
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    clearSearch();
    if (query.length < 2) return;
    const uniqueTargets = new Set();
    const results = [];
    for (const item of searchable) {
      if (!item.text.toLocaleLowerCase().includes(query) || uniqueTargets.has(item.target)) continue;
      uniqueTargets.add(item.target);
      results.push(item);
      if (results.length === 9) break;
    }
    results.forEach((result) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-result';
      const heading = document.createElement('strong');
      heading.textContent = result.target.childNodes[0]?.textContent?.trim() || result.target.textContent.trim();
      const snippet = document.createElement('span');
      snippet.textContent = result.text.length > 105 ? `${result.text.slice(0, 102)}…` : result.text;
      button.append(heading, snippet);
      button.addEventListener('click', () => {
        result.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        result.target.classList.remove('search-pulse');
        requestAnimationFrame(() => result.target.classList.add('search-pulse'));
        searchInput.value = '';
        clearSearch();
        closeSidebarOnMobile();
      });
      searchResults.appendChild(button);
    });
    searchResults.hidden = results.length === 0;
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-box')) clearSearch();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      clearSearch();
      closeLightbox();
      closeQuickReference();
      sidebar.classList.remove('open');
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
      event.preventDefault();
      sidebar.classList.add('open');
      searchInput.focus();
    }
  });
})();
