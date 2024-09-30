


function checkPokemonId(e) {
    let clickedCard = e.currentTarget; // Das ist das geklickte div.card
    let cardId = clickedCard.id; // Die id der Karte bekommen
    return cardId
}

function closeOverlay(e) {
    let clickedCard = e.currentTarget; // Das ist das geklickte div.card
    let cardId = clickedCard.id; // Die id der Karte bekommen
    console.log(cardId); // Hier kannst du die id verwenden
    document.getElementById("card_overlay_ctn").style.display = "none"
}