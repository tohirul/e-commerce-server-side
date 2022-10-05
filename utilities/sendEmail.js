const nodeMailer = require("nodeMailer");

module.exports = async (options) => {
    const { email, subject, message } = options;
    // Use nodemailer to create and send the email in response to the user instantly
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        from: process.env.SMTP_MAIL,
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            // App login password Generated form Google Services
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
};
