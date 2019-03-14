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