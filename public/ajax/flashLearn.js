document.getElementById("exit").addEventListener('click', function(){
    window.location.href = "/learn";    //previous page
});

window.onload = function(){
    let route = `${window.location.pathname}/go`

    let xhr = new XMLHttpRequest();
    xhr.open('GET', route, true);
    xhr.onload = function(){
        if(this.status == 200){
            let response = JSON.parse(this.response);
            startLearning(response);
        }
    }
    xhr.send();
}

function startLearning(response) {
    let counter = 1;
    let score = 0;
    let deckLength = response.learnDeck[0].cards.length;
        //set up page elements
        document.getElementById("amountCards").innerHTML = `Q: ${counter}/${response.amount}`;
        document.getElementById("score").innerHTML = `${score}/${response.amount}`

        let index = Math.floor(Math.random()*(deckLength - 0.00001)); //deduct small decimal to stop maximum case exceeding array length
        document.getElementById("front").innerHTML = response.learnDeck[0].cards[index].front;
        document.getElementById("back").innerHTML = response.learnDeck[0].cards[index].back; //randomly select a card
    
    document.getElementById("next").addEventListener('click', function(){
        if (counter < response.amount){
            counter++;
            document.getElementById("amountCards").innerHTML = `Q: ${counter}/${response.amount}`;
            document.getElementById("score").innerHTML = `${score}/${response.amount}`
            document.getElementById("guess").value = document.getElementById("guess").defaultValue;

            try {
                document.getElementById("backCorrect").id = "back"; //reset id from color change id
            }
            catch(err) {
                document.getElementById("backWrong").id = "back";
            }

            let index = Math.floor(Math.random()*(deckLength - 0.00001));
            document.getElementById("front").innerHTML = response.learnDeck[0].cards[index].front;
            document.getElementById("back").innerHTML = response.learnDeck[0].cards[index].back;
        } else {
            document.getElementById("next").style.display = "none"; //dont allow the user to keep spamming next when out of cards
        }
    });
    document.getElementById("reveal").addEventListener('click', function(){
        let guess = document.getElementById("guess").value;
        let ans = document.getElementById("back").innerHTML;
        
        if (guess == ans) {
            score++;
            document.getElementById("back").id = "backCorrect";
        } else {
            document.getElementById("back").id = "backWrong";
            let colourAns = "" 
            for (i=0; i<ans.length; i++) {
                if (guess[i] == ans[i]) {
                    colourAns += `<span style="color: green">${ans[i]}</span>`;
                } else {
                    colourAns += ans[i];
                }   //set word red and make each correct letter green to show the user where they went wrong
            }
            document.getElementById("backWrong").innerHTML = colourAns;
        }
    });
}
