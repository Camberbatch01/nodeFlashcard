document.getElementById("createNewDeck").addEventListener('click', function(e){
    e.preventDefault();

    let deckName = document.getElementById("deckName").value;
    let params = `deckName=${deckName}`;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/yourDecks', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function(){
        if(this.status == 200){
                setTimeout(() => {
                alert(this.responseText);
                document.location.reload();
            }, 50);   
        }
    }
    xhr.send(params);
});

let delBtns = document.getElementsByClassName('close');
for (i=0; i<delBtns.length; i++){
    delBtns[i].addEventListener('click', deleteDeck);
}

function deleteDeck(){
    let deckName = this.parentElement.parentElement.childNodes[1].textContent; //find text inside 1st td

    if (confirm(`This will delete the deck ${deckName}. Are you sure?`)){
        let params = `deckName=${deckName}`;

        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/yourDecks', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onload = function(){
            if (this.status == 200){
                document.location.reload();
            }
        }
        xhr.send(params);
    } else {
        return;
    }
}
document.getElementById("Add").addEventListener('click', function(){
    try {
        document.getElementById("newDeckFormHide").id = "newDeckForm";
    }
    catch {
        document.getElementById("newDeckForm").id = "newDeckFormHide";
    }
});
