let express = require("express");
let app = express();
let path = require("path");

app.use(express.static(__dirname));

app.route("/")
.get((req, res) => {
    res.sendFile("./index.html");
});

app.route("/material-symbols/:path")
.get((req, res) => {
    res.sendFile(path.join(__dirname, `/node_modules/material-symbols/${req.params.path}`));
});

app.route("/@iconscout/unicons/css/:path")
.get((req, res) => {
    res.sendFile(path.join(__dirname, `/node_modules/@iconscout/unicons/css/${req.params.path}`));
});

app.route("/@iconscout/unicons/fonts/:type/:path")
.get((req, res) => {
    res.sendFile(path.join(__dirname, `/node_modules/@iconscout/unicons/fonts/${req.params.type}/${req.params.path}`));
});

app.listen(3000);