const 
express = require("express"),
methodOverride = require("method-override"),
fs = require("fs"),
bodyParser = require("body-parser"),
users = require("./users.json"),
books = require("./books.json"),
app = express();

var loggedUser = null;


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.set("view engine","ejs");

//======= Login and Register =========

app.get("/",(req,res)=>{
    res.render("login");
});

app.post("/",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(checkUserExists(username,users)==false){
        res.send("User does not exist");
    }
    else{
        loggedUser = checkUserExists(username,users);
        if(loggedUser.password !== password){
            res.send("Password is incorrect");
        }
        else{
            res.redirect("/home");
        }
    }

})

app.get("/registration",(req,res)=>{
    res.render("registration");
});

app.post("/registration",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let user = 
    {
        username: username,
        password: password
    };
    
    if(checkUserExists(username,users) !== false){
        res.send("User already exists");
    }
    else{
        users["users"].push(user);
        fs.writeFileSync("users.json",JSON.stringify(users));
        res.redirect("/");
    }
   
});

//======= Home Page =======

app.get("/home",isLoggedIn,(req,res)=>{
    res.render("home");
});

//======== Search ========

app.post("/search",isLoggedIn,(req,res)=>{
    console.log(req.body.Search);
    let bookName = req.body.Search;
    res.render("searchresults");
})


app.get("/readlist",isLoggedIn,(req,res)=>{
    res.render("readlist");
});


//===== Books requests ======

app.get("/novel",isLoggedIn,(req,res)=>{
    res.render("novel");
});

app.get("/poetry",isLoggedIn,(req,res)=>{
    res.render("poetry");
});

app.get("/fiction",isLoggedIn,(req,res)=>{
    res.render("fiction");
});

app.get("/grapes",isLoggedIn,(req,res)=>{
    res.render("grapes");
});

app.get("/flies",isLoggedIn,(req,res)=>{
    res.render("flies");
});

app.get("/dune",isLoggedIn,(req,res)=>{
    res.render("dune");
});

app.get("/mockingbird",isLoggedIn,(req,res)=>{
    res.render("mockingbird");
});

app.get("/sun",isLoggedIn,(req,res)=>{
    res.render("sun");
});

app.get("/leaves",isLoggedIn,(req,res)=>{
    res.render("leaves");
});



function checkUserExists(username,users){
    for(let i=0;i<users["users"].length;i++){
            if(users["users"][i]["username"].toLowerCase() === username.toLowerCase()){        
                return users["users"][i];
            }
    }
    return false;
    
};

function isLoggedIn(req,res,next){
    // console.log(loggedUser);
    if(loggedUser !== null){
        return next();
    }
    else{
        res.redirect("/");
        console.log("login first");
    }
}



app.listen(3000, function(){
    console.log(loggedUser);
    // if(checkUserExists("mira",users) !== false){
    //     console.log("User already exists");
    // }
});