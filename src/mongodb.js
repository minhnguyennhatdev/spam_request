const {MongoClient} = require('mongodb')

var db;

module.exports = (() => {
  if (db) return db

  const client = new MongoClient('mongodb://localhost:27018/minigame?directConnection=true');

  client.connect()
  db = client.db('minigame');

  return {db}
})()
