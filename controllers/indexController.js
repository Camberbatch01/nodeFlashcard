const bodyParser = require('body-parser');
const mongoose = require('mongoose');

let taken;
//set up connection to database w/schema 
mongoose.connect("mongodb://test01:test01@ds255463.mlab.com:55463/flashcard"); 

const flashcardSchema = new mongoose.Schema({
        deckName: String,
        cards: [{
            front: String,
            back: String
        }]
});
const flashDb = mongoose.model('flashDb', flashcardSchema);

let urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('home');      //when get request from front end is received with this location name, render specific page w/data needed
    });
    app.get('/yourDecks', (req, res) => {
        flashDb.find({}, function(err, data){
            if (err) throw err;
            res.render('yourDecks', {deck: data});
        });
    });
    app.get('/chosenDeck/:deck', (req, res) => {
        flashDb.find({deckName: req.params.deck}, function(err, data){
            if (err) throw err; //search DB for name that matches the requested one then send its data through to front end response item
            res.render("chosenDeck", {deck: data})
        });  
    });
    app.get('/learn', (req, res) => {
        flashDb.find({}, function(err, data){
            if (err) throw err;
            res.render('learn', {deck: data});
        });
    });

    app.get('/learn/:amount/:deck', (req, res) => {
        res.render('flashLearn');
    });

    app.get('/learn/:amount/:deck/go', (req, res) => {
        flashDb.find({deckName: req.params.deck}, function(err, data){
            if (err) throw err; 
            let amount = req.params.amount;
            res.json({data, amount});
        });
    });

    app.post('/yourDecks',urlencodedParser, (req, res) => {
        flashDb.find({}, async function(err, data){
            if (err) throw err;
            for (i=0; i<data.length; i++){
                if (req.body.deckName == data[i].deckName){
                    taken = true;       //if deck name is taken, dont want to add it to the database
                    break;
                } else {
                    taken = false;
                }
            }
            await taken;
        }).then(resolve => {
            if (!taken) {
            let newDeck = {
                        deckName: req.body.deckName,
                        cards: [{
                            front: "Example",
                            back: "Example"
                        }]
                    };
            let newflashD = flashDb(newDeck).save(function(err, data){
                if (err) throw err;
                    res.json("Created"); 
                });
                } else if (taken) {
                    res.json("This deck name is taken");
                }
            }); 
    });

    app.delete('/yourDecks', urlencodedParser, (req, res) => {
        flashDb.remove({deckName: req.body.deckName}, function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });

    app.post('/chosenDeck/:deck', urlencodedParser, (req, res) => {
        let newCards = {front: req.body.front, back: req.body.back};
        flashDb.findOneAndUpdate({deckName: req.body.deckName}, {$push: {cards: newCards}}, function(err, data){
            if (err) throw err; //find deck name then add new cards to it and then send data to F/E
            res.json(data);
        });
    });

    app.post('/chosenDeck/:deck/edit', urlencodedParser, (req, res) => {
        flashDb.findOneAndUpdate(
            {deckName: req.body.deckName},
            {$set: {"cards.$[elem].front": req.body.newFront, "cards.$[elem].back": req.body.newBack}},
            {arrayFilters: [{"elem.front": req.body.front, "elem.back": req.body.back}]},
            function(err, data){
                if (err) throw err;
                res.json(data);
            }
        );
    });

    app.delete('/chosenDeck/:deck',urlencodedParser, (req, res) => {
        let cardsDel = {front: req.body.front, back: req.body.back};
        flashDb.findOneAndUpdate({deckName: req.body.deckName}, {$pull: {cards: cardsDel}}, function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });
}
