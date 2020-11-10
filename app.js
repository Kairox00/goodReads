const 
express = require("express"),
methodOverride = require("method-override"),
fs = require("fs"),
bodyParser = require("body-parser"),
users = require("./users.json"),
books = require("./books.json"),
app = express();

loggedUser = null;


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
            console.log(loggedUser);
        }
    }

})

app.get("/registration",(req,res)=>{
    res.render("registration");
});

app.post("/registration",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let readList = [];
    let user = 
    {
        username: username,
        password: password,
        readList: []
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
    let results = getBook(books["books"], bookName);
    res.render("searchresults",{results: results});
})

//========= Read List ==========

app.get("/readlist",isLoggedIn,(req,res)=>{
    res.render("readlist",{loggedUser: loggedUser});
});

app.post("/readlist",(req,res)=>{
    let referer = req.get("referer")
    let name = truncate(referer);
    let link = "/" + name;
    let title = getTitle(books["books"], name);
    console.log(title);
    let book =
    {
        name: name,
        link: link,
        title: title
    }
    addToList(users["users"], loggedUser["username"], book);
    fs.writeFileSync("users.json",JSON.stringify(users));
    
    res.redirect("/readlist");
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
    
    if(loggedUser !== null){
        return next();
    }
    else{
        res.redirect("/");
        console.log("login first");
    }
}

function truncate (url){
    var res="";
    var start = false;
    for(var i = 0; i < url.length ; i++){
        if(start === true){
            // console.log("adding");
            res+= url[i];
            // console.log(url[i]);
            // console.log(res)
        }
        if(url[i] === "/" && (url[i+1] !== "/" && url[i-1] !== "/" ) && start === false){
            start = true;
        }
        
    }
    return res;
}

function addToList(usersList, loggedUsername, book){
    for(var i=0; i<usersList.length; i++){
        console.log(loggedUsername);
        console.log(usersList[i]["username"]);
        if(loggedUsername === usersList[i]["username"]){
            usersList[i]["readList"].push(book);
            console.log(book["name"]+" added");
        }
    }
    console.log("something went wrong");
}

function getTitle(booksList, name){
    for(var i=0; i<booksList.length; i++){
        if(booksList[i]["name"] === name){
            return booksList[i]["title"];
        }
    }
}

function getBook(booksList, searchWord){
    let results=[];
    for(var i=0; i<booksList.length; i++){
        let title = booksList[i]["title"].toLowerCase();
        searchWord = searchWord.toLowerCase();
        if(title.includes(searchWord)){
            results.push(booksList[i]);
        }
        else{
            if(searchWord.includes(title)){
                results.push(booksList[i]);
            }
        }
    }
    if(results.length !== 0){
        console.log("results: "+results);
        return results;
    }
    return false;
}


app.listen(3000, function(){
    console.log(loggedUser);
    console.log(users);
    // if(checkUserExists("mira",users) !== false){
    //     console.log("User already exists");
    // }
});