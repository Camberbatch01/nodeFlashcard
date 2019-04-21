  const btnToggle = document.getElementsByClassName("btn-options");

  btnToggle[0].addEventListener('click', ()=> {
    const menu = document.getElementById("toggleOpt");
    if (menu.className === "small-screen-nav"){
      return menu.className = "small-screen-nav-on";
    } 
    if (menu.className === "small-screen-nav-on"){
      return menu.className = "small-screen-nav";
    }
  })

  const logOut = document.getElementsByClassName("logout");

  for (i=0; i<logOut.length; i++){
    logOut[i].addEventListener('click', function(){
      Swal.fire({
        title: `Are you sure?`,
        text: "You will be logged out",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!'
      }).then((result) => {
        if (result.value) {
            window.location.href = "/";    
        }
      });
    })
  }