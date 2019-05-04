if(performance.navigation.type === 2){
    location.reload(true);
}

document.getElementById("createNewDeck").addEventListener('click', function(e){
    e.preventDefault();

    const deckName = (document.getElementById("deckName").value).replace(/\s/g, '#');
    if (deckName=== '' || deckName.charAt(0)==="#"){
        Swal.fire({
            type: 'error',
            title: 'Invalid name',
            text: 'Decks must have a name and not start with a space',
            timer: 3000
        });
        return;
    }

    let params = `deckName=${deckName}`;
    //create post req to url specified, passing through param data
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/yourDecks/:user', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function(){
        if(this.status == 200){
            const response = JSON.parse(this.response);
            if (response.success){
                Swal.fire({
                    type: 'success',
                    title: response.message,
                    timer: 3000
                }).then(() => document.location.reload());
            }
            if (!response.success){
                swal.fire({
                    type: 'error',
                    title: response.message,
                    timer: 3000
                }).then(()=> document.location.reload());
            }
        }
    }
    xhr.send(params);
});

let delBtns = document.getElementsByClassName('close');
for (i=0; i<delBtns.length; i++){
    delBtns[i].addEventListener('click', deleteDeck);
}

function shareDeck(){
    const deckName = this.parentElement.parentElement.childNodes[3].textContent; //find text inside 1st td
    const params = `deckName=${deckName}`;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/yourDecks/:user/share', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function(){
        if (this.status == 200){
            document.location.reload();
        }
    }
    xhr.send(params);
}

const shareBtns = document.getElementsByClassName('fa-share-alt');
for (i=0; i<shareBtns.length; i++){
    shareBtns[i].addEventListener('click', shareDeck);
}

function deleteDeck(){
    const deckName = this.parentElement.parentElement.childNodes[3].textContent; //find text inside 1st td

    Swal.fire({
        title: `Deleting ${deckName}. Are you sure?`,
        text: "You won't be able to go back!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            const params = `deckName=${deckName}`;

            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/yourDecks/:user', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.onload = function(){
                if (this.status == 200){
                    Swal.fire(
                        'Deleted!',
                        'Your deck has been deleted.',
                        'success'
                    ).then(()=> document.location.reload());
                }
            }
            xhr.send(params);
        }
      })
}
document.getElementById("Add").addEventListener('click', function(){
    try {
        document.getElementById("newDeckFormHide").id = "newDeckForm";  //pre-styled ID's. Either show or hide
    }
    catch(err) {
        document.getElementById("newDeckForm").id = "newDeckFormHide";
    }
});
