const express = require("express")
const app = express()
const http = require("http").createServer(app)
const port = process.env.PORT || 8000

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})
app.use("/", express.static(__dirname + "/public"))

http.listen(port)