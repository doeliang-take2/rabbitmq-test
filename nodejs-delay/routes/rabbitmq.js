const amqp = require('amqplib');
let connection = null;
module.exports = {
    connection,

    init: () => amqp.connect('amqp://localhost').then(conn => {
        connection = conn;

        console.log('rabbitmq connect success');

        return connection;
    }),

    // consumerDLX: async (connnection) =>{
    //     const testExchangeDLX = 'testExDLX';
    //     const testRoutingKeyDLX = 'testRoutingKeyDLX';
    //     const testQueueDLX = 'testQueueDLX';
    //
    //     const ch = await connnection.createChannel();
    //     await ch.assertExchange(testExchangeDLX, 'direct', { durable: true });
    //     const queueResult = await ch.assertQueue(testQueueDLX, {
    //         exclusive: false,
    //     });
    //     await ch.bindQueue(queueResult.queue, testExchangeDLX, testRoutingKeyDLX);
    //     await ch.consume(queueResult.queue, msg => {
    //         console.log('consumer msg：', msg.content.toString());
    //     }, { noAck: true });
    // },

    produceDLX: async (connection,oid) => {
        const testExchange = 'testEx';
        const testQueue = 'testQu';
        const testExchangeDLX = 'testExDLX';
        const testRoutingKeyDLX = 'testRoutingKeyDLX';

        const ch = await connection.createChannel();
        await ch.assertExchange(testExchange, 'direct', {durable: true});
        const queueResult = await ch.assertQueue(testQueue, {
            exclusive: false,
            deadLetterExchange: testExchangeDLX,
            deadLetterRoutingKey: testRoutingKeyDLX,
        });
        await ch.bindQueue(queueResult.queue, testExchange);
        const msg = oid.toString();
        const msg1 = 'hello world1';
        const msg2 = 'hello world2';
        console.log('producer msg：', msg);
        await ch.sendToQueue(queueResult.queue, new Buffer(msg), {
            expiration: '7200000'
            //expiration: '10000'
        });
        // await ch.sendToQueue(queueResult.queue, new Buffer(msg1), {
        //     expiration: '10000'
        // });
        // await ch.sendToQueue(queueResult.queue, new Buffer(msg2), {
        //     expiration: '20000'
        // });
        ch.close();
    }
};
