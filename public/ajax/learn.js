document.getElementById("chooseDeck").addEventListener('submit', function(e){
    e.preventDefault();
    
    let deck = document.getElementById('deckOptions').value;
    let amount = document.getElementById("learnDeckAmount").value;
    let url = `/learn/${amount}/${deck}`;

    window.location.href = url;
});