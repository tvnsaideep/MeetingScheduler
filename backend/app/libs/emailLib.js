const nodemailer = require('nodemailer');

let sendEmail = (sendEmailOptions) => {
    let account = {
        user: 'msd.bunny09@gmail.com',
        pass: 'gmailsaideep7'
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    let mailOptions = {
        from:'"Meeting Scheduler" meetingscheduler@gmail.com',
        to: sendEmailOptions.email,
        subject: sendEmailOptions.subject,
        text: `Dear ${sendEmailOptions.name},
        Welcome to our Simpliest Meeting Scheduler application`,
        html: sendEmailOptions.html

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error);
        }
        else {
            console.log('Message Sent', info);
        }
    });
}

module.exports = {
    sendEmail: sendEmail
}