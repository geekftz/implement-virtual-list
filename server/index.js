const Mock = require('mockjs');
const express = require('express');
const app = express();

// 生成num条数据
function generatorList(num) {
  return Mock.mock({
    [`list|${num}`]: [
      {
        // mock id
        'id|+1': 1,
        title: '@ctitle(15|25)',
        image: '@natural(0,15)',
        reads: '@natural(0, 99999)',
        from: '@ctitle(3, 10)',
        date: '@date("yyyy-MM-dd")',
      },
    ],
  });
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/data', async function (req, res) {
  const { num } = req.query;

  await sleep(100);
  return res.send(generatorList(num));
});

const server = app.listen(4000, function () {
  console.log('本地 mock服务 启动，接口地址为 http://localhost:4000/data?num=请求数');
});
