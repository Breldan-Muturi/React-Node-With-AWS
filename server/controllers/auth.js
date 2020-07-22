const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { registerEmailParams } = require('../helpers/email'); 

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const ses = new AWS.SES({apiVersion: '2010-12-01'});


exports.register =  (req, res) => {
    // console.log('REGISTER CONTROLLER' , req.body);
    const {name, email, password } = req.body;
    //check if user exists in our database
    User.findOne({email}).exec((err, user) =>{
        if(user){
            return res.status(400).json({
                error: 'Email is Taken'
            });
        }
        //Generate Json Web Token with username emailand password.
        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '15m'
        });

        //Send Email
        const params = registerEmailParams(email, token);

        const sendEmailOnRegister = ses.sendEmail(params).promise();
        
        sendEmailOnRegister
            .then(data => {
                console.log('Email Submitted to SES', data);
                // res.send('Email Sent');
                res.json({
                    message: `Email has been sent to ${email}, Follow the instructions to Complete Your Registration`
                });
            })
            .catch(error => {
                console.log('Ses email on register', error);
                // res.send('Email Failed');
                res.json({
                    error: `We could not verify your email. Please try again`
                });
            });

    });
};