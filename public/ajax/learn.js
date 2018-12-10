document.getElementById("chooseDeck").addEventListener('submit', function(e){
    e.preventDefault();
    
    let deck = document.getElementById('deckOptions').value;
    let amount = document.getElementById("learnDeckAmount").value;
    let url = `/learn/${amount}/${deck}`;

    window.location.href = url; //get all necessary info from this page, then load up another by changing url, keeping info through url
});
