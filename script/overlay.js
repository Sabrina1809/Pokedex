function checkPokemonId(e) {
    let clickedCard = e.currentTarget;
    let cardId = clickedCard.id;
    return cardId
}

function closeOverlay() {
    document.getElementById("card_overlay_ctn").style.display = "none"
    document.body.style.overflow = ""
}

function showOverlayInfoMain() {
    closeOverlayInfos()
    document.getElementById("overlay_info_main").style.display = "flex";
    document.getElementById("overlay_menu_main").style.borderBottom = "1px solid white";
}

function showOverlayInfoStats() {
    closeOverlayInfos()
    document.getElementById("overlay_info_stats").style.display = "flex";
    document.getElementById("overlay_menu_stats").style.borderBottom = "1px solid white";
}

function showOverlayInfoEvo() {
    closeOverlayInfos()
    document.getElementById("evo_chain").style.display = "flex";
    document.getElementById("overlay_menu_evochain").style.borderBottom = "1px solid white";
}

function closeOverlayInfos() {
    document.getElementById("overlay_info_main").style.display = "none";
    document.getElementById("overlay_info_stats").style.display = "none";
    document.getElementById("evo_chain").style.display = "none";
    document.getElementById("overlay_menu_main").style.borderBottom = "1px solid transparent";
    document.getElementById("overlay_menu_stats").style.borderBottom = "1px solid transparent";
    document.getElementById("overlay_menu_evochain").style.borderBottom = "1px solid transparent";
}