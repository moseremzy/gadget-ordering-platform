const hbs = require('nodemailer-express-handlebars');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const fs = require("fs");
const { render } = require("express/lib/response");
const path = require("path")
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const axios = require("axios");
const db = require("../middlewares/database")
const HELPERS = require("../middlewares/helpers.js");
const MAILS = require("../middlewares/mails.js");
const { count } = require('console');
const PAYSTACK_KEY = process.env.PAYSTACK_API_KEY


module.exports = class API {


//POST REQUESTS

//register users
static async register(req, res) {

    let temporal_data = req.body;

    const data = {

      fullname: temporal_data.fullname,

      phone: temporal_data.phone,
      
      email: temporal_data.email,
      
      password: temporal_data.password
    
    }

    try {

    const user_query = `SELECT * FROM users WHERE email = ?`;

    const user = await new Promise( (resolve, reject) => {

      db.query(user_query, [data.email], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

     
   if (user.length > 0) { //if another user get this email before

      return res.status(400).json({ // Failure
        success: false,
        message: "email already exists"
      }); 
        
    } else { //insert user for db

     data.password = await bcrypt.hash(data.password, 12); //encrypt the password

     data.confirmation_code = uuidv4() //create uniq confirmation code

     delete data.confirm_password

     const sql = 'INSERT INTO users SET ?'

      await new Promise( (resolve, reject) => {

      db.query(sql, data, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve()

        }

      })

    })

     return await MAILS.SendConfirmationMail(req, res, data.email, data.confirmation_code, data.fullname)
   
    }
        
    } catch (error) { //if there was an error at any point

     return res.status(500).json({ // Failure
      success: false,
      message: "error occured"
     }); 

    }

}




 //login users
 static async login(req, res) {
   
  const data = req.body

  let this_user = null

  let date = new Date()

  try {

  const user_query = `SELECT * FROM users WHERE email= ?`

  const user = await new Promise( (resolve, reject) => {

    db.query(user_query, [data.email], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  
  if (user[0]) { //if the user dey

  const isMatch = await bcrypt.compare(data.password, user[0].password); //decrypt he password, make u compare am with this one entered

  if (!isMatch) { //if password no match

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
    
  } else { //if he match 

    if (user[0].account_status === "Unverified") { //if user neva verify account
      
    this_user = user[0]

    return res.status(403).json({
      success: false,
      message: "Account not verified. Please verify your email",
      isAuthenticated: req.session.isAuthenticated,
      user: this_user
    });
      
    } else { //if account verified, log am in

    date.setHours(date.getHours() + 2); // session expires in 2 hours

    req.session.cookie.expires = date;
  
    req.session.user_id = user[0].user_id; //set user id for session

    req.session.isAuthenticated = true   

    this_user = {
         fullname: user[0].fullname,
         email: user[0].email,
         phone: user[0].phone,
         delivery_address: user[0].address

    }

    return res.status(200).json({
      success: true,
      message: "success",
      user: this_user,
      isAuthenticated: true
    });

    }

  }
     
  } else { //if user no dey

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });

  }
      
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });         

  }

}




// Resend Confirmation Email
static async ResendConfirmationMail (req, res) {

  const confirmationEmail = req.body.confirmationEmail //i dey use d email too just incase user wan verify through register or login page. since confirmation code no dey available for those pages

  try {

    const user_query = `SELECT * FROM users WHERE email= ?`

    const user = await new Promise( (resolve, reject) => {

      db.query(user_query, [confirmationEmail], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })
   
   if (user.length > 0) { //if the user dey
     
      return await MAILS.SendConfirmationMail(req, res, user[0].email, user[0].confirmation_code, user[0].fullname)

    } else { //if e no dey

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }

  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });    

  } 

}



 //send contact us email
static async contact_us (req, res) {

  const {email, firstname, lastname, phone, message} = req.body;

  await MAILS.contact_us_email(req, res, email, firstname, lastname, phone, message)    
  
}



