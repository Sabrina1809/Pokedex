let allPokemonNameAndUrl = []; 
let allPokemonDetails = [];
let allPokemonMoreDetails = [];
let allPokemon = [];
let filteredPokemon = [];

async function getData(filter) {
    startLoadingSpinner()
    let responseAllPokemon = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let dataAllPokemon = await responseAllPokemon.json();
    allPokemonNameAndUrl = dataAllPokemon.results;

    let promisesSinglePokemon = allPokemonNameAndUrl.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    allPokemonDetails = await Promise.all(promisesSinglePokemon); 
    // console.log(allPokemonDetails)

    let promisesallPokemonMoreDetails = allPokemonDetails.map(pokemon => fetch(pokemon.species.url).then(res => res.json()));
    allPokemonMoreDetails = await Promise.all(promisesallPokemonMoreDetails); 
    // console.log(allPokemonMoreDetails)

    allPokemon = await connectArrays(allPokemonDetails, allPokemonMoreDetails)
    console.log(allPokemon[0])  
    console.log(allPokemon);

    stopLoadingSpinner()
    
    filterPokemon(allPokemon, filter)
}

function startLoadingSpinner() {
    document.getElementById("loadingspinner_ctn").style.display = "flex";
    
    let loadingText = [".", ".", ".", " ", "l", "o", "a", "d", "i", "n", "g", " ", ".", ".", "."]

    for (let i = 0; i < loadingText.length; i++) {
        setTimeout(() => showText(loadingText, i), i * 200)
    }

    setTimeout(() => { 
        document.getElementById("loading_text").innerHTML = ""
        for (let i = 0; i < loadingText.length; i++) {
            setTimeout(() => showText(loadingText, i), i * 200)
        }
    }, 3500)

   
}

function showText(loadingText, i) {
    document.getElementById("loading_text").innerHTML += loadingText[i]
}

function stopLoadingSpinner() {
    document.getElementById("loadingspinner_ctn").style.display = "none";

}

async function connectArrays(allPokemonDetails, allPokemonMoreDetails) {
    let evochain = await checkEvoChain(allPokemonMoreDetails);

    for (let i = 0; i < allPokemonDetails.length; i++) {
        let singlePokemon = Object.assign({}, allPokemonDetails[i], allPokemonMoreDetails[i], evochain[i]);
        allPokemon.push(singlePokemon);
    }
    allPokemon = allPokemon
    return allPokemon
}

function getFilter() {
    let filter; 
    document.getElementById("cards_area").innerHTML = "";
    document.getElementById("show_more").className = 0;
    let input = document.getElementById("search").value;
    filteredPokemon = [];
    if (input == "") {
        filter = ""
    } else {
        console.log(input)
        filter = input;
    }
    filterPokemon(allPokemonDetails, filter, allPokemonMoreDetails)
}

async function filterPokemon(allPokemon, filter) {
    filteredPokemon = [];
    for (let i = 0; i < allPokemon.length; i++) {
        if (allPokemon[i].name.includes(filter) && allPokemon[i].is_default == true) {
            filteredPokemon.push({
                "id" : allPokemon[i].order + allPokemon[i].name,
                "url" : allPokemon[i].species.url,
                "weight" : allPokemon[i].weight,
                "height" : allPokemon[i].height,
                "number" : allPokemon[i].order, 
                "name" : allPokemon[i].name, 
                "img" : allPokemon[i].sprites.other.home.front_default,
                "types" : checkPokemonType(i), 
                // "color" : allPokemon[i].color.name,
                "base_experience" : allPokemon[i].base_experience,
                "abilities" : checkPokemonAbilities(i),
                "stats" : checkPokemonStats(i),
                "evo_this_pokemon" : {"name" : allPokemon[i].name, "number" : allPokemon[i].order, "img" : allPokemon[i].sprites.other.home.front_default},
                // "evo_next_pokemon" : {"name" : allPokemon[i].chain.evolves_to[0].species.name, "indexAllPokemon" : checkPokemonIndex(allPokemon, i),"number" : allPokemon[i].id, "img" : allPokemon[i].sprites.other.home.front_default},
                // "evo_after_next_pokemon" : {"name" : allPokemon[i].chain.evolves_to[0].evolves_to[0].species.name, "number" : allPokemon[i].id, "img" : allPokemon[i].sprites.other.home.front_default}
                // "evochain_step1" : 
            })
        }
    }
    filteredPokemon = filteredPokemon
    renderFilteredPokemon(filteredPokemon)
    console.log(filteredPokemon)
}

