// Définissez un objet qui mappe les types de Pokémon aux couleurs
const powerColors = {
    poison:     '#AB549A',
    grass:      '#78CD54',
    fire:       '#FF421C',
    flying:     '#669AFF',
    water:      '#2F9AFF',
    bug:        '#ABBC1C',
    normal:     '#BCBCAC',
    electric:   '#FFCD30',
    ground:     '#DEBC54',
    fairy:      '#FFACFF',
    fighting:   '#BC5442',
    psychic:    '#FF549A',
    rock:       '#BCAC66',
    steel:      '#ABACBC',
    ice:        '#ABACBC',
    ghost:      '#6666BC',
  };
  
  // Créez une fonction pour obtenir la couleur en fonction du type de Pokémon
  function getColor(power) {
    return powerColors[power] || 'gray'; // Par défaut, utilisez la couleur grise
  }
  
  // Exportez la fonction getTypeColor pour l'utiliser dans d'autres fichiers
  export { getColor };
  