let loadedAllPokemon = [];
let offset = 1;
let limit = 30;



async function init() {
    await loadAllPokemonInArray();
    renderPokemonContainer();
}


async function loadAllPokemonInArray() {
    for (let i = offset; i <= limit; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let responseAsJson = await response.json();
        loadedAllPokemon.push(responseAsJson);
    }
    console.log(loadedAllPokemon);
}


function renderPokemonContainer() {
    for (let i = offset - 1; i < loadedAllPokemon.length; i++) {
        let currentPokemon = loadedAllPokemon[i];
        document.getElementById('content').innerHTML += generatePokemonContainer(currentPokemon, i);

        let Types = currentPokemon['types'];
        loadPokemonTypes(Types, i);
    }
}


function generatePokemonContainer(currentPokemon, i) {
    let PokemonPicture = currentPokemon['sprites']['other']['dream_world']['front_default'];
    let PokemonName = currentPokemon['name'];
    let PokemonId = currentPokemon['id'];
    return /*html*/`
    <div class="pokedex" id="pokedex${i}" onclick="openPokemonPlayerDesk(${i})">
        <div class="pokemon-info">
            <span>ID #${(PokemonId)}</span>
            <span class="name">${PokemonName}</span>
            <div id="types${i}"></div> 
        </div>
        <div class="picture-container">
        <img class="bg-image" src="./img/pokeball-bg.png">
        <img class="pokemon-picture" src="${PokemonPicture}">
        </div>
    </div>    
`;
}


function loadPokemonTypes(Types, i) {
    for (let index = 0; index < Types.length; index++) {
        let PokemonTypes = Types[index]['type']['name'];
        document.getElementById(`types${i}`).innerHTML += generatePokemonTypes(PokemonTypes);
        let firstType = Types[0]['type']['name']
        checkBackgroundColor(firstType, i);
    }
}


function generatePokemonTypes(PokemonTypes) {
    return /*html*/ `
    <div class="pokemon-types">${PokemonTypes}</div>
    `;
}


function checkBackgroundColor(firstType, i) {
    let container = document.getElementById(`pokedex${i}`);
    defineColor(firstType, container);
}

function defineColor(firstType, container) {
    container.classList.add(firstType);
}


function filterNames() {
    let search = document.getElementById('search').value || document.getElementById('responsive-search').value;
    search = search.toLowerCase();
    let content = document.getElementById('content');
    content.innerHTML = '';
    for (let index = 0; index < loadedAllPokemon.length; index++) {
        let name = loadedAllPokemon[index]['name'];
        let currentPokemon = loadedAllPokemon[index];
        let Types = currentPokemon['types'];
        if (name.toLowerCase().includes(search)) {
            content.innerHTML += generatePokemonContainer(currentPokemon, index);
            loadPokemonTypes(Types, index);
        }
    }
}


function openImprint() {
    document.getElementById('imprint').classList.remove('d-none');
    includeHTMLTemplates();
}


function closeImprint() {
    document.getElementById('imprint').classList.add('d-none');
}


function openDataProtection() {
    document.getElementById('data-protection').classList.remove('d-none');
    includeHTMLTemplates();
}


function closeDataProtection() {
    document.getElementById('data-protection').classList.add('d-none');
}


async function includeHTMLTemplates() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/data-protection.html & imprint.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function showResponsiveMenu() {
    document.getElementById('responsive-menu').classList.add('show-responsive-menu');
}


function closeResponsiveMenu() {
    document.getElementById('responsive-menu').classList.remove('show-responsive-menu');
}


async function loadMorePokemon() {
    offset = offset + 30;
    if (limit <= 650) {
        limit = limit + 30;
        showLoadingAnimation();
        await init();
        hideLoadingAnimation();
    }
    else {
        alert('more Pokemon coming soon')
    }
}


function showLoadingAnimation() {
    document.getElementById('load-btn').classList.add('d-none');
    document.getElementById('load-animation').classList.remove('d-none');
}


function hideLoadingAnimation() {
    document.getElementById('load-animation').classList.add('d-none');
    document.getElementById('load-btn').classList.remove('d-none');
}


function openPokemonPlayerDesk(i) {
    let desk = document.getElementById('desk');
    let name = loadedAllPokemon[i]['name'];
    let deskId = loadedAllPokemon[i]['id']
    let picture = loadedAllPokemon[i]['sprites']['other']['dream_world']['front_default'];
    desk.classList.remove('d-none');
    document.getElementById('body').style.overflowY = 'hidden';
    desk.innerHTML = generatePokemonCard(picture, deskId, name);
    loadDeskTypes(i);
    loadPokemonStats(i);
}


function closeDesk() {
    document.getElementById('desk').classList.add('d-none');
    document.getElementById('body').style.overflowY = 'inherit';
}


function loadDeskTypes(i) {
    let deskTypes = loadedAllPokemon[i]['types'];
    for (let index = 0; index < deskTypes.length; index++) {
        let deskType = deskTypes[index]['type']['name'];
        document.getElementById('desk-types').innerHTML += generateDeskTypes(deskType);
    }
    let colorType = deskTypes[0]['type']['name'];
    let container = document.getElementById('frame-top-bg');
    defineColor(colorType, container);
}


function generateDeskTypes(deskType) {
    return /*html*/ `
    <div class="desk-types">${deskType}
    </div>
    `;
}


function generatePokemonCard(picture, deskId, name,) {
    return /*html*/ `
    <div class="bg-desk">
        <div class="frame-desk">
            <div class="inner-frame-top" id="frame-top-bg">
                <div class="desk-close-container">
                    <p class="desk-close-btn" onclick="closeDesk()">Back</p>
                </div>
                <div>
                    <p class="desk-id">ID #${deskId}</p>
                    <p class="desk-name">${name}</p>
                    <div id="desk-types" class="desk-types-container"></div>
                </div>
            </div>
            <div class="inner-frame-bottom">
                <div class="desk-picture-container">
                    <img class="desk-image" src="${picture}">
                </div>
                <p class="stat-headline">Base Stats</p> 
                <div id="desk-stats"></div>
            </div>
        </div>
    </div>
    `;
}


function loadPokemonStats(i) {
    let stats = loadedAllPokemon[i]['stats'];
    for (let j = 0; j < stats.length; j++) {
        let statName = stats[j]['stat']['name'];
        let baseStat = stats[j]['base_stat'];
        document.getElementById('desk-stats').innerHTML += generatePokemonStats(statName, baseStat);
    }
}


function generatePokemonStats(name, stats) {
    return /*html*/ `
    <div class="base-stat-frame">
        <div class="base-stat-container">
        <p>${name}</p>
        <p><b>${stats}</b></p>
        </div>
        <div class="progress-bar">
        <progress value="${stats}" max="100"></progress>
        </div>
    </div>
    `;
}




