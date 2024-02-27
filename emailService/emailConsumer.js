require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const path = require('path');
const Boom  = require('@hapi/boom');


async function startConsumer() {
    const conn = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost');
    const channel = await conn.createChannel();

    const queue = 'notificationsQueue';
    await channel.assertQueue(queue, { durable: true });

    console.log(" [*] En attente de messages dans %s.", queue);

    await channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const messageData = JSON.parse(msg.content.toString());
            const to = messageData.usersEmails?.join(', ');

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
                        from: process.env.MAIL_USER,
                        to: messageData.email,
                        subject: 'Bienvenue !',
                        text: `Bonjour ${messageData.name}, bienvenue sur notre site !`,
                    };
                    break;
                case 'newFilm':
                    mailOptions = {
                        from: process.env.MAIL_USER,
                        to: to,
                        subject: `Nouveau film ajouté : ${messageData.title}`,
                        text: messageData.message,
                    };
                    break;
                case 'updateFilm':
                    mailOptions = {
                        from: process.env.MAIL_USER,
                        to: to,
                        subject: `Film modifié : ${messageData.title}`,
                        text: messageData.message,
                    };
                    break;
                case 'sendCsv':
                    mailOptions = {
                        from: process.env.MAIL_USER,
                        to: messageData.email,
                        subject: messageData.subject,
                        text: messageData.text,
                        attachments: [
                            {
                                filename: path.basename(messageData.filePath),
                                path: messageData.filePath
                            }
                        ],
                    };
                    break;
                default:
                    throw Boom.badRequest('Type de message inconnu: ' + messageData.type);
                    return;
            }

            console.log("Options de mail:", mailOptions);

            if (!mailOptions.to) {
                throw Boom.badRequest('Aucun destinataire spécifié');
            }

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`Email envoyé avec succès: ${info.messageId}`);
                console.log(`Lien de prévisualisation: ${nodemailer.getTestMessageUrl(info)}`);
                channel.ack(msg);
            } catch (error) {
                throw Boom.internal('Erreur lors de l\'envoi du mail', error);
            }
        }
    });
}

startConsumer();