function checkPokemonIndex(allPokemon, i) {
    let index
    for (let j = 0; j < allPokemon.length; j++)
    if (allPokemon[i].chain.evolves_to[0].species.name == allPokemon[j].name) {
        index = j
    }
    return index
}

function checkPokemonType(i) {
    let pokemonTypeArray = [];
    for (let j = 0; j < allPokemon[i].types.length; j++) {
        pokemonTypeArray.push(allPokemon[i].types[j].type.name)
    }
    return pokemonTypeArray
}

function checkPokemonAbilities(i) {
    let pokemonAbilitiesArray = [];
    for (let j = 0; j < allPokemon[i].abilities.length; j++) {
        pokemonAbilitiesArray.push(allPokemon[i].abilities[j].ability.name)
    }
    return pokemonAbilitiesArray
}

function checkPokemonStats(i) {
    let pokemonStatsArray = [];
    for (let j = 0; j < allPokemon[i].stats.length; j++) {
        pokemonStatsArray.push({"name" : allPokemon[i].stats[j].stat.name, "base_stat" : allPokemon[i].stats[j].base_stat})
    }
    return pokemonStatsArray
}

async function checkEvoChain(allPokemonMoreDetails) {
    let evochainArray = [];
    for (let i = 0; i < allPokemonMoreDetails.length; i++) {
        let responseEvoChain = await fetch(allPokemonMoreDetails[i].evolution_chain.url);
        let evochain = await responseEvoChain.json();
        evochainArray.push(evochain)
    }
    return evochainArray
}

async function renderFilteredPokemon(filteredPokemon) {
    let numberToShow = checkNumberToShow(filteredPokemon);
    cardTemplate(numberToShow)
    document.getElementById("show_more").className = `${numberToShow}`;
}

function cardTemplate(numberToShow) {
    disableButton(numberToShow)
    let lastShownNumber = Number(document.getElementById("show_more").className);
    for (let i = lastShownNumber; i < numberToShow; i++) {
        let card_footer_innerHTML = setTypesToPokemon(filteredPokemon, i);
        document.getElementById("cards_area").innerHTML += `
            <div class="card" onclick="openOverlay(event)" id="${filteredPokemon[i].id}">
                <div class="card_header">
                    <span id="number_pokemon">#${filteredPokemon[i].number}</span>
                    <span id="name_pokemon">${filteredPokemon[i].name}</span>
                </div>
                <div class="card_img_pokemon_ctn ${filteredPokemon[i].types[0]}">
                    <img class="card_img_pokemon" src="${filteredPokemon[i].img}" alt="${filteredPokemon[i].name}">
                </div>
                <div id="card_footer_${filteredPokemon[i].id}" class="card_footer">
                    ${card_footer_innerHTML}
                </div>
            </div>`
    }
}

function setTypesToPokemon(filteredPokemon, i) {
    let typeImgCollection = "";
    for (let j = 0; j < filteredPokemon[i].types.length; j++) {
        typeImgCollection += `
            <img class="icon_type_of_pokemon ${filteredPokemon[i].types[j]}" src="./img/types/${filteredPokemon[i].types[j]}.svg" alt="${filteredPokemon[i].types[j]}">
            `;
    }
    typeImgCollection = typeImgCollection
    return typeImgCollection
}

