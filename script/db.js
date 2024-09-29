let allPokemonNameAndUrl = []; 
let allPokemonDetails = [];
let filteredPokemon = [];

async function getData() {
    let responseAllPokemon = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let dataAllPokemon = await responseAllPokemon.json();
    allPokemonNameAndUrl = dataAllPokemon.results;

    let promisesSinglePokemon = allPokemonNameAndUrl.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    allPokemonDetails = await Promise.all(promisesSinglePokemon); 

    filterPokemon(allPokemonDetails, "si")
}

async function filterPokemon(allPokemonDetails, string) {
    for (let i = 0; i < allPokemonDetails.length; i++) {
        if (allPokemonDetails[i].name.includes(string) && allPokemonDetails[i].is_default == true) {
            let imgUrl = allPokemonDetails[i].sprites.other.home.front_default;
            if (imgUrl === null) {
                imgUrl = "./img/icons8-pikachu-pokemon-100.png"
            }
            filteredPokemon.push({"number" : allPokemonDetails[i].id, "name" : allPokemonDetails[i].name, "img" : imgUrl})
        }
    }
    filteredPokemon = filteredPokemon
    renderFilteredPokemon(filteredPokemon)
    console.log(filteredPokemon)
}

async function renderFilteredPokemon(filteredPokemon) {
    let numberToShow = checkNumberToShow(filteredPokemon);
    cardTemplate(numberToShow)
    document.getElementById("show_more").className = `${numberToShow}`;
}

function cardTemplate(numberToShow) {
    let lastShownNumber = Number(document.getElementById("show_more").className);
    console.log(`Anzahl zum Laden: ${numberToShow}`)

    for (let i = lastShownNumber; i < numberToShow; i++) {
        document.getElementById("cards_area").innerHTML += `
            <div class="card" id="${filteredPokemon[i].number + filteredPokemon[i].name}">
                <div class="card_header">
                    <span id="number_pokemon">#${filteredPokemon[i].number}</span>
                    <span id="name_pokemon">${filteredPokemon[i].name}</span>
                </div>
                <div class="card_img_pokemon_ctn">
                    <img class="card_img_pokemon" src="${filteredPokemon[i].img}" alt="${filteredPokemon[i].name}">
                </div>
                <div class="card_footer">
                    <img class="icon_type_of_pokemon" src="./img/icons8-blatt-100.png" alt="Blatt">
                    <img class="icon_type_of_pokemon" src="./img/icons8-feuer-60.png" alt="Feuer">
                </div>
            </div>`
    }
}

function checkNumberToShow(filteredPokemon) {
    let number;
    let lastShownNumber = Number(document.getElementById("show_more").className);
    console.log(`aktuell angezeigte Pokemon: ${lastShownNumber}`);
    let remainingPokemon = filteredPokemon.length - lastShownNumber;
    console.log(`Verbleibende Pokemon: ${remainingPokemon}`);
        if (remainingPokemon > 20) {
            number = lastShownNumber + 20
        } else {
            number = lastShownNumber + remainingPokemon
        }
    return number    
}

function showMore() {
    let numberToShow = checkNumberToShow(filteredPokemon)
    cardTemplate(numberToShow)
    document.getElementById("show_more").className = numberToShow;
}