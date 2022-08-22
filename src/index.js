const axios = require("axios")
const _ = require('lodash')
const { db } = require('./mongodb')

axios.defaults.baseURL = 'http://127.0.0.1:5002'
axios.defaults.headers.common['fakeauthorization'] = 583079

function generateRandom(min = 0, max = 100) {
  // find diff
  let difference = max - min;

  // generate random number 
  let rand = Math.random();

  // multiply with difference 
  rand = Math.floor( rand * difference);

  // add with min value 
  rand = rand + min;

  return rand;
}

function generateTP(price) {
  return parseInt(price + price * _.random(1/100, 2/100))
}
function generateSL(price) {
  return parseInt(price - price * _.random(1/100, 2/100))
}

function insertData (count) {
  const price = 564064227
  // try {
  const dto = {
    "user_id": 583079,
    "leverage": 125,
    "price": Math.round(price - price * 0.562212675288516/100),
    "quantity": 0.001,
    "side": "Buy",
    "sl": price - 10000,
    "symbol": "BTCVNDC",
    "tp": price - 20000,
    "type": "Limit",
    "displaying_id": count,
    "status": 1,
     
    "profit": 137379.466148,
    "raw_profit": 144196.7,
    "promote_program": 0,
    "transfer_error": 0,
    "retry_transfer_count": 0,
    "open_mode": 0,
    "open_limit_price": 0,
    "close_mode": 0,
    "close_limit_price": 0,
    "retry_modify_limit_count": 0,
    "transfer_quantity": 0.01,
    "hold_quantity": 0,
    "promotion_category": 1,
    "user_category": 1,
    "liquidity_broker": "NAMI",
    "open_price": Math.round(price - price * 0.562212675288516/100),
    "fee": 6817.233851999999,
    "fee_currency": 72,
    "margin": 560892.986,
    "margin_currency": 72,
    "order_value": 5608929.86,
    "order_value_currency": 72,
    "fee_metadata": {
      "place_order": {
        "value": 3365.357916,
        "currency": 72
      },
      "close_order": {
        "value": 3451.875936,
        "currency": 72
      }
    },
    "request_id": {
      "place": "Req_ETHG21"
    },
  }

  return dto

  //   const options = {
  //     method: 'POST',
  //     url: `/api/v3/futures/vndc/order`,
  //     data: dto,
  //   }
  //   await axios(options).then(async (res) => {
  //     return res.data
  //   }).catch(console.log)
  // } catch (error) {
  //   console.log(error)
  // }
}

async function spamFutureOrder () {
  try {
    
  } catch (error) {
    
  }
}

async function main() {
  const futureorders = db.collection('futureorders')
  const count = await futureorders.countDocuments()
  const n  = 500
  let data = []
  for (let i = 0; i < n; i ++) {
    const id = parseInt(count) + i + 100000
    // const newData = await futureorders.insertMany(insertData)
    data.push(insertData(id))
  }
  await futureorders.insertMany(data, function(error, docs) {
    if(error) console('ERROR__', error)
  })
  console.log('DONE')
}

main()