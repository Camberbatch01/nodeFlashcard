document.getElementById("createNew").addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username.length>1 && password.length>1){
        if (username.charAt(0)!==" "){
            const params = `username=${username}&password=${password}`;

            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/:createUser', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function(){
                if(this.status == 200){
                    const response = JSON.parse(this.response);
                    if (response.success){
                        alert(response.message);
                        window.location.href = `/yourDecks/${response.username}`;
                        //let xhttp = new XMLHttpRequest();
                        //xhttp.open('GET', `/yourDecks/${response.username}`, true);
                        //xhttp.send();
                    }
                    if (!response.success){
                        alert(response.message)
                        window.location.reload();
                    }  
                }
            }
            xhr.send(params);
        } else {
            alert("Can't have a username that starts with a space");
            document.location.reload();
        }
    } else {
        alert("Invalid username/password length");
        document.location.reload();
    }
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