//send reset password email to user
static async send_reset_pass_email (req, res) {

  let data = req.body

  try {

    const user_query = `SELECT * FROM users WHERE email= ?`

    const user = await new Promise( (resolve, reject) => {
  
      db.query(user_query, [data.email], (err, result) => {
  
        if (err) {
  
          reject(err)
        
        } else {
  
          resolve(result)
  
        }
  
      })
  
    })
  
    
  if (user[0]) { //if the user dey

   const token = uuidv4()

   const password_reset_token = `UPDATE users 
    SET password_reset_token = ? 
    WHERE email = ?`;

      await new Promise( (resolve, reject) => { //update user password token

        db.query(password_reset_token, [token, data.email], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

   await MAILS.send_reset_pass_email(req, res, user[0].email, token, user[0].firstname)
   
   } else { //if email no dey, just still tell dem say i don send am, make dem for rest

    return res.status(401).json({
      success: false,
      message: "We cannot find your email",
    });

   }

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });  
    
  }

}


//submit order
static async submit_order(req, res) {

    const data = req.body;

    let products = JSON.parse(data.products)

    let authorization_info;

    try {

      data.confirmation_pin = HELPERS.generateConfirmationPin()

      data.user_id = req.session.user_id


      async function DerivedProducts(products) { //This function helps updates products with latest stock_quantity values

        let counter = 0;

        while (counter < products.length ) {
    
        const product_query = `SELECT * FROM products WHERE product_id= ?`
    
        const product = await new Promise( (resolve, reject) => {
      
          db.query(product_query, [products[counter].product_id], (err, result) => {
      
            if (err) {
      
              reject(err)
            
            } else {
      
              resolve(result)
      
            }
      
          })
      
        })
    
        if (product[0]) { //if you find am for db
    
          products.forEach((item) => { //update the stock quantity of products array for each object
    
            item.product_id == products[counter].product_id ? item.stock_quantity = product[0].stock_quantity : null
    
          })
    
        }
    
        counter++;
          
      }

      return products        
    
    }


    async function keep_for_db(data, orderData) { //keep item for db

      const sql = 'INSERT INTO orders SET ?'

      const order_id = await new Promise( (resolve, reject) => { //enter order in orders table
  
        db.query(sql, orderData, (err, result) => {
  
          if (err) {
  
            reject(err)
          
          } else {
  
            resolve(result.insertId)
  
          }
  
        })
  
      })

      if (typeof data.products === "string") {
        
        data.products = JSON.parse(data.products);
      
      }
      
      const orderItems = data.products.map(item => [
          order_id,
          item.product_id,
          item.quantity,
          item.price
      ]);


      const itemsSql = `
       INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES ?
      `; //enter each item in order items table

      await new Promise( (resolve, reject) => {
  
        db.query(itemsSql, [orderItems], (err, result) => {
  
          if (err) {
  
            reject(err)
          
          } else {
  
            resolve()
  
          }
  
        })
  
     })

     return res.status(200).json({
      success: true,
      message: "success",
      confirmation_pin: data.confirmation_pin,
      authorization_info: authorization_info
    });

  }

  switch (data.payment_method) {

    case 'cash on delivery':

    const orderData = {
      user_id: req.session.user_id,
      total_amount: data.total_amount,
      payment_method: data.payment_method,
      total_items: data.total_items,
      delivery_fee: data.delivery_fee,
      confirmation_pin: data.confirmation_pin
    };

    const stockError = HELPERS.stock_availability(await DerivedProducts(products));

    if (stockError) {
      return res.status(400).json({
        success: false,
        message: stockError
      });
    }

    await keep_for_db(data, orderData)
    
    break;

  case 'card payment':

    const params = {  // Payload for Paystack
        email: data.email,
        amount: data.total_order_cost * 100,
        reference: `${data.order_id}`, // Use your order ID as the reference
        metadata: {
            name: data.customer_name,
            phone: data.phone,
            confirmation_pin: data.confirmation_pin,
        },
        callback_url: "https://mosesfoodorderingapp.kelvinspice.com.ng/account/payment-verification",
    };

    try {
      // Send POST request to Paystack
      const response = await axios.post(
          'https://api.paystack.co/transaction/initialize',
          params,
          {
              headers: {
                  Authorization: `Bearer ${PAYSTACK_KEY}`, // Your Paystack secret key
                  'Content-Type': 'application/json',
              },
          }
      );

        authorization_info = response.data

        authorization_info.status == true ?
        
        await keep_for_db(data) : message = "error occured" //only keep the data if authorization url was created succcsefully

      } catch (error) {

        return res.status(500).json({
          success: false,
          message: "Problem connecting to paystack",
        });    

      }

      break;

  } //close switch block
    
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "an error occured. try again.",
    });  
    
  }

}



