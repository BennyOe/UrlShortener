const {nanoid} = require("nanoid");
const redis = require("redis");
const client = redis.createClient();

// shorten a real URL
async function create(longUrl) {
  let dbLongUrl = await client.get(longUrl);
  if (dbLongUrl !== null) {
    // check if URL is already in db
    return dbLongUrl; // if URL is in db return shorturl
  } else {
    // if URL is not in db
    return intoDb(longUrl);
  }
}

async function intoDb(longUrl) {
  let shortUrl = "https://peter.de/" + nanoid(8);
  if ((await client.get(shortUrl)) == null) {
    // check if hash collision
    client.multi().set(shortUrl, longUrl).set(longUrl, shortUrl).exec();
    return client.get(longUrl);
  } else {
    // if collision call again
    intoDb(longUrl);
  }
}

// get the real URL from the shortened one
async function get(shortUrl) { return await client.get(shortUrl); }

// initialize redis db
async function initRedis() {
  client.on("error", (err) => console.log("Redis Client Error ", err));
  await client.connect();
}
module.exports = {
  create : create,
  get: get,
  initRedis: initRedis,
};
