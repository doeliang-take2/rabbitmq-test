var express = require('express');
var path = require('path');
var router = express.Router();
let order = require('../model/order');
let mongoose = require('mongoose');
const rabbitmq = require('./rabbitmq.js');

mongoose.connect('mongodb://localhost:27017/order_que', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



//每次提交一个order
router.post('/api/v1/order', function(req, res, next) {
  let price = req.body.price;
  console.log(price);
  order.count({},function (err,count) {
    console.log("count is "+ count);
    let oid = count+1;
    let o1 = new order({id: oid,price: parseInt(price),status:0});
    o1.save(function (err,doc) {
      if(!err){
        console.log("save correct");
        rabbitmq.init().then(connection=>{
          rabbitmq.produceDLX(connection,oid);
        });
        res.send(oid.toString());
      }
    });
  });
});

router.post('/api/v1/pay/:oid',function (req,res,next) {
  console.log("get orderid");
  let oid = req.body.oid;
  console.log(req.params.oid);
  order.findOneAndUpdate({id:parseInt(oid)},{status:1},function (err,result) {//设置状态为1，已支付
    if (!err){
      console.log('order finish');
      res.send();
    }
  })
});

router.get('/api/v1/orderlist',function (req,res,next) {
  order.find(function (err,result) {
    if (!err){
      console.log(result);
      res.json(result);
    }
  })
});


// 消费消息,监听死信队列
rabbitmq.init().then(connection => consumerDLX(connection));


async function consumerDLX(connnection){
  const testExchangeDLX = 'testExDLX';
  const testRoutingKeyDLX = 'testRoutingKeyDLX';
  const testQueueDLX = 'testQueueDLX';

  const ch = await connnection.createChannel();
  await ch.assertExchange(testExchangeDLX, 'direct', { durable: true });
  const queueResult = await ch.assertQueue(testQueueDLX, {
    exclusive: false,
  });
  await ch.bindQueue(queueResult.queue, testExchangeDLX, testRoutingKeyDLX);
  await ch.consume(queueResult.queue, msg => {
    console.log('consumer msg：', msg.content.toString());
    order.findOne({id:parseInt(msg.content.toString())},function (err,result) {
      if (!err){
        if (result.status==0){
          order.findOneAndUpdate({id:parseInt(msg.content.toString())},{status:2},function (err,result) {
            if(!err){
              console.log("this order expire and no pay");
            }
          })
        } else {
          console.log("this order have paid");
        }
      }
    });
  }, { noAck: true });
}

module.exports = router;
