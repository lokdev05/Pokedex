const pokeInfoContainer = document.querySelector('.pokeinfo_container');
const pokedex = document.querySelector('.pokedex');
const elementResponsive = document.querySelector('.pokeinfo_container');
const responsiveBtn = document.querySelector('.responsive_btn');
const backgroundColor = document.querySelector('.responsive')

responsiveBtn.addEventListener('click', () => {
    if (window.innerWidth <= 1100) {
    elementResponsive.style.display = 'none';
    elementResponsive.classList.add('slide-out');    
    elementResponsive.classList.remove('slide-in');
    responsiveBtn.style.display = 'none';     
    backgroundColor.style.background = "none";
  }
});

let apiUrl = 'https://pokeapi.co/api/v2/pokemon';
let pokemonCount = 0;

// Importer les couleurs
import { getColor } from './colors.js';

// ----------------------------------------------- Afficher Tous Les Pokemon --------------------------------------------------------

// Nombre de Pokémon à afficher
const NBR_POKEMON = 120;

// Fonction pour afficher les informations de chaque Pokémon
async function displayPokemonInfo(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    const data = await response.json();

    const pokemonName   = data.name;
    const pokemonImage  = data.sprites.front_default;
    const pokemonNbr    = data.order;
    const pokemonTypes  = data.types.map(typeInfo => typeInfo.type.name);

    const card = createPokemonCard(pokemonName, pokemonImage, pokemonNbr, pokemonTypes, url);

    pokedex.appendChild(card);
  } catch (erreur) {
    console.error('Erreur lors de la récupération des informations Pokémon :', erreur);
  }
}

// Création de la carte Pokémon
function createPokemonCard(nom, image, numero, types, pokemonUrl) {
  const card = document.createElement('div');
  card.classList.add('card');

  card.dataset.types = types;
  card.dataset.pokemonUrl = pokemonUrl;

  const typePokemon = types.map(power => {
    const backgroundColor = getColor(power);
    return `<div class='power' style="background-color: ${backgroundColor};">${power}</div>`;
  }).join('');

  card.innerHTML = `
    <img src="${image}" alt="${nom}">
    <span>N° ${numero}</span>
    <h3>${nom}</h3>
    <div class="power_container">${typePokemon}</div>
    <a href="${pokemonUrl}" style="display: none;"></a> 
  `;
  return card;
}


// ------------------------------------- Afficher les détails de chaque carte Pokémon -----------------------------------------------

pokedex.addEventListener('click', async (event) => {
  const card = event.target.closest('.card');
  if (!card) return;

  // Récupérer l'URL de l'API
  const pokemonUrl = card.dataset.pokemonUrl;

  await updatePokeInfo(pokemonUrl);
});

// Récupérer les informations supplémentaires d'un Pokémon
async function additionalPokemonInfo(pokemonUrl) {
  try {
    const response = await fetch(pokemonUrl);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    const data = await response.json();

    // Extraire les informations supplémentaires du Pokémon
    const pokemonGif = data.sprites.versions["generation-v"]["black-white"].animated.front_default;
    const pokemonNbr = data.order;
    const pokemonName = data.name;
    const pokemonImg = data.sprites.front_default;
    const pokemonTypes = data.types.map(typeInfo => typeInfo.type.name);
    const pokemonheight = data.height;
    const pokemonweight = data.weight;
    const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name);

    // Extraire les Stats
    const pokemonStats = data.stats;

    const { base_stat: hp } = pokemonStats[0];
    const { base_stat: attack } = pokemonStats[1];
    const { base_stat: defense } = pokemonStats[2];
    const { base_stat: specialAttack } = pokemonStats[3];
    const { base_stat: specialDefense } = pokemonStats[4];
    const { base_stat: speed } = pokemonStats[5];
    const totalStats = hp + attack + defense + specialAttack + specialDefense + speed;

    // Obtenir le niveau d'évolution (Merci ChatGPT)
    const evolutionDetails = data.species.url;
    const pokemonEvo = await getEvolutionLevel(evolutionDetails);

    

    // Obtenir la description du Pokémon (Merci ChatGPT)
    const englishDescription = data.species.url;
    const pokemonDesc = await getPokemonDescription(englishDescription);

    return {
      pokemonGif,
      pokemonNbr,
      pokemonName,
      pokemonTypes,
      pokemonDesc,
      pokemonheight,
      pokemonweight,
      abilities,
      hp,
      attack,
      defense,
      specialAttack,
      specialDefense,
      speed,
      totalStats,
      pokemonEvo,
      pokemonImg,
    };
  } catch (erreur) {
    console.error('Erreur lors de la récupération des informations supplémentaires Pokémon :', erreur);
    return {};
  }
}

// Fonction asynchrone pour récupérer la description du Pokémon (Merci ChatGPT)
async function getPokemonDescription(englishDescriptionUrl) {
  try {
    const response = await fetch(englishDescriptionUrl);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    const data = await response.json();

    // Recherchez la description en anglais (langue "en")
    const englishDescription = data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;

    // Vous pouvez également rechercher d'autres langues si nécessaire

    return englishDescription;
  } catch (erreur) {
    console.error('Erreur lors de la récupération de la description du Pokémon :', erreur);
    return 'N/A';
  }
}

