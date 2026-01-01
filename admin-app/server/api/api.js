const hbs = require('nodemailer-express-handlebars');
const nodemailer = require("nodemailer");
const fs = require('fs');
const { render } = require("express/lib/response");
const path = require("path")
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require("../middlewares/database")
const MAILS = require("../middlewares/mails.js");
const HELPERS = require("../middlewares/helpers")

module.exports = class API {

//POST REQUESTS

confirm_order

//register users
static async register(req, res) {

    const data = req.body;

    try {

    const admin_query = `SELECT * FROM admin`

    const admin = await new Promise( (resolve, reject) => {

      db.query(admin_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

     
   if (admin.length == 1) { //do not allow more than one admin

    return res.status(400).json({
      success: false,
      message: "Invalid Request",
    });
        
    } else { //insert user for db

     data.password = await bcrypt.hash(data.password, 12); //encrypt the password

     data.confirmation_code = uuidv4() //create uniq confirmation code

     const sql = 'INSERT INTO admin SET ?'

      await new Promise( (resolve, reject) => {

      db.query(sql, data, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve()

        }

      })

    })

    return await MAILS.SendConfirmationMail(req, res, data.email, data.confirmation_code)

    }
        
    } catch (error) { //if there was an error at any point

    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    }); 

  }

}




 //login users
 static async login(req, res) {
   
  const data = req.body

  let this_user = null

  let date = new Date()

  try {

  const admin_query = `SELECT * FROM admin WHERE email= ?`

  const admin = await new Promise( (resolve, reject) => {

    db.query(admin_query, [data.email], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  
  if (admin[0]) { //if the user dey

  const isMatch = await bcrypt.compare(data.password, admin[0].password); //decrypt he password, make u compare am with this one entered

  if (!isMatch) { //if password no match

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
    
  } else { //if he match 

    if (admin[0].account_status === "Unverified") { //if user neva verify account
      
    this_user = admin[0]

    return res.status(403).json({
      success: false,
      message: "Account not verified. Please verify your email",
      isAuthenticated: req.session.isAuthenticated,
      admin: this_user
    });
      
    } else { //if account verified, log am in

    date.setHours(date.getHours() + 2); // session expires in 2 hours

    req.session.cookie.expires = date;
  
    req.session.admin_id = admin[0].admin_id; //set admin id for session

    req.session.isAuthenticated = true

    this_user = {
      email: admin[0].email,
      phone: admin[0].phone,
    }

    return res.status(200).json({
      success: true,
      message: "success",
      admin: this_user,
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
    
    console.log(error.message)

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

    const admin_query = `SELECT * FROM admin WHERE email= ?`

    const admin = await new Promise( (resolve, reject) => {

      db.query(admin_query, [confirmationEmail], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })
   
   if (admin.length > 0) { //if the admin dey
     
      return await MAILS.SendConfirmationMail(req, res, admin[0].email, admin[0].confirmation_code)

    } else { //if e no dey

      return res.status(401).json({
        success: false,
        message: "Invalid Request",
      });

    }

  } catch (err) {

    console.log(err.message)
    
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });    

  } 

}



//upload item
static async upload_items(req, res) {

  const data = req.body;

  data.name = data.name.toLowerCase()

  data.main_image = req.file ? req.file.filename : null;

  try {
 
   const products_query = 'INSERT INTO products SET ?'

    await new Promise( (resolve, reject) => {

    db.query(products_query, data, (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve()

      }

    })

  })

  return res.status(200).json({
    success: true,
    message: "success"
  });

  } catch (error) { //if there was an error at any point

  return res.status(500).json({
    success: false,
    message: "An error occurred. Please try again.",
  });  

  }

}





//send reset password email to user
static async send_reset_pass_email (req, res) {

  let data = req.body

  try {

    const admin_query = `SELECT * FROM admin WHERE email= ?`

    const admin = await new Promise( (resolve, reject) => {
  
      db.query(admin_query, [data.email], (err, result) => {
  
        if (err) {
  
          reject(err)
        
        } else {
  
          resolve(result)
  
        }
  
      })
  
    })
  
    
  if (admin[0]) { //if the admin dey

   const token = uuidv4()

   const password_reset_token = `UPDATE admin 
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

   await MAILS.send_reset_pass_email(req, res, admin[0].email, token)
   
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



//reset password
static async reset_password (req, res) {

  const password = req.body.password

  const token = req.body.token

  try {

  const token_query = `SELECT * FROM admin WHERE password_reset_token= ?`

    const admin = await new Promise( (resolve, reject) => {
  
      db.query(token_query, [token], (err, result) => {
  
        if (err) {
  
          reject(err)
        
        } else {
  
          resolve(result)
  
        }
  
      })
  
    })
  
    
  if (admin[0]) { //if token exist for a user

  let hashed_pass = await bcrypt.hash(password, 12); //change user password

  const password_reset_token = `UPDATE admin 
      SET password_reset_token= ?,
      password= ?
      WHERE email= ?`

      await new Promise( (resolve, reject) => { //update user password token

        db.query(password_reset_token, ['', hashed_pass, admin[0].email], (err, result) => {

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




//cancel order
static async cancel_order (req, res) {

  let { description, order_id, user_id } = req.body

  try {

    const user_query = `SELECT * FROM users WHERE user_id= ?` //first of all find the user

    const user = await new Promise( (resolve, reject) => {
  
      db.query(user_query, [user_id], (err, result) => {
  
        if (err) {
  
          reject(err)
        
        } else {
  
          resolve(result)
  
        }
  
      })
  
    })

    if (!user[0]) { //if this user doesnt exist
      
      return res.status(401).json({
        success: false,
        message: "User was not found",
      });  

    }

   const status_query = `UPDATE orders 
      SET order_status= ?,
      description= ?
      WHERE order_id= ?`

      await new Promise( (resolve, reject) => { //update order

        db.query(status_query, ['cancelled', description, order_id], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

    })

    
    await MAILS.send_user_cancellation_email(req, res, user[0].email, user[0].fullname, order_id, description)

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "An error occured. please try again",
    });
    
  }

}



//confirm order
static async confirm_order (req, res) {

  const { description, order_id, user_id } = req.body

  try {

    const user_query = `SELECT * FROM users WHERE user_id= ?` //first of all find the user

    const user = await new Promise( (resolve, reject) => {
  
      db.query(user_query, [user_id], (err, result) => {
  
        if (err) {
  
          reject(err)
        
        } else {
  
          resolve(result)
  
        }
  
      })
  
    })

    if (!user[0]) { //if this user doesnt exist
      
      return res.status(401).json({
        success: false,
        message: "User was not found",
      });  

    }

    //Get Order Items
    const order_items_query = `SELECT * FROM order_items WHERE order_id= ?` //first of all find the user

    const order_items = await new Promise( (resolve, reject) => {
  
      db.query(order_items_query, [order_id], (err, result) => {
  
        if (err) {
  
          reject(err)
        
        } else {
  
          resolve(result)
  
        }
  
      })
  
    })


    async function DerivedProducts() {

    for (const item of order_items) {
        
      const product_query = `SELECT * FROM products WHERE product_id= ?`
    
        const product = await new Promise( (resolve, reject) => {
      
          db.query(product_query, [item.product_id], (err, result) => {
      
            if (err) {
      
              reject(err)
            
            } else {
      
              resolve(result)
      
            }
      
          })
      
        })
    
        if (product[0]) { //if you find am for db
    
          order_items.forEach((item) => { //update the stock quantity of products array for each object
             
            item.product_id == product[0].product_id ? item.stock_quantity = product[0].stock_quantity : null

            item.product_id == product[0].product_id ? item.name = product[0].name : null

          })
    
        }

    }

    return order_items

  }

  let stockError = HELPERS.stock_availability(await DerivedProducts());

    if (stockError) {
      return res.status(400).json({
        success: false,
        message: stockError
      });
    }


    //Update Stock Quanntity
    for (const item  of order_items) { 

      const item_quantity = item.quantity
      
      const product_id = item.product_id

      const products_query = `
        UPDATE products
        SET stock_quantity = stock_quantity - ?
        WHERE product_id = ?
          AND stock_quantity >= ?
      `
      await new Promise((resolve, reject) => {
        
        db.query(products_query, [item_quantity, product_id, item_quantity],
          
          (err, result) => {
          
            if (err) reject(err)
          
            else resolve(result)
          
          })

      })
    
    }


   //Update Order Status
   const status_query = `UPDATE orders 
      SET order_status= ?,
      description= ?
      WHERE order_id= ?`

      await new Promise( (resolve, reject) => { //update user password token

        db.query(status_query, ['confirmed', description, order_id], (err, result) => {

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

    console.log(error.message)

    return res.status(500).json({
      success: false,
      message: "An error occured. please try again",
    });
    
  }

}



  //CHANGE ITEM PHOTO
  static async update_photo (req, res) {

    let item_id = req.body.item_id

    let current_image_name = req.body.current_image_name

    let main_image = req.file ? req.file.filename : null;
  
    try {
 
      const item_photo_query = `UPDATE products 
      SET main_image= ?
      WHERE product_id= ?`

      await new Promise( (resolve, reject) => { //update user password token

        db.query(item_photo_query, [main_image, item_id], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

    const imagePath = path.resolve(__dirname, '../../../product-images/', current_image_name);

    if (fs.existsSync(imagePath)) {

      fs.unlinkSync(imagePath); // Delete image from folder

    }  

    return res.status(200).json({
      success: true,
      message: "success",
      main_image: main_image
    });
     
   } catch (error) {
     
    return res.status(500).json({
      success: false,
      message: "Failed to update product image",
    }); 
 
   }
 
 }




//GET REQUESTS

//fetch admin
static async fetch_admin (req, res) {

  let admin_id = req.session.admin_id

  let this_admin = null;

  let message;

  let settings;

  try {

    const admin_query = `SELECT * FROM admin WHERE admin_id= ?`

    const admin = await new Promise( (resolve, reject) => {

      db.query(admin_query, [admin_id], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

  if (admin[0].length < 1) { //if admin nor dey or he dey but account dey unverified
    
    message = "admin no exist"

  } else { //if admin dey

    message = "success"

    this_admin = admin[0]

  }

  const settings_query = `SELECT * FROM settings` //fetch settings join

    settings = await new Promise( (resolve, reject) => {

      db.query(settings_query, (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })
    
  } catch (error) {
    
    message = "error occured" 

  }

  res.json({message: message, account_settings: settings[0], admin: this_admin, isAuthenticated: req.session.isAuthenticated})

}



//fetch orders
static async fetch_orders (req, res) {

  try {

  const orders_query = `SELECT * FROM orders ORDER BY order_id DESC`;

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
      
        -- User details
        u.user_id AS customer_id,
        u.fullname AS customer_name,
        u.phone,
        u.email,
        u.address,
      
        -- Product details
        p.product_id,
        p.name AS product_name,
        p.main_image,
      
        -- Order item details
        oi.quantity,
        oi.price
      
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      
      ORDER BY o.created_at DESC;
    `;
  
    let all_order_items = await new Promise( (resolve, reject) => {

      db.query(order_items_query, (err, result) => {

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



//fetch customers
static async fetch_customers (req, res) {

  try {

    const customers_query = `SELECT * FROM users ORDER BY created_at DESC;`

    let all_customers = await new Promise( (resolve, reject) => {

      db.query(customers_query, (err, result) => {

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
      all_customers
    });
    
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Error loading data. please try again.",
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
      product.status,
      product.category_id,
      category.name AS category_name
    FROM products AS product
    JOIN categories AS category
      ON product.category_id = category.category_id
    ORDER BY product.created_at DESC;
  `;
  
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



// Verify admin Email
static async emailVerification (req, res) {

  const confirmationCode = req.params.id

  try {
    
    const admin_query = `SELECT * FROM admin WHERE confirmation_code= ?`

    const admin = await new Promise( (resolve, reject) => {

      db.query(admin_query, [confirmationCode], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })


    if (admin.length > 0 && admin[0].account_status === "Unverified") {

      const account_status_query = `UPDATE admin 
      SET account_status= ?
      WHERE email= ?`

      await new Promise( (resolve, reject) => {

        db.query(account_status_query, ['Verified', admin[0].email], (err, result) => {

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

     } else if (admin.length > 0 && admin[0].account_status === "Verified") {

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

  let message;
  
  try {

    req.session.isAuthenticated = null

    req.session.admin_id = null

    message = "success"
    
  } catch (error) {

    message = "An error occcured"
    
  }

   res.json({message: message})
  
}



//PATCH REQUESTS


//update update item
static async update_item (req, res) {

  let item = req.body

  try {

  const items_query = `UPDATE products 
  SET name= ?,
  description= ?,
  category_id= ?,
  product_condition= ?,
  stock_quantity= ?,
  price= ?
  WHERE product_id= ?`

  await new Promise( (resolve, reject) => {

    db.query(items_query, [item.name, item.description, item.category_id, item.product_condition, item.stock_quantity, item.price, item.product_id], (err, result) => {

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
  });
    
} catch (error) {

  return res.status(500).json({
    success: false,
    message: "Error updating item info. try again",
  });
    
}

}



//update admin info
static async update_admin_info (req, res) {

  try {

  const admin_query = `UPDATE admin 
  SET phone= ?
  WHERE admin_id= ?`

  await new Promise( (resolve, reject) => {

    db.query(admin_query, [req.body.phone, req.body.admin_id], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })


  //account setting update
  const settings_query = `UPDATE settings 
  SET fee_same_city = ?,
  fee_same_state = ?,
  fee_other_state = ?`

  await new Promise( (resolve, reject) => {

    db.query(settings_query, [req.body.fee_same_city, req.body.fee_same_state, req.body.fee_other_state], (err, result) => {

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


//update admin passwowrd
static async update_admin_pass (req, res) {

  let information = req.body

  let admin_id = req.session.admin_id

  try {

    const admin_query = `SELECT * FROM admin WHERE admin_id= ?` //first find the user

    const admin = await new Promise( (resolve, reject) => {

      db.query(admin_query, [admin_id], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

      })

    })

    if (admin.length == 0) { //if the admin dey

      return res.status(400).json({
        success: false,
        message: "Bad Request",
      });  

    }
      
    const isMatch = await bcrypt.compare(information.old_password, admin[0].password); //compare the current pass, with the old one if he match 
      
      if (!isMatch) { //if he match use am replace old one

        return res.status(401).json({
          success: false,
          message: "Old password incorrect",
        });

      }

      const hashed_pass = await bcrypt.hash(information.new_password, 12);
      
      const password_query = `UPDATE admin 
      SET password= ?
      WHERE admin_id= ?`

      await new Promise( (resolve, reject) => {

        db.query(password_query, [hashed_pass, admin_id], (err, result) => {

          if (err) {

            reject(err)
          
          } else {

            resolve(result)

          }

        })

      })

    return res.status(200).json({
      success: true,
      message: "Password Updated",
    });
    
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });   
      
  }

}





//update order status
static async update_order_status (req, res) {

  let order_status = req.body.order_status

  let order_id = req.body.order_id

  try {

  const order_query = `UPDATE orders 
  SET order_status= ?
  WHERE order_id= ?`

  await new Promise( (resolve, reject) => {

    db.query(order_query, [order_status, order_id], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  return res.status(200).json({
    success: true,
    message: "Order Status Updated",
  });
  
} catch (error) {

  return res.status(500).json({
    success: false,
    message: "An error occurred. Please try again.",
  });   

 }

}


//update payment status
static async update_payment_status (req, res) {

  let payment_status = req.body.payment_status

  let order_id = req.body.order_id

  try {

  const order_query = `UPDATE orders 
  SET payment_status= ?
  WHERE order_id= ?`

  await new Promise( (resolve, reject) => {

    db.query(order_query, [payment_status, order_id], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })

  return res.status(200).json({
    success: true,
    message: "Payment Status Updated",
  });
  
} catch (error) {

  return res.status(500).json({
    success: false,
    message: "An error occurred. Please try again.",
  });   

 }

}

//CRON JOBS

//open market
static async open_market(req, res) {

  try {

  const settings_query = `UPDATE settings 
  SET market_status= ?
  WHERE id= ?`

  await new Promise( (resolve, reject) => {

    db.query(settings_query, ['open', 1], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })
    
  } catch (error) {

    console.log(error.message)
    
  }

}


//close market
static async close_market(req, res) {

  try {

  const settings_query = `UPDATE settings 
  SET market_status= ?
  WHERE id= ?`

  await new Promise( (resolve, reject) => {

    db.query(settings_query, ['close', 1], (err, result) => {

      if (err) {

        reject(err)
      
      } else {

        resolve(result)

      }

    })

  })
    
  } catch (error) {

    console.log(error.message)
    
  }

}


//DELETE REQUESTS

//delete item
static async delete_item(req, res) {

  const item_name = req.body.item_name;

  let message;

  try {
   
    const item_query = `SELECT * FROM items WHERE name= ?`;
   
    const item = await new Promise((resolve, reject) => {
   
      db.query(item_query, [item_name], (err, result) => {
   
        if (err) {
   
          reject(err);
   
        } else {
   
          resolve(result);
   
        }
   
      });
   
    });

    if (!item.length) {
   
      return res.json({ message: "Item not found" });
   
    }

    const delete_query = `DELETE FROM items WHERE name= ?`;
   
    db.query(delete_query, item_name); // Delete item from database

    const imagePath = path.resolve(__dirname, '../../kelvinspice_gallery/', item[0].image);

    if (fs.existsSync(imagePath)) {

      fs.unlinkSync(imagePath); // Delete image from folder

    } else {

      console.log('Image not found:', imagePath);

    }

    message = "Delete successful";

  } catch (error) {
    
    message = "Error occurred";

  }

  res.json({ message: message });

}

}