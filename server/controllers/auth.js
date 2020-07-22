const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const ses = new AWS.SES({apiVersion: '2010-12-01'});


exports.register =  (req, res) => {
    // console.log('REGISTER CONTROLLER' , req.body);
    const {name, email, password } = req.body;
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data:`<html><body><h1>Hello ${name}</h1 style=color="red"><p>Test Email</p></body></html>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `Complete Your Registration`,
            }
        }
    };

    const sendEmailOnRegister = ses.sendEmail(params).promise()
    
    sendEmailOnRegister
        .then(data => {
            console.log('Email Submitted to SES', data)
            res.send('Email Sent');
        })
        .catch(error => {
            console.log('Ses email on register', error)
            res.send('Email Failed');
        })
};