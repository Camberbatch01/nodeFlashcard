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
                        Swal.fire({
                            title: 'Created',
                            text: 'Your profile has been created',
                            type: 'success',
                            timer: 2000
                        }).then(()=> {
                            window.location.href = `/yourDecks/${response.username}`;
                        });
                    }
                    if (!response.success){
                        Swal.fire({
                            title: response.message,
                            type: 'error',
                            timer: 2000
                        }).then(() => {
                            document.location.reload();
                        })
                    }  
                }
            }
            xhr.send(params);
        } else {
            Swal.fire({
                type: 'error',
                title: 'Invalid Username',
                text: "Can't have a username that starts with a space"
            }).then((result) => {
                if (result.value){
                    document.location.reload();    
                }
            });
        }
    } else {
        Swal.fire({
            type: 'error',
            title: "Invalid username/password length"
        }).then((result) => {
            if (result.value){
                document.location.reload();    
            }
        });
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
                Swal.fire({
                    type: 'error',
                    title: response.message,
                    text: 'Try Again',
                    timer: 2000
                }).then(() => {
                    document.location.reload();
                });
            }
            if (response.success){
                window.location.href = `/yourDecks/${response.message[0].username}`
            }
        }
    }
    xhr.send(params);
})