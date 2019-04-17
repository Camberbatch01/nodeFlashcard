document.getElementById("download").addEventListener('click', function(){
    const creator = document.getElementById("creator").textContent;
    const deckName = document.getElementById("nameOfDeck").textContent;
    
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
});