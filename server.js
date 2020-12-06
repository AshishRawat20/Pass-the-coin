const express = require('express'),
PORT = process.env.PORT || 8080,
path = require('path'),
app = express();

app.use(express.static("public"));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.set("view engine","ejs");

app.get('*',(req,res) =>{
    res.render("index.ejs");
})

app.listen(PORT,() => console.log(`Server Listening At PORT ${PORT}`))