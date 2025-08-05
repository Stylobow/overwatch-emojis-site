let icons = [];
let activeCategory = "Tous";

async function loadIcons() {
  const response = await fetch('icons.json');
  icons = await response.json();

  generateCategories();
  renderIcons();
  setupSearch();
}

function generateCategories() {
  const container = document.getElementById('categories');
  container.innerHTML = "";

  const categories = [...new Set(icons.map(icon => icon.category))];
  categories.sort();

  const allBtn = document.createElement('button');
  allBtn.textContent = "All";
  allBtn.className = 'category-button enabled';
  allBtn.onclick = () => {
    activeCategory = "Tous";
    highlightActiveCategory();
    renderIcons();
  };
  container.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'category-button';
    btn.onclick = () => {
      activeCategory = cat;
      highlightActiveCategory();
      renderIcons();
    };
    container.appendChild(btn);
  });
}

function highlightActiveCategory() {
  document.querySelectorAll('.category-button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === activeCategory) {
      btn.classList.add('active');
    }
  });
}

function renderIcons() {
  const grid = document.getElementById('icon-grid');
  const filterText = document.getElementById('search').value.toLowerCase();
  grid.innerHTML = "";

  const filteredIcons = icons.filter(icon =>
    (activeCategory === "Tous" || icon.category === activeCategory) &&
    icon.name.toLowerCase().includes(filterText)
  );

  filteredIcons.forEach(icon => {
    const card = document.createElement('div');
    card.className = 'icon-card';
    card.innerHTML = `
      <img src="${icon.image}" alt="${icon.name}" />
      <p>${icon.name}</p>
    `;
    card.onclick = () => {
      copyToClipboard(icon.code)
    };
    grid.appendChild(card);
  });
}

function setupSearch() {
  document.getElementById('search').addEventListener('input', () => {
    renderIcons();
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Emoji copied to clipboard!");
  });
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

loadIcons();