// Fonction asynchrone pour récupérer le niveau d'évolution (Merci ChatGPT)
async function getEvolutionLevel(evolutionDetailsUrl) {
  try {
    const response = await fetch(evolutionDetailsUrl);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    const data = await response.json();


    const evolutionChain = await fetch(data.evolution_chain.url);
    const evolutionChainData = await evolutionChain.json();
    const evolutionDetails = evolutionChainData.chain.evolves_to[0].evolution_details[0]; 
    const evolutionLevel = evolutionDetails;

    return evolutionLevel;
  } catch (erreur) {
    console.error('Erreur lors de la récupération du niveau d\'évolution Pokémon :', erreur);
    return 'N/A';
  }
}


// Mettre à jour les informations affichées dans la zone d'informations Pokémon
async function updatePokeInfo(pokemonUrl) {
  try {
    const additionalInfo = await additionalPokemonInfo(pokemonUrl);

    const {
      pokemonGif,
      pokemonNbr,
      pokemonName,
      pokemonTypes,
      pokemonDesc,
      pokemonheight,
      pokemonweight,
      abilities,
      hp,
      attack,
      defense,
      specialAttack,
      specialDefense,
      speed,
      totalStats,
      pokemonEvo,
      pokemonImg,
    } = additionalInfo;

    if (window.innerWidth <= 1100) {
      elementResponsive.style.display = 'block';
      responsiveBtn.style.display = 'block';
    }


    document.querySelector('.pokeinfo_container').classList.add('slide-in');
    document.querySelector('.pokeinfo_container').classList.remove('slide-out');

    const typePokemon = pokemonTypes.map(power => {
      const backgroundColor = getColor(power);
      return `<div class='power' style="background-color: ${backgroundColor};">${power}</div>`;
    }).join('');

    pokeInfoContainer.innerHTML = `
      <img src="${pokemonGif}" alt="${pokemonName}" class="pokemon_gif">
      <div class='pokeinfo_content'>
        <p>N°${pokemonNbr}</p>
        <h2>${pokemonName}</h2>
        <div class="power_container">${typePokemon}</div>
        <h3>Pokedex Entry</h3>
        <span>${pokemonDesc.replace(/[^\w\s]/gi, '')}</span>
        <div class='taille'>
          <h4>Height <span>${pokemonheight / 10}m</span></h4>
          <h4>Weight <span>${pokemonweight / 10}kg</span></h4>
        </div>
        <h3>Abilities</h3>
        <div class='taille abilitie' >${abilities.map(ability => `<span>${ability}</span>`).join(' ')}</div>
        <h3>Stats</h3>

        <div class='stats'>
          <div>
            <p style='background: #DF2140;'>HP</p>
            <span>${hp}</span>
          </div>

          <div>
            <p style='background: #FF994D'>ATK</p>
            <span>${attack}</span>
          </div>

          <div>
            <p style='background: #eecd3d'>DEF</p>
            <span>${defense}</span>
          </div>

          <div>
            <p style='background: #85DDFF'>SpA</p>
            <span>${specialAttack}</span>
          </div>

          <div>
            <p style='background: #96da83'>SpD</p>
            <span>${specialDefense}</span>
          </div>

          <div>
            <p style='background: #FB94A8'>SPD</p>
            <span>${speed}</span>
          </div>

          <div class='total'>
            <p style='background: #7195DC'>TOT</p>
            <span>${totalStats}</span>
          </div>

        </div>

        <h3>Evolution</h3>

        <div class='evo'>
        <img src="${pokemonImg}" alt="${pokemonName}">
        <span>Lv. ${pokemonEvo}</span>
        </div>
      </div>
    `;

    pokeInfoContainer.classList.add('pokeinfo-container-slide');

    if (window.innerWidth <= 1100) {
      elementResponsive.style.display = 'block';
      responsiveBtn.style.display = 'block';
    }

    setTimeout(() => {
      pokeInfoContainer.classList.remove('pokeinfo-container-slide');
    }, 800);
  } catch (erreur) {
    console.error('Erreur lors de la mise à jour des informations Pokémon :', erreur);
  }
}

// Fonction asynchrone pour charger et afficher la liste des Pokemon
async function fetchAndDisplayPokemon(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    // Convertir la réponse en JSON
    const data = await response.json();

    // Obtenir la liste des Pokémon
    const pokemonList = data.results;

    for (const pokemon of pokemonList) {
      // Verifier le nombre de Pokemon 
      if (pokemonCount >= NBR_POKEMON) {
        break;
      }
      // Afficher les informations du Pokemon
      await displayPokemonInfo(pokemon.url);
      pokemonCount++;
    }

    // Obtenir l'URL de la page suivante
    const nextPageUrl = data.next;
    if (nextPageUrl && pokemonCount < NBR_POKEMON) {
      // Charger la page suivante de Pokémon
      apiUrl = nextPageUrl;
      await fetchAndDisplayPokemon(apiUrl);
    }
  } catch (erreur) {
    console.error('Erreur lors de la récupération des données :', erreur);
  }
}

// Lancer le chargement et l'affichage des Pokémon en appelant la fonction
fetchAndDisplayPokemon(apiUrl);


