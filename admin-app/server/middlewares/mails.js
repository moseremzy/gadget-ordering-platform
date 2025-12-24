const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require("fs")
const nodemailer = require("nodemailer");



module.exports = class MIDDLEWARES {

   
//Password Reset  Email
static async send_reset_pass_email(req, res, useremail, token) {

    const smtpConfig = {
        host: 'kelvinspice.com.ng',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'support@kelvinspice.com.ng',
            pass: 'kelvinspice1.'
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
        from: '"Taste It" <support@kelvinspice.com.ng>', // sender address
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
            firstname: "Admin"
        }
      };      
        // Wrap sendMail in a Promise
     try {

        await new Promise((resolve, reject) => {
      
            transporter.sendMail(mailOptions, (err, info) => {
        
              if (err) {
        
                 reject(err);
         
                } else {
                    
                  resolve(info);
                
                }
            });
        });

        return { message: "mail sent"}; // Success
    
      } catch (err) {
    
        return { message: "error occured"}; // Failure
    }
}



//send order cancellation email to user
static async send_user_cancellation_email(req, res, useremail, firstname, order_id, reason) {
  const smtpConfig = {
      host: 'kelvinspice.com.ng',
      port: 465,
      secure: true, // use SSL
      auth: {
          user: 'support@kelvinspice.com.ng',
          pass: 'kelvinspice1.'
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
      from: '"Taste It" <support@kelvinspice.com.ng>', // sender address
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
          firstname: firstname,
          cancellation_reason: reason
      }
  };

  // Wrap sendMail in a Promise
  try {

      await new Promise((resolve, reject) => {
    
          transporter.sendMail(mailOptions, (err, info) => {
      
            if (err) {
      
               reject(err);
       
              } else {
                  
                resolve(info);
              
              }
          });
      });

      return { message: "mail sent"}; // Success
  
    } catch (err) {
  
      return { message: "could not send email"}; // Failure
  }

}
 
}