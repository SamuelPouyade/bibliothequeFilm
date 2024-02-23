const amqp = require('amqplib');

class MessagingService {
    constructor(amqpUrl) {
        this.amqpUrl = amqpUrl || 'amqp://localhost';
    }

    async publishToQueue(queue, message) {
        const conn = await amqp.connect(this.amqpUrl);
        const channel = await conn.createChannel();

        await channel.assertQueue(queue, { durable: true });
        console.log(message)
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });

        console.log(` [x] Sent message to ${queue}`);

        await channel.close();
        await conn.close();
    }
}

module.exports = MessagingService;
