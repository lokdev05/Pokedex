// Récupérez l'élément d'entrée de recherche
const searchInput = document.getElementById('search-input');

// Écoutez l'événement input sur la zone de recherche
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase(); // Convertir la recherche en minuscules

  // Filtrer les cartes Pokémon qui correspondent à la recherche
  const matchingCards = Array.from(document.querySelectorAll('.card')).filter(card => {
    const cardName = card.querySelector('h3').textContent.toLowerCase();
    return cardName.includes(searchTerm);
  });

  // Mettez à jour la liste des Pokémon dans la section principale du Pokédex
  updatePokedexWithSearchResults(matchingCards);
});

// Écoutez l'événement input sur la zone de recherche pour détecter la suppression de texte
searchInput.addEventListener('input', () => {
  if (searchInput.value === '') {
    // Si le champ de recherche est vide, rechargez la page pour réinitialiser les résultats
    window.location.reload();
  }
});

// Fonction pour mettre à jour la liste des Pokémon dans le Pokédex avec les résultats de la recherche
function updatePokedexWithSearchResults(results) {
  // Récupérez la section principale du Pokédex
  const pokedex = document.querySelector('.pokedex');

  // Effacez les Pokémon précédemment affichés
  pokedex.innerHTML = '';

  if (results.length === 0) {
    // Aucun résultat trouvé, affichez un message approprié
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'Aucun Pokémon trouvé.';
    pokedex.appendChild(noResultsMessage);
  } else {
    // Affichez les cartes correspondantes dans le Pokédex
    results.forEach(result => {
      pokedex.appendChild(result.cloneNode(true));
    });
  }
}
