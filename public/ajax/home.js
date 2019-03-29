document.getElementById("createNew").addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const params = `username=${username}&password=${password}`;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/:createUser', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function(){
        if(this.status == 200){
                setTimeout(() => {
                alert(this.responseText);   //let the user know their deck has been created or if its taken
                document.location.reload();
            }, 50);   
        }
    }
    xhr.send(params);
})
document.getElementById("loginBtn").addEventListener('click', () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const params = `username=${username}&password=${password}`;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function(){
        if(this.status == 200){
            const response = JSON.parse(this.response);

            if (!response.success){
                alert(response.message);
            }
            if (response.success){
                window.location.href = `/yourDecks/${response.message[0].username}`
            }
        }
    }
    xhr.send(params);
})