const express = require("express");
const ShortUrl = require("./shortUrl");
const app = express();
const port = 3000;

app.use(express.urlencoded());

app.listen(port, () => { console.log("App lisening on port " + port); });
ShortUrl.initRedis();

app.get("/",
        (req, res) => { res.sendFile("/index.html", {root : __dirname}); });

app.post(
    "/shortUrls",
    async (req, res) => { res.send(await ShortUrl.create(req.body.longUrl)); });

// TODO: change method to GET
app.post("/longUrls", async (req, res) => {
  let longUrl = await ShortUrl.get(req.body.shortUrl);
  res.redirect(longUrl);
});