function checkNumberToShow(filteredPokemon) {
    let number;
    let lastShownNumber = Number(document.getElementById("show_more").className);
    let remainingPokemon = filteredPokemon.length - lastShownNumber;
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

function disableButton(numberToShow) {
    if( numberToShow == filteredPokemon.length) {
        document.getElementById("show_more").style.display = "none";
    } else {
        document.getElementById("show_more").style.display = "flex";
    }
}

function openOverlay(e) {
    let thisPokemon = checkPokemonId(e) 
    console.log(thisPokemon)
    document.getElementById("card_overlay_ctn").style.display = "flex"
    let indexOfFilteredPokemon = checkIndexOfFilteredPokemon(thisPokemon, filteredPokemon)
    console.log(indexOfFilteredPokemon)
    fillOverlay(indexOfFilteredPokemon) 
    document.getElementById("card_overlay").addEventListener("click", function(e) {
        e.stopPropagation()
    })
}

function fillOverlay(indexOfFilteredPokemon) {
    let thisName = filteredPokemon[indexOfFilteredPokemon].name;
    document.getElementById("overlay_number_pokemon").innerText = `#${filteredPokemon[indexOfFilteredPokemon].number}`
    document.getElementById("overlay_name_pokemon").innerText = `${thisName}`
    document.getElementById("imgOverlay").src = `${filteredPokemon[indexOfFilteredPokemon].img}`
    document.getElementById("overlay_card_img_pokemon_ctn").classList.add(`${filteredPokemon[indexOfFilteredPokemon].types[0]}`);    
    let pokemonTypes = setTypesToPokemon(filteredPokemon, indexOfFilteredPokemon)
    document.getElementById("overlay_card_type_of_pokemon_ctn").innerHTML = pokemonTypes;
    setInfoMain(filteredPokemon, indexOfFilteredPokemon)
    setInfoStats(filteredPokemon, indexOfFilteredPokemon)
    setEvochainThisPokemon(thisName)
    showOverlayInfoMain()
}

function checkUnfilteredArray(thisName) {
    let index;
    for (let i = 0; i < allPokemonDetails.length; i++) {
        if (allPokemonDetails[i].name == thisName) {
            index = i;
            return index
        }
    }
    return index
}

function checkEvoChainArray(thisName) {
    let index;
    for (let i = 0; i < allPokemon.length; i++) {
        if (allPokemon[i].chain.species.name == thisName) {
            index = i;
            return index
        }
    }
    return index
}

function setInfoMain(filteredPokemon, indexOfFilteredPokemon) {
    document.getElementById("height").innerText = `${filteredPokemon[indexOfFilteredPokemon].height} m`
    document.getElementById("weight").innerText = `${filteredPokemon[indexOfFilteredPokemon].weight} kg`
    document.getElementById("base_exp").innerText = `${filteredPokemon[indexOfFilteredPokemon].base_experience}`
    document.getElementById("abilities").innerText = `${filteredPokemon[indexOfFilteredPokemon].abilities.join(', ')}`
}

function setInfoStats(filteredPokemon, indexOfFilteredPokemon) {
    document.getElementById("stat1name").innerText = `${filteredPokemon[indexOfFilteredPokemon].stats[0].name}`
    document.getElementById("stat1baseStat").style.width = `${filteredPokemon[indexOfFilteredPokemon].stats[0].base_stat}%`
    document.getElementById("stat2name").innerText = `${filteredPokemon[indexOfFilteredPokemon].stats[1].name}`
    document.getElementById("stat2baseStat").style.width = `${filteredPokemon[indexOfFilteredPokemon].stats[1].base_stat}%`
    document.getElementById("stat3name").innerText = `${filteredPokemon[indexOfFilteredPokemon].stats[2].name}`
    document.getElementById("stat3baseStat").style.width = `${filteredPokemon[indexOfFilteredPokemon].stats[2].base_stat}%`
    document.getElementById("stat4name").innerText = `${filteredPokemon[indexOfFilteredPokemon].stats[3].name}`
    document.getElementById("stat4baseStat").style.width = `${filteredPokemon[indexOfFilteredPokemon].stats[3].base_stat}%`
    document.getElementById("stat5name").innerText = `${filteredPokemon[indexOfFilteredPokemon].stats[4].name}`
    document.getElementById("stat5baseStat").style.width = `${filteredPokemon[indexOfFilteredPokemon].stats[4].base_stat}%`
    document.getElementById("stat6name").innerText = `${filteredPokemon[indexOfFilteredPokemon].stats[5].name}`
    document.getElementById("stat6baseStat").style.width = `${filteredPokemon[indexOfFilteredPokemon].stats[5].base_stat}%`
} 

function checkIndexOfFilteredPokemon(thisPokemon, filteredPokemon) {
    for (let i = 0; i < filteredPokemon.length; i++) {
        if (filteredPokemon[i].id == thisPokemon) {
            return i
        }
    }
}
