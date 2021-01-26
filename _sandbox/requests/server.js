const express = require("express")
const app = express()
const http = require("http").createServer(app)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
app.use("/", express.static(__dirname))

http.listen(8000)