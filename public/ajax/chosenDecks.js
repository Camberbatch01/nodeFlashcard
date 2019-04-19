document.getElementById("Add").addEventListener('click', function(){
    try {
        document.getElementById("newCardContainerHide").id = "newCardContainer";    //change to different pre-styled ID. Make it show or go
    }
    catch {
        document.getElementById("newCardContainer").id = "newCardContainerHide";
    }
});

document.getElementById("submitNewCard").addEventListener('click', function(e){
    e.preventDefault();
    //set parameter string to pass to the server
    let params = `front=${document.getElementById('frontCard').value}&back=${document.getElementById('backCard').value}&deckName=${document.getElementById('nameOfDeck').innerHTML}`;
  
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/chosenDeck/:deck', true);    //send post req to the location specified with param data
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function(){
        if(this.status == 200){
            document.location.reload(); //if the server returns a valid response then reload the page to show updated version
        }
    }
    xhr.send(params);
});

const deleteBtns = document.getElementsByClassName('close');
for (i=0; i<deleteBtns.length; i++){
    deleteBtns[i].addEventListener('click', deleteCard);
}
const editBtns = document.getElementsByClassName('far fa-edit'); 
for (i=0; i<editBtns.length; i++){
    editBtns[i].addEventListener('click', editCard);
}
const editDeckName = document.getElementById("edit").addEventListener('click', editName);

function editName(){
    const name = document.getElementById("nameOfDeck");
    const oldName = name.textContent;
    
    name.setAttribute('contenteditable', true);
    name.focus();
    name.addEventListener('keypress', function(e){
        if (e.key === 'Enter'){
            e.preventDefault();
            name.setAttribute('contenteditable', false);

            const params = `newName=${name.textContent}&oldName=${oldName}`;

            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/chosenDeck/:deck/editDeckName', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function(){
                if(this.status == 200){
                    document.location.replace(`/chosenDeck/${(name.textContent).replace(/\s/g, '+')}`);
                }
            }
            xhr.send(params);
        }
    });
}

function deleteCard(){
    let tdElements = this.parentElement.parentElement.childNodes;   //list all td's within tr in an array so i can pick out the front and back text
    let params = `deckName=${document.getElementById('nameOfDeck').innerHTML}&front=${tdElements[3].textContent}&back=${tdElements[5].textContent}`;

    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/chosenDeck/:deck', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function(){
        if(this.status == 200){
            document.location.reload();
        }
    }
    xhr.send(params);
}

function editCard(){
    let enterCount = 0; //used to keep track of times enter is clicked on edit (max 2. front/back)
    frontCell = this.parentElement.parentElement.childNodes[3]; //find cells holding front and back card data
    backCell = this.parentElement.parentElement.childNodes[5];

    oldCard = {front: frontCell.textContent, back: backCell.textContent}; //store old card data before changing it

    frontCell.setAttribute('contenteditable', true);    //allow the td values to be edited by the user
    backCell.setAttribute('contenteditable', true);
    frontCell.focus();

    frontCell.addEventListener('keypress', function(e){
        if (e.key === 'Enter'){
            e.preventDefault(); //placed it here so it doesn't stop people typing until theyre confirming
            frontCell.setAttribute('contenteditable', false);
            backCell.focus();
            enterCount++;
            enterC();
        }
    });
    backCell.addEventListener('keypress', function(e){
        if (e.key === 'Enter'){
            e.preventDefault();
            backCell.setAttribute('contenteditable', false);
            frontCell.focus();
            enterCount++;
            enterC();
        }
    });
    function enterC(){
        if (enterCount > 1){
            newCard = {front: frontCell.textContent, back: backCell.textContent};
            params = `deckName=${document.getElementById('nameOfDeck').innerHTML}&front=${oldCard.front}&back=${oldCard.back}&newFront=${newCard.front}&newBack=${newCard.back}`;
            
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/chosenDeck/:deck/edit', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function(){
                if(this.status == 200){
                    document.location.reload();
                }
            }
            xhr.send(params);
        }
    }
}
