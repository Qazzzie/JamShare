const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3000;
const app = express();
const http = require("http").createServer(app);

//set listen port, and log it.
http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//Default routing path.
app.use(express.static(path.resolve(__dirname, "../client/build")));
