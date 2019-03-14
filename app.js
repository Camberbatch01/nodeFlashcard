const express = require("express");
const indexController = require('./controllers/indexController');
const app = express();
//set up template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));

indexController(app);

app.listen(process.env.PORT || 3000, () => {
    console.log('App listening on port 3000!');
});
