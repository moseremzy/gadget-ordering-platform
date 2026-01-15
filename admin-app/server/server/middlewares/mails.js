const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require("fs")
const nodemailer = require("nodemailer");



module.exports = class MIDDLEWARES {

  static async SendConfirmationMail(req, res, useremail, confirmationCode) {

    var smtpConfig = {
        host: 'smtppro.zoho.com',
        port:  465,
        secure: true,
        auth:{
            user: 'support@lavexacore.com',
            pass: 'Lavexacore1.'
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
        from: '"Tech By Cas" <support@lavexacore.com>', // sender address
        to: useremail,
        subject: 'Admin Confirmation Email',
        attachments: [{
            filename: 'logo.png',
            path: './images/logo.png',
            cid: "logo"
        }],
        template: 'confirmation_mail', // the name of the template file i.e email.handlebars
        context: {
            confirmationCode: confirmationCode,
            email: useremail
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


   

//Password Reset  Email
static async send_reset_pass_email(req, res, useremail, token) {

    const smtpConfig = {
        host: 'lavexacore.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'support@lavexacore.com',
            pass: 'Lavexacore1.'
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
        from: '"Tech By Cas" <support@lavexacore.com>', // sender address
        to: useremail,
        subject: 'Reset Password',
        attachments: [{
             filename: 'logo.png',
             path: './images/logo.png',
             cid: "logo"
       }],
        template: 'password_reset_mail', // the name of the template file i.e email.handlebars
        context:{
            token: token
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



//send order cancellation email to user
static async send_user_cancellation_email(req, res, useremail, fullname, order_id, reason) {
    
    var smtpConfig = {
        host: 'mail.xnfthub.com', // Zoho SMTP host
        port: 465, // SSL port
        secure: true, // Use SSL
        auth: {
            user: 'support@xnfthub.com', // Replace with your Zoho email address
            pass: 'Xnfthub1..' // Use your Zoho app-specific password (if you have 2FA enabled)
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
      from: '"Tech By Cas" <support@xnfthub.com>', // sender address
      to: useremail,
      subject: 'Order Cancellation',
      attachments: [{
          filename: 'logo.png',
          path: './images/logo.png',
          cid: "logo"
      }],
      template: 'user_order_cancellation_email', // the name of the template file i.e email.handlebars
      context: {
          order_id: order_id,
          fullname: fullname,
          cancellation_reason: reason
      }
  };

  // Wrap sendMail in a Promise
  try {

    let result = await new Promise((resolve, reject) => {
      
        transporter.sendMail(mailOptions, (err, info) => {
    
          if (err) {
    
             reject(err);
     
            } else {
             
             resolve(`success`);
    
            }
        });
    });

    return res.status(200).json({ // Success
        success: true,
        message: result,
    }); 

  } catch (err) {

    return res.status(500).json({ // send 200 regardless. dont want it to break my ui
        success: false,
        message: err.message,
    });

  }

 } 
 
}