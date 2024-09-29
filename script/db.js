let allPokemonNameAndUrl = []; 
let allPokemonDetails = [];
let allPokemonMoreDetails = [];
let filteredPokemon = [];


async function getData() {
    let responseAllPokemon = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let dataAllPokemon = await responseAllPokemon.json();
    allPokemonNameAndUrl = dataAllPokemon.results;

    let promisesSinglePokemon = allPokemonNameAndUrl.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    allPokemonDetails = await Promise.all(promisesSinglePokemon); 
    console.log(allPokemonDetails)

    let promisesPokempnEggGroup = allPokemonDetails.map(pokemon => fetch(pokemon.species.url).then(res => res.json()));
    allPokemonMoreDetails = await Promise.all(promisesPokempnEggGroup); 
    console.log(allPokemonMoreDetails)

    filterPokemon(allPokemonDetails, "cha", allPokemonMoreDetails)
}

async function filterPokemon(allPokemonDetails, string, allPokemonMoreDetails) {
    for (let i = 0; i < allPokemonDetails.length; i++) {
        if (allPokemonDetails[i].name.includes(string) && allPokemonDetails[i].is_default == true) {
            filteredPokemon.push({
                "id" : allPokemonDetails[i].id + allPokemonDetails[i].name,
                "url" : allPokemonDetails[i].species.url,
                "weight" : allPokemonDetails[i].weight,
                "height" : allPokemonDetails[i].height,
                "number" : allPokemonDetails[i].id, 
                "name" : allPokemonDetails[i].name, 
                "img" : allPokemonDetails[i].sprites.other.home.front_default,
                "types" : checkPokemonType(i), 
                "color" : allPokemonMoreDetails[i].color.name,
                "base_experience" : allPokemonDetails[i].base_experience,
                "abilities" : checkPokemonAbilities(i),
                "stats" : checkPokemonStats(i),
                "evochain" : await checkEvoChain(i)
            })
        }
    }
    filteredPokemon = filteredPokemon
    renderFilteredPokemon(filteredPokemon)
    console.log(filteredPokemon)
}

function checkPokemonType(i) {
    let pokemonTypeArray = [];
    for (let j = 0; j < allPokemonDetails[i].types.length; j++) {
        pokemonTypeArray.push(allPokemonDetails[i].types[j].type.name)
    }
    return pokemonTypeArray
}

function checkPokemonAbilities(i) {
    let pokemonAbilitiesArray = [];
    for (let j = 0; j < allPokemonDetails[i].abilities.length; j++) {
        pokemonAbilitiesArray.push(allPokemonDetails[i].abilities[j].ability.name)
    }
    return pokemonAbilitiesArray
}

function checkPokemonStats(i) {
    let pokemonStatsArray = [];
    for (let j = 0; j < allPokemonDetails[i].stats.length; j++) {
        pokemonStatsArray.push({"name" : allPokemonDetails[i].stats[j].stat.name, "base_stat" : allPokemonDetails[i].stats[j].base_stat})
    }
    return pokemonStatsArray
}

async function checkEvoChain(i) {
    let responseEvoChain = await fetch(allPokemonMoreDetails[i].evolution_chain.url);
    let evochain = await responseEvoChain.json();
    return evochain
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
            <div class="card" id="${filteredPokemon[i].id}">
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