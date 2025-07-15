const searchInput = document.querySelector('.search-bar input');
const allRecipeCards = document.querySelectorAll('#all-recipes .recipe-card');
const gridContainer = document.querySelector('#all-recipes .grid-container');

const pageLang = document.documentElement.lang;
const noResults = document.createElement('p');
noResults.textContent = pageLang === 'tr' ? 'Hiçbir tarif bulunamadı.' : 'No recipes found.';
noResults.style.textAlign = 'center';
noResults.style.fontStyle = 'italic';
noResults.style.marginTop = '2rem';
noResults.style.color = '#6c5c45';

let hasScrolledToAllRecipes = false;
searchInput.addEventListener('focus', () => {
  if (!hasScrolledToAllRecipes) {
    const allRecipesSection = document.querySelector('#all-recipes');
    const rect = allRecipesSection.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (!isVisible) {
      allRecipesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    hasScrolledToAllRecipes = true;
  }
});

function highlightMatch(text, query) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1 || query === "") return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return `${before}<mark>${match}</mark>${after}`;
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const scrollPos = window.scrollY;

  requestAnimationFrame(() => {
    let hasMatch = false;

    allRecipeCards.forEach(card => {
      const titleEl = card.querySelector('h3');
      const titleText = titleEl.textContent;
      const matchFound = titleText.toLowerCase().includes(query);

      if (matchFound) {
        card.classList.remove('hidden');
        titleEl.innerHTML = highlightMatch(titleText, query);
        hasMatch = true;
      } else {
        card.classList.add('hidden');
        titleEl.innerHTML = titleText;
      }
    });

    if (!hasMatch) {
      if (!gridContainer.contains(noResults)) {
        gridContainer.appendChild(noResults);
      }
    } else {
      if (gridContainer.contains(noResults)) {
        gridContainer.removeChild(noResults);
      }
    }

    window.scrollTo({ top: scrollPos });
  });
});
