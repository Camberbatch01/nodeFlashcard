document.getElementById("download").addEventListener('click', function(){
    const creator = document.getElementById("creator").textContent;
    const deckName = document.getElementById("nameOfDeck").textContent;
    
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
});