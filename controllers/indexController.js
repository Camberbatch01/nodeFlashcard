const bodyParser = require('body-parser');
const mongoose = require('mongoose');

let taken;
//set up connection to database w/schema 
mongoose.connect("mongodb://test01:test01@ds255463.mlab.com:55463/flashcard"); 

const flashcardSchema = new mongoose.Schema({
    username: String,
    password: String,
    decks: [{
        deckName: String,
        cards: [{
            front: String,
            back: String
        }],
        shared: false
    }] 
});
const flashDb = mongoose.model('flashDb', flashcardSchema);

const urlencodedParser = bodyParser.urlencoded({extended: false});

let user;

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('home');      //when get request from front end is received with this location name, render specific page w/data needed
    });
    app.get('/communityDecks', (req, res) => {
        flashDb.find({}, function(err, data){
            if (err) throw err;
            let newData = [];
            data.forEach(e => {
                const newObj = {};
                newObj["username"] = e.username;
                newObj["decks"] = e.decks.filter(elem => elem.shared === true);
                newData.push(newObj);
            })
            newData = newData.filter(e => e.decks.length > 0);
            res.render('communityDecks', {data: newData, username: user});
        })
    });
    app.get('/yourDecks/:user', (req, res) => {
        flashDb.find({username: user}, function(err, data){
            if (err) throw err;
            res.render('yourDecks', {data: data[0], username: user});
        });
    });
    app.get('/chosenDeck/:deck', (req, res) => {
        flashDb.find({username: user}, function(err, data){
            if (err) throw err; //search DB for name that matches the requested one then send its data through to front end response item
            let newData = data[0].decks.filter(e => {
                return e.deckName === req.params.deck;
            });
            res.render("chosenDeck", {deck: newData, username: user})
        });  
    });
    app.get('/learn', (req, res) => {
        flashDb.find({username: user}, function(err, data){
            if (err) throw err;
            res.render('learn', {data: data[0], username: user});
        });
    });

    app.get('/learn/:amount/:deck', (req, res) => {
        res.render('flashLearn');
    });

    app.get('/learn/:amount/:deck/go', (req, res) => {
        flashDb.find({username: user}, function(err, data){
            if (err) throw err;
            const allDecks = data[0].decks;
            const learnDeck = allDecks.filter(e => {
                return e.deckName === req.params.deck;
            })
            const amount = req.params.amount;
            res.json({learnDeck, amount});
        })
    });

    app.post('/:createUser', urlencodedParser, (req, res) => {
        flashDb.find({username: req.body.username}, function(err, data){
            if (err) throw err;
            if (data.length>0){
                res.json({
                    success: false,
                    message: "Username is taken"
                });
            }
            else {
                const newUser = {
                    username: req.body.username,
                    password: req.body.password,
                    decks: [{
                        deckName: "Template",
                        cards: [{
                            front: "Example",
                            back: "Example"
                        }],
                        shared: false
                    }]
                };
                let newflashD = flashDb(newUser).save(function(err, data){
                    if (err) throw err;
                    user = req.body.username;
                        res.json({
                            success: true,
                            message: "Created",
                            username: req.body.username
                        }); 
                    });
            }
        })
    });

    app.post('/', urlencodedParser, (req, res) => {
        flashDb.find({username: req.body.username}, function(err, data){
            if (err) throw err;
            if (data.length>0){
                if (data[0].password === req.body.password){
                    user = req.body.username;
                    res.json({
                        success: true,
                        message: data
                    });
                } else {
                    res.json({
                        success: false,
                        message: "incorrect password"
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: "username does not exist"
                });
            }
        })
    });

    app.post('/yourDecks/:user', urlencodedParser, (req, res) => {
        const nameOfDeck = (req.body.deckName).replace(/\#/g, ' ');
        flashDb.find({username: user}, async function(err, data){
            if (err) throw err;
            for (i=0; i<data[0].decks.length; i++){
                if (nameOfDeck === data[0].decks[i].deckName){
                    taken = true;       //if deck name is taken, dont want to add it to the database
                    break;
                } else {
                    taken = false;
                }
            }
            await taken;
        }).then(resolve => {
            if (!taken) {
            const newDeck = {
                        deckName: nameOfDeck,
                        cards: [{
                            front: "Example",
                            back: "Example"
                        }],
                        shared: false
                    };
            flashDb.findOneAndUpdate({username: user}, {$push: {decks: newDeck}}, function(err, data){
                if (err) throw err;
                res.json("Created");
            })
                } else if (taken) {
                    res.json("This deck name is taken");
                }
            }); 
    });
    app.post('/yourDecks/:user/share', urlencodedParser, (req, res) => {
        flashDb.find({username: user}, function(err, data){
            if (err) throw err;
            let changeVar;
            const dataDeck = data[0].decks.filter(e => e.deckName === req.body.deckName);
            if (dataDeck[0].shared === true){
                changeVar = false;
            } else {
                changeVar = true;
            }
            flashDb.findOneAndUpdate(
                {username: user},
                {$set: {"decks.$[deck].shared": changeVar}},
                {arrayFilters: [{"deck.deckName": req.body.deckName}]},
                function(err, data){
                    if (err) throw err;
                    res.json(data);
                }
            );
        })
    });
    app.delete('/yourDecks/:user', urlencodedParser, (req, res) => {
        flashDb.find({username: user}, function(err, data){
            if (err) throw err;
            const allDecks = data[0].decks;
            const rmvDeck = allDecks.filter(e => {
                return  e.deckName === req.body.deckName;
            })
            flashDb.findOneAndUpdate({username: user}, {$pull: {decks: rmvDeck[0]}}, function(err, data){
                if (err) throw err;
                res.json(data)
            })
        })
    });

    app.post('/chosenDeck/:deck', urlencodedParser, (req, res) => {
        let newCards = {front: req.body.front, back: req.body.back};
        flashDb.findOneAndUpdate(
            {username: user},
            {$addToSet: 
                {"decks.$[deck].cards": newCards}
            },
            {arrayFilters: [{"deck.deckName": req.body.deckName}]},
            function(err, data){
            if (err) throw err; //find deck name then add new cards to it and then send data to F/E
            res.json(data);
        });
    });

    app.post('/chosenDeck/:deck/edit', urlencodedParser, (req, res) => {
        flashDb.findOneAndUpdate(
            {username: user},
            {$set: {"decks.$[deck].cards.$[elem].front": req.body.newFront, "decks.$[deck].cards.$[elem].back": req.body.newBack}},
            {arrayFilters: [{"deck.deckName": req.body.deckName}, {"elem.front": req.body.front, "elem.back": req.body.back}]},
            function(err, data){
                if (err) throw err;
                res.json(data);
            }
        );
    });

    app.delete('/chosenDeck/:deck',urlencodedParser, (req, res) => {
        let cardsDel = {front: req.body.front, back: req.body.back};
        flashDb.findOneAndUpdate(
            {username: user},
            {$pull: {"decks.$[deck].cards": cardsDel}},
            {arrayFilters: [{"deck.deckName": req.body.deckName}]},
            function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });
}
