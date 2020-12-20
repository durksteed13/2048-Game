const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static(__dirname));

app.use(bodyParser.json());

app.get('/', function(request, response){
    response.sendFile('index.html', { root: __dirname });
});

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log("Server is running on port 3000.");
});