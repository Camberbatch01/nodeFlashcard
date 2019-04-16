function downloadDeck(){
    const deckName = this.parentElement.parentElement.childNodes[1].textContent; //find text inside 1st td
    const creator = this.parentElement.parentElement.childNodes[3].textContent;

    if (confirm(`Download ${deckName} by ${creator}?`)){
       const params = `deckName=${deckName}&creator=${creator}`;

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/communityDecks/download', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function(){
            if (this.status == 200){
                alert(this.responseText);
                document.location.reload();
            }
        }
        xhr.send(params); 
    } else {
        return;
    }
}

const downloadBtns = document.getElementsByClassName("fa-download");
for (i=0; i< downloadBtns.length; i++){
    downloadBtns[i].addEventListener('click', downloadDeck);
}