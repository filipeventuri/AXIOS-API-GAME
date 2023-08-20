const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

const jwtSecret = "bnduoqhnwiodq123nh12451h29";

function auth(req,res,next){
    const authToken = req.headers['authorization'];

    if(authToken != undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1];
        jwt.verify(token,jwtSecret, (err, data)=>{
            if(err){
                res.status(401);
                res.json({err:"Token inválido"});
            }else{
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email};
                next(); 
            }
        });
    }else{
        res.status(401);
        res.json({err:"Autenticação inválida"});
    }
    

}
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
    ],
    users:[
        {
            id:1,
            name: "Filipe Venturi",
            email:"filipe@hotmail.com",
            password:"123"

        },{
            id:2,
            name: "Ivana Carolina",
            email:"ivana7@hotmail.com",
            password:"234"
        },{
            id:3,
            name: "Carol Venturi",
            email:"caroline@hotmail.com",
            password:"345"
        }
    ]
}

app.get("/games",auth, (req,res)=>{
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

app.post("/auth", (req,res)=>{
    var {email,password} = req.body; 
    if(email != undefined){

        var user = DB.users.find(u=> u.email == email);
        if(user!=undefined){

            if(user.password == password){

                jwt.sign({id: user.id , email: user.email}, jwtSecret, {expiresIn:'48h'}, (err, token)=>{
                    if(err){
                        res.status(400);
                        res.json({err:"Falha"});
                    }else{
                        res.status(200);
                        res.json({token: token});
                    }
                })
            }else{
                res.status(401);
                res.json({err:"Senha inválida!"});
            }
        

        }else{
            res.status(404);
            res.json({err:"O email não existe na base de dados!"})
        }
        
    }else{
        res.status(400);
        res.json({err:"Email inválido!"})
    }
})

app.listen(8080, ()=>{
    console.log("api rodando!");
});
