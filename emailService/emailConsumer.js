require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

async function startConsumer() {
    const conn = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost');
    const channel = await conn.createChannel();

    const queue = 'notificationsQueue';
    await channel.assertQueue(queue, { durable: true });

    console.log(" [*] En attente de messages dans %s.", queue);

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const messageData = JSON.parse(msg.content.toString());

            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: process.env.MAIL_SECURE === 'true',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            let mailOptions;

            switch (messageData.type) {
                case 'welcome':
                    mailOptions = {
                        from: 'samuel.pouyade@example.com',
                        to: messageData.email,
                        subject: 'Bienvenue !',
                        text: `Bonjour ${messageData.name}, bienvenue sur notre site !`,
                    };
                    break;
                case 'newFilm':

                    mailOptions = {
                        from: 'samuel.pouyade@example.com',
                        to: to,
                        subject: `Nouveau film ajouté : ${messageData.title}`,
                        text: messageData.message,
                    };
                    break;
                case 'updateFilm':
                    mailOptions = {
                        from: 'samuel.pouyade@example.com',
                        to: to,
                        subject: `Film modifié : ${messageData.title}`,
                        text: messageData.message,
                    };
                    break;
                default:
                    console.error("Type de message inconnu:", messageData.type);
                    channel.ack(msg);
                    return;
            }

            console.log("Options de mail:", mailOptions);

            if (!mailOptions.to) {
                console.error("L'adresse email du destinataire est manquante ou vide.");
                channel.ack(msg);
                return;
            }

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`Email envoyé avec succès: ${info.messageId}`);
                console.log(`Lien de prévisualisation: ${nodemailer.getTestMessageUrl(info)}`);
                channel.ack(msg);
            } catch (error) {
                console.error("Erreur lors de l'envoi de l'email:", error);
                channel.nack(msg);
            }
        }
    });
}

startConsumer();