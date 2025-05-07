let pokemonData = [];
let currentPage = 1;
const pageSize = 60;

let generation=getGeneration();

async function fetchPokemonData() {
    const cachedData = localStorage.getItem('pokemonDataGen${generation}');
    /*USEFUL TO CACHE DATA AND LOAD IT EVEN AFTER CLOSING AND REOPENING, NOT MAKING TOO MANY API REQUESTS*/
     if (cachedData) {
        const data = JSON.parse(cachedData);
        pokemonData=data.pokemon_species;
        displayPage(currentPage);
    } else {
     if(generation!=0){
        const response = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
        const data = await response.json();
        pokemonData=data.pokemon_species;
        //localStorage.setItem('pokemonDataGen${generation}', JSON.stringify(data));
        displayPage(currentPage);
     }
     else {
        document.getElementById('pokemon-list').innerHTML = '(No se han encontrado Pokémon)';
        updatePaginationButtons();
     }
    }
}
function displayPage(page) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pokemonSubset = pokemonData.slice(start, end);
    displayPokemon(pokemonSubset);
    updatePaginationButtons();
}

async function displayPokemon(pokemonArray) {
    const listContainer = document.getElementById('pokemon-list');
    listContainer.innerHTML = '';

    for (let pokemon of pokemonArray) {
        let url=pokemon.url.replace('-species', ''); //El endpoint generation trabaja con pokemon-species, pero queremos el endpoint de pokemon
        const response = await fetch(url);
        const pokemonDetails = await response.json();
        pokemonDetails.name = pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1);

        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('pokemon');
        pokemonElement.innerHTML = `
        <div class="pokemon-info">
            <h3>${pokemonDetails.name}</h3>
            <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}" class="pokemon-sprite" data-cry="${pokemonDetails.cries.latest}"/>
            <div class="pokemon-number">#${pokemonDetails.id}</div>
        </div>`;

        const sprite = pokemonElement.querySelector('.pokemon-sprite');
        sprite.addEventListener('click', () => {
            const cryUrl = sprite.getAttribute('data-cry');
            if (cryUrl) {
                const audio = new Audio(cryUrl);
                audio.volume = 0.25;
                audio.play();
            }
        });

        listContainer.appendChild(pokemonElement);
    }
}

function updatePaginationButtons() {
    document.getElementById('back').style.opacity = currentPage === 1 ? "0.3" : "1";
    document.getElementById('next').style.opacity = currentPage * pageSize >= pokemonData.length ? "0.3" : "1";

    document.getElementById('back').style.pointerEvents = currentPage === 1 ? "none" : "auto";
    document.getElementById('next').style.pointerEvents = currentPage * pageSize >= pokemonData.length ? "none" : "auto";
}

function getGeneration() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('gen')) || 0;
}

document.getElementById('back').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentPage * pageSize < pokemonData.length) {
        currentPage++;
        displayPage(currentPage);
    }
});

fetchPokemonData();