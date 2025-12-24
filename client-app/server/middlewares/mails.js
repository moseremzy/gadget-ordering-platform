const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require("fs")
const nodemailer = require("nodemailer");


module.exports = class MIDDLEWARES {

  static async SendConfirmationMail(req, res, useremail, confirmationCode, fullname) {

    var smtpConfig = {
        host: 'smtppro.zoho.com',
        port:  465,
        secure: true,
        auth:{
            user: 'support@Bravexacore.com',
            pass: 'Bravexacore1.'
        }
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    // Point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/')
    };

    // Use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
        from: '"Tech By Cas" <support@bravexacore.com>', // sender address
        to: useremail,
        subject: 'Confirmation Email',
        attachments: [{
            filename: 'logo.png',
            path: './images/logo.png',
            cid: "logo"
        }],
        template: 'confirmation_mail', // the name of the template file i.e email.handlebars
        context: {
            confirmationCode: confirmationCode,
            fullname: fullname
        }
    };

    // Wrap sendMail in a Promise
    try {

       let result = await new Promise((resolve, reject) => {
      
        transporter.sendMail(mailOptions, (err, info) => {

            if (err) {

                reject(err);
        
            } else {
                
                resolve('Confirmation Email Was Resent');
            
            }
        });
      
      });

        return res.status(200).json({ // Success
            success: true,
            message: result,
            confirmationCode: confirmationCode
        }); 
    
      } catch (err) {
    
        return res.status(500).json({ // Failure
            success: false,
            message: "mail not delivered. please try again.",
        });  
    }
}




//Contact us Email
static async contact_us_email(req, res, email, firstname, lastname, phone, message) {

    const smtpConfig = {
        host: 'bravexacore.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'support@bravexacore.com',
            pass: 'Bravexacore1.'
        }
    };

var transporter = nodemailer.createTransport(smtpConfig);
      
      // point to the template folder
      const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/')
      };
      
      // use a template file with nodemailer
      transporter.use('compile', hbs(handlebarOptions));
      
      const mailOptions = {
        from: '"Tech By Cas" <support@bravexacore.com>', // sender address
        to: "agbaojemoses@gmail.com", //Tech By Cas email
        subject: 'User Complaint',
        attachments: [{
            filename: 'logo.png',
            path: './images/logo.png',
            cid: "logo"
        }],
        template: 'contactus_email', // the name of the template file i.e email.handlebars
        context:{
            email: email,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            message: message,
        }
      };      

     // Wrap sendMail in a Promise
     try {

     let result = await new Promise((resolve, reject) => {
      
            transporter.sendMail(mailOptions, (err, info) => {
        
              if (err) {
        
                 reject(err);
         
                } else {
                    
                  resolve("Your request has been recieved. We will get back to you as soon as possible via the email provided below. Thank you for choosing Tech By Cas.");
                
                }
            });
        });

        return res.status(200).json({ // Success
            success: true,
            message: result,
        }); 
    
      } catch (err) {
    
        return res.status(500).json({ // Failure
            success: false,
            message: "mail not delivered. please try again.",
        });
    }
}




 

//Password Reset  Email
static async send_reset_pass_email(req, res, useremail, token, firstname) {

    const smtpConfig = {
        host: 'techbycas.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'support@techbycas.com',
            pass: 'Techbycas1.'
        }
    };


var transporter = nodemailer.createTransport(smtpConfig);
      
      // point to the template folder
      const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/')
      };
      
      // use a template file with nodemailer
      transporter.use('compile', hbs(handlebarOptions));
      
      var mailOptions = {
        from: '"Tech By Cas" <support@techbycas.com>', // sender address
        to: useremail,
        subject: 'Reset Password',
        attachments: [{
             filename: 'logo.png',
             path: './images/logo.png',
             cid: "logo"
       }],
        template: 'password_reset_mail', // the name of the template file i.e email.handlebars
        context:{
            token: token,
            firstname: firstname
        }
      };      
        // Wrap sendMail in a Promise
     try {

       let result = await new Promise((resolve, reject) => {
      
            transporter.sendMail(mailOptions, (err, info) => {
        
              if (err) {
        
                 reject(err);
         
                } else {
                 
                 resolve(`We’ve sent a password reset link to your email address.
                  Please check your inbox (and spam folder) and follow the instructions to create a new password.
                  If you don’t receive the email within a few minutes, try again or contact support.`);
        
                }
            });
        });

        return res.status(200).json({ // Success
            success: true,
            message: result,
        }); 
    
      } catch (err) {

        return res.status(500).json({ // Failure
            success: false,
            message: "mail not delivered. please try again.",
        });

    }
}

}