//reset password
static async reset_password (req, res) {

  const password = req.body.password

  const token = req.body.token

  try {

  const token_query = `SELECT * FROM users WHERE password_reset_token= ?`

    const user = await new Promise( (resolve, reject) => {
  
      db.query(token_query, [token], (err, result) => {
  
        if (err) {
  
          reject(err)
        
        } else {
  
          resolve(result)
  
        }
  
      })
  
    })
  
    
  if (user[0]) { //if token exist for a user

  let hashed_pass = await bcrypt.hash(password, 12); //change user password

  const password_reset_token = `UPDATE users 
      SET password_reset_token= ?,
      password= ?
      WHERE email= ?`

      await new Promise( (resolve, reject) => { //update user password token

        db.query(password_reset_token, ['', hashed_pass, user[0].email], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

    return res.status(200).json({
      success: true,
      message: "success",
    });
    
  } else { //if token no exist

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  }

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });  
    
  }

}



//GET REQUESTS

//fetch user
static async fetch_user (req, res) {

  try {

    const user_id = req.session.user_id;

    const user_query = `SELECT * FROM users WHERE user_id=?`;

    const user = await new Promise((resolve, reject) => {
      db.query(user_query, [user_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // User not found or unverified
    if (user.length < 1 || user[0].account_status === "Unverified") {
      return res.status(401).json({
        success: false,
        message: "User not found or unverified.",
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: "success",
      user: {
        fullname: user[0].fullname,
        email: user[0].email,
        phone: user[0].phone,
        state: user[0].state,
        city: user[0].city,
        address: user[0].address,
      },
      isAuthenticated: true
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching user.",
    });
  }
}




//fetch products
static async fetch_products (req, res) {
 
  try {

    const products_query = `SELECT 
      product.product_id,
      product.name,
      product.description,
      product.product_condition,
      product.stock_quantity,
      product.price,
      product.main_image,
      category.name AS category_name
    FROM products AS product
    JOIN categories AS category
    ON product.category_id = category.category_id`;
  
    let all_products = await new Promise( (resolve, reject) => {

      db.query(products_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

    return res.status(200).json({ // Success
      success: true,
      message: "success",
      all_products
    });
    
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Error loading data. please try again.",
    });

  }

}



//fetch categories
static async fetch_categories (req, res) {
 
  try {

    const categories_query = `SELECT * FROM categories`;
  
    let all_categories = await new Promise( (resolve, reject) => {

      db.query(categories_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

    return res.status(200).json({ // Success
      success: true,
      message: "success",
      all_categories
    });
    
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Error loading data. please try again.",
    });

  }

}


//fetch settings
static async fetch_settings (req, res) {
 
  try {

    const settings_query = `SELECT * FROM settings`;
  
    let all_settings = await new Promise( (resolve, reject) => {

      db.query(settings_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

    return res.status(200).json({ // Success
      success: true,
      message: "success",
      all_settings: {
        store_state: all_settings[0].store_state,
        store_city: all_settings[0].store_city,
        fee_same_state: all_settings[0].fee_same_state,
        fee_same_city: all_settings[0].fee_same_city,
        fee_other_state: all_settings[0].fee_other_state
      }
    });
    
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Error loading data. please try again.",
    });

  }

}



//fetch orders
static async fetch_orders (req, res) {
 
  try {

  const orders_query = `SELECT * FROM orders WHERE user_id = ? ORDER BY order_id DESC`;

  let all_orders = await new Promise( (resolve, reject) => {

    db.query(orders_query, [req.session.user_id], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })


    const order_items_query = `SELECT 
      o.order_id,
      o.order_status,
      o.created_at,
      o.total_amount,
      p.name,
      p.main_image,
      oi.quantity,
      oi.price
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.user_id = ?;
    `;
  
    let all_order_items = await new Promise( (resolve, reject) => {

      db.query(order_items_query, [req.session.user_id], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })


    return res.status(200).json({ // Success
      success: true,
      message: "success",
      all_order_items,
      all_orders
    });
    
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error loading data. please try again.",
    });

  }

}


// verify user card payment manually
static async verify_payment (req, res) {

  const { reference } = req.params;

  let status, description;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
      },
    });

    const paymentData = response.data.data;

    if (["ongoing", "pending", "processing", "queued"].includes(paymentData.status)) {

      description = 'The payment has been initiated but is awaiting confirmation from the payment gateway'

      status = 'Payment Pending'

    } else if (["abandoned"].includes(paymentData.status)) {

      description = 'The payment process was not completed. No payment attempt was recoreded'

      status = 'Payment Abandoned'

    } else if (["failed"].includes(paymentData.status)) {

      description = paymentData.gateway_response

      status = 'Payment Failed'

    } else if (["reversed"].includes(paymentData.status)) {

      description = 'The payment has been reversed'

      status = 'Payment Reversed'

    } else { //success

      description = 'Your Order Has Been Recieved And is Awaiting Confirmation'

      status = 'Pending'

    }

    const order_query = `UPDATE orders 
      SET status= ?,
      description= ?
      WHERE order_id= ?`

      await new Promise( (resolve, reject) => {

        db.query(order_query, [status, description, reference], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })
    

    if (paymentData.status === "success") { //if verification na success

      res.json({ message: "Payment successful", data: paymentData });
    
    } else { //if na anyother status including fail

      res.status(400).json({ message: "Payment verification failed", data: paymentData });

    }

  } catch (error) {

    res.status(500).send("Error verifying payment");

  }

}




//verify payment using webhook
static async paystack_webhook (req, res) {
 
    
  try {

      let order_query;
      
      // Verify the signature
      const hash = crypto.createHmac('sha512', PAYSTACK_KEY).update(JSON.stringify(req.body)).digest('hex');
      
      if (hash != req.headers["x-paystack-signature"]) {
          
        return res.status(400).send("Invalid signature");
        
      }
      
      const event = req.body;

      const { reference, gateway_response } = event.data;
      
      switch (event.event) { // Handle the event
      
      case "charge.success":
         
      order_query = `UPDATE orders 
      SET status= ?,
      description= ?
      WHERE order_id= ?`

      await new Promise( (resolve, reject) => {

        db.query(order_query, ['Pending', 'Your Order Has Been Recieved And is Awaiting Confirmation', reference], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })
         
        break;
      
      case "charge.failed":  // Handle failed payments
      
      order_query = `UPDATE orders 
      SET status= ?,
      description= ?
      WHERE order_id= ?`

      await new Promise( (resolve, reject) => {

        db.query(order_query, ['Payment Failed', gateway_response, reference], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })
       
        break;

        case "charge.reversal":  // Handle automatic reversals
      
        order_query = `UPDATE orders 
        SET status= ?,
        description= ?
        WHERE order_id= ?`
  
        await new Promise( (resolve, reject) => {
  
          db.query(order_query, ['Payment Reversed', 'Your funds has been reversed. contact customer support for more info', reference], (err, result) => {
  
            if (err) {
  
              reject(err)
            
            } else {
  
              resolve(result)
  
            }
  
          })
  
        })
         
          break;
      
      // Add more cases for other events as needed
      
      default:
      
        console.log("Unhandled event type:", event.event);
        
        break;

      }

  } catch(err) {
      
    console.log(err.message)
      
  }

  res.sendStatus(200);   // Respond to Paystack

}   


// Verify User Email
static async emailVerification (req, res) {

  const confirmationCode = req.params.id

  try {
    
    const user_query = `SELECT * FROM users WHERE confirmation_code= ?`

    const user = await new Promise( (resolve, reject) => {

      db.query(user_query, [confirmationCode], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })


    if (user.length > 0 && user[0].account_status === "Unverified") {

      const account_status_query = `UPDATE users 
      SET account_status= ?
      WHERE email= ?`

      await new Promise( (resolve, reject) => {

        db.query(account_status_query, ['Verified', user[0].email], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

      return res.status(200).json({ // Success
        success: true,
        message: "Email Verification Succesful"
      }); 

     } else if (user.length > 0 && user[0].account_status === "Verified") {

      return res.status(200).json({ // Success
        success: true,
        message: "Email is Already Verified"
      }); 
    
     } else {

      return res.status(400).json({ // Failure
        success: false,
        message: "Email Verification Failed",
     });  

    }

  } catch (error) {

    return res.status(400).json({ // Failure
      success: false,
      message: "Email Verification Failed"
   }); 

  }

}


//logout user
static async logout (req, res) {
  
  try {

    req.session.isAuthenticated = null

    req.session.user_id = null

    req.session.destroy()

    return res.status(200).json({
      success: true,
      message: "success",
    });
    
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error occured. try again",
    });
    
  }
  
}



//PATCH REQUESTS

//update user profile
static async update_user_info (req, res) {

  let information = req.body

  let user_id = req.session.user_id

  try {

  const user_query = `UPDATE users 
  SET fullname= ?,
  email= ?,
  phone= ?
  WHERE user_id= ?`

  const user = await new Promise( (resolve, reject) => {

    db.query(user_query, [information.fullname, information.email, information.phone, user_id], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  return res.status(200).json({
    success: true,
    message: "success",
  });
    
} catch (error) {

  return res.status(500).json({
    success: false,
    message: "An error occurred. Please try again.",
  });    
    
 }

}


//update user profile
static async update_address (req, res) {

  let information = req.body

  let user_id = req.session.user_id

  try {

  const user_query = `UPDATE users 
  SET state= ?,
  city= ?,
  address= ?
  WHERE user_id= ?`

  const user = await new Promise( (resolve, reject) => {

    db.query(user_query, [information.state, information.city, information.address, user_id], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  return res.status(200).json({
    success: true,
    message: "success",
  });
    
} catch (error) {

  return res.status(500).json({
    success: false,
    message: "An error occurred. Please try again.",
  });    
    
 }

}


//update user password
static async update_password (req, res) {

  let information = req.body

  let user_id = req.session.user_id

  try {

    const user_query = `SELECT * FROM users WHERE user_id= ?` //first find the user

    const user = await new Promise( (resolve, reject) => {

      db.query(user_query, [user_id], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

    if (user.length > 0) { //if the user dey

      const isMatch = await bcrypt.compare(information.old_password, user[0].password); //compare the current pass, with the old one if he match 
      
      if (isMatch) { //if he match use am replace old one

      const hashed_pass = await bcrypt.hash(information.new_password, 12);
      
      const password_query = `UPDATE users 
      SET password= ?
      WHERE user_id= ?`

      await new Promise( (resolve, reject) => {

        db.query(password_query, [hashed_pass, user_id], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

      return res.status(200).json({
        success: true,
        message: "success",
      });

      } else { //if pass no match

      return res.status(401).json({
        success: false,
        message: "Old password incorrect"
      });        

      }

    } else { //if user nor dey

      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
      
    }
    
} catch (error) {

  return res.status(500).json({
    success: false,
    message: "An error occurred. Please try again.",
  }); 
    
}

}

}