const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const db = require("./database"); // adjust path if needed

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://${process.env.BASE_URL}/api/auth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {

      try {

        const google_id = profile.id;

        const email = profile.emails[0].value;
        
        const fullname = profile.displayName;

        let user;

        // check if user exists
        const user_query = `SELECT * FROM users WHERE email = ?`;

        const users = await new Promise( (resolve, reject) => {

        db.query(user_query, [email], (err, result) => {

            if (err) {

            reject(err)
            
            } else {

            resolve(result)

            }

        })

     })

   
    if (users.length > 0) {  // existing user

        user = users[0];

    }  else {  // create new user

        const sql = `
        INSERT INTO users
        (fullname, email, google_id, auth_provider, account_status)
        VALUES (?, ?, ?, ?, ?)
      `;

      const result = await new Promise( (resolve, reject) => {

      db.query(sql, [fullname, email, google_id, 'google', 'Verified'], (err, result) => {

        if (err) {

          reject(err)
        
        } else {

          resolve(result)

        }

       })

     })

     // fetch newly created user
    const new_user_query = `SELECT * FROM users WHERE user_id = ?`;

    const newUsers = await new Promise((resolve, reject) => {

      db.query(new_user_query, [result.insertId], (err, result) => {

        if (err) {
            reject(err);
        } else {
            resolve(result);
        }

      });

    });

    user = newUsers[0];

    }

    return done(null, user);

    } catch (error) {

        return done(error, null);

      }
    }
  )
);


// store user id in session
passport.serializeUser((user, done) => {

  done(null, user.user_id);

});


// get full user from session id
passport.deserializeUser(async (id, done) => {

    try {
  
      const users = await new Promise((resolve, reject) => {
  
        db.query(
          "SELECT * FROM users WHERE user_id = ?",
          [id],
          (err, result) => {
  
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
  
          }
        );
  
      });
  
      done(null, users[0]);
  
    } catch (error) {
  
      done(error, null);
  
    }
  
  });


module.exports = passport;