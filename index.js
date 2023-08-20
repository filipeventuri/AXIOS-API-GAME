const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

var DB  = {
    games: [
        {
            id: 23,
            title: "World of Warcraft",
            year: 2006,
            price: 200
        },
        {
            id: 24,
            title: "Sea of Thieves",
            year: 2018,
            price: 50
        },
        {
            id: 25,
            title: "Minecraft",
            year: 2012,
            price: 120
        }
    ]
}

app.get("/games", (req,res)=>{
    res.statusCode = 200;
    res.json(DB.games);
})

app.get("/game/:id", (req,res)=>{
    var id = parseInt(req.params.id);
    if(isNaN(id)){ 
        res.sendStatus(400);
    }else{
        
        var game = DB.games.find(g => g.id == id )

        if(game!=undefined){
            res.json(game);
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }
})


app.post("/game", (req,res)=>{
    var{title,price,year} = req.body
    DB.games.push({
        id: 27,
        title,
        year,
        price

    });

    res.sendStatus(200);
})

app.delete("/game/:id", (req,res)=>{
    var id = parseInt(req.params.id);
    if(isNaN(id)){ 
        res.sendStatus(400);
    }else{
        
        var index = DB.games.findIndex(g => g.id == id )

        if(index == -1){
            res.sendStatus(404);
        }else{
            DB.games.splice(index,1);
            res.sendStatus(200);
        }
    }
})

app.put("/game/:id", (req,res)=>{
    var id = parseInt(req.params.id);
    if(isNaN(id)){ 
        res.sendStatus(400);
    }else{
        
        var game = DB.games.find(g => g.id == id )

        if(game!=undefined){
            var {title,price,year} = req.body;
        
            if(title!=undefined) game.title = title;
            if(price!=undefined) game.price = price;
            if(year!=undefined)  game.year = year;

            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }

})

app.listen(8080, ()=>{
    console.log("api rodando!");
});
