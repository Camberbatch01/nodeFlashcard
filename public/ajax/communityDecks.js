function downloadDeck(){
    const deckName = this.parentElement.parentElement.childNodes[1].textContent; //find text inside 1st td
    const creator = this.parentElement.parentElement.childNodes[3].textContent;

    Swal.fire({
        title: `Download ${deckName} by ${creator}?`,
        text: "It will be added to your decks",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, download it!'
      }).then((result) => {
        if (result.value) {
            const params = `deckName=${deckName}&creator=${creator}`;

            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/communityDecks/download', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onload = function(){
                if (this.status == 200){
                    const response = JSON.parse(this.response);

                    if (response.success){
                        Swal.fire(
                        'Successful download!',
                        response.message,
                        'success'
                    ).then(()=> document.location.reload());
                    }
                    if (!response.success){
                        Swal.fire(
                            'Unsuccessful download!',
                            response.message,
                            'error'
                        ).then(()=> document.location.reload());
                    }
                }
            }
            xhr.send(params);      
        }
      });
}

const downloadBtns = document.getElementsByClassName("fa-download");
for (i=0; i< downloadBtns.length; i++){
    downloadBtns[i].addEventListener('click', downloadDeck);
}

document.getElementById("searchBtn").addEventListener('click', function(){
    const query = (document.getElementById("searchBar").value).replace(/\s/g, '+');
    window.location.href = `/communityDecks/${query}`;
})