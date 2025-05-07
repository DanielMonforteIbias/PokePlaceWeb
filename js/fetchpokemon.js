let pokemonData=[];
let filteredPokemonData=[];
let currentPage=1;
const pageSize=60;

async function fetchpokemonData() {
    document.getElementById('loading').style.display = 'flex';
    updatePaginationButtons();
    const cachedData = localStorage.getItem('pokemonData');
    if (cachedData) {
        pokemonData = JSON.parse(cachedData);
    } else {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const data = await response.json();
        const pokemonDetailsPromises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
        });
        pokemonData = await Promise.all(pokemonDetailsPromises);
        pokemonData = pokemonData.map(pokemon => ({
            id: pokemon.id,
            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            sprite: pokemon.sprites.front_default,
            datacry:pokemon.cries.latest
        }));
        pokemonData.forEach(pokemon => {
            pokemon.name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        });
        localStorage.setItem('pokemonData', JSON.stringify(pokemonData));
    }
    document.getElementById('loading').style.display = 'none';
    filteredPokemonData = pokemonData;
    displayPage(currentPage);
}
function displayPage(page) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pokemonSubset = filteredPokemonData.slice(start, end);
    displayPokemon(pokemonSubset);
    updatePaginationButtons();
}
async function displayPokemon(pokemonArray) {
    const listContainer = document.getElementById('pokemon-list');
    listContainer.innerHTML = '';
    for (let pokemon of pokemonArray) {
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('pokemon');
        pokemonElement.innerHTML = `
        <div class="pokemon-info">
            <h3>${pokemon.name}</h3>
            <img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-sprite" data-cry="${pokemon.datacry}"/>
            <div class="pokemon-number">#${pokemon.id}</div>
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
    document.getElementById('next').style.opacity = currentPage * pageSize >= filteredPokemonData.length ? "0.3" : "1";

    document.getElementById('back').style.pointerEvents = currentPage === 1 ? "none" : "auto";
    document.getElementById('next').style.pointerEvents = currentPage * pageSize >= filteredPokemonData.length ? "none" : "auto";
}
function applyFilters(){
    let name=document.getElementById('filterName').value.toLowerCase();
    let id=document.getElementById('filterId').value;
    filteredPokemonData = pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(name));
    if(id!="")filteredPokemonData = filteredPokemonData.filter(pokemon => pokemon.id==id);
    currentPage = 1;
    displayPage(currentPage);
}
document.getElementById('back').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentPage * pageSize < filteredPokemonData.length) {
        currentPage++;
        displayPage(currentPage);
    }
});
document.getElementById('filterName').addEventListener('input', (event) => {
    applyFilters();
});
document.getElementById('filterId').addEventListener('input', (event) => {
    applyFilters();
});

fetchpokemonData();