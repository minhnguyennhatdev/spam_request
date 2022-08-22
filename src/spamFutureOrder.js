const _ = require('lodash')
const fs = require('fs')
const axios = require('axios')
const {} = require('date-fns')

const { parseInt } = require('lodash')

axios.defaults.baseURL = 'http://127.0.0.1:5002'
axios.defaults.headers.common['fakeauthorization'] = 1

const symbol = 'BTCVNDC'

async function getMarkPrice() {
  return axios
    .get(`/api/v3/futures/ticker?symbol=${symbol}`)
    .then((res) => res.data.data[0].p)
}

async function mockRequest(userId = 1, method = 'POST', id, data) {
  const options = {
    method: method,
    url: `/api/v3/futures/vndc/order`,
    data: _.defaults(data, {
      displaying_id: id,
      leverage: 2,
      side: _.sample(['Buy', 'Sell']),
      type: 'Market',
      symbol,
      quoteQty: 100000,
      useQuoteQty: true,
    }),
    headers: {
      fakeauthorization: userId,
    },
  }

  await axios(options)
    .then(async (res) => {
      console.log('place order:', res.data.status)
      if (res.data.status === 'TOO_MANY_REQUESTS') {
        console.time('check 2222 ')
        await new Promise((rs) => setTimeout(rs, 5000))
        console.timeEnd('check 2222 ')
      }
    })
    .catch(console.log)
}

async function getListOrderOpen(userId) {
  return axios({
    method: 'GET',
    url: `/api/v3/futures/vndc/order`,
    params: {
      symbol,
      status: 0,
      pageSize: 100,
    },
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      fakeauthorization: userId,
    },
  })
    .then((res) => res.data.data.orders)
    .catch(console.log)
}

async function closeAllOrder(orders) {
  for (const o of orders) {
    console.log(o.displaying_id, '1111111')
    await axios
      .delete(`/api/v3/futures/vndc/order`, {
        data: {
          displaying_id: o.displaying_id,
          special_mode: 1,
        },
      })
      .then((res) => {
        console.log('delete', res.data.status)
      })
      .catch(console.log)
  }
}

async function modifiTPSL(orders) {
  const price = await getMarkPrice()
  console.log(price, '0120120102')
  for (const o of orders) {
    const l = parseInt(price - price * _.random(0.05, 0.2))
    const h = parseInt(price + price * _.random(0.05, 0.2))
    await axios
      .put(`/api/v3/futures/vndc/order`, {
        tp: o.side === 'Buy' ? h : l,
        sl: o.side === 'Buy' ? l : h,
        displaying_id: o.displaying_id,
      })
      .then((res) => {
        console.log('modify', res.data.status)
      })
      .catch(console.log)
  }
}

async function updateOrder(userId) {
  let orders = await getListOrderOpen(userId)
  orders = _.shuffle(orders)

  const modifies = orders.splice(0, _.random(3, 6))
  const closes = orders.splice(0, _.random(2, 5))

  await Promise.all([modifiTPSL(modifies), closeAllOrder(closes)])
}

module.exports = {
  closeAllOrder,
  mockRequest,
  getListOrderOpen,
  getMarkPrice,
  updateOrder,
}


let userIds = [1,2,4,5,6,16,21,24,27,42,56,128,608,612,1101,1234,1571,2318,3333,3838,8888,503271,503280,503281,503283,503292,503294,503296,503297,503310,503311,503314,503315,503316,503323,503324,503333,553144,553181,553400,553872,554272,555159,581691,582637,582960,582985,582986,582987,582988,582989,582990,582991,582993,582994,582995,582996,582997,582998,582999,583000,583004,583010,583011,583012,583013,583015,583016,583017,583018,583019,583020,583021,583022,583023,583024,583025,583026,583027,583028,583029,583030,583031,583032,583033,583034,583035,583036,583037,583038,583039,583040,583041,583042,583043,583045,583047,583049,583052,583053,583056,583057,583058,583059,583002,999,583051,582961,888,582962]

userIds = userIds.slice(0, 2)

async function mock(userId) {
  for (let i = 0; i < 4; i++) {
    await mockRequest(userId)
    await new Promise((rs) => setTimeout(rs, 500))
  }
  await updateOrder(userId)
  await new Promise((rs) => setTimeout(rs, 500))
}

async function mocks() {
  await Promise.all(userIds.map(async (userId) => mock(userId)))
  await new Promise((rs) => setTimeout(rs, 1000))
  await mocks()
}

mocks()

