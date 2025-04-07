var GoogleStrategy = require("passport-google-oauth20").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;
const users = require("../schema/userSchema");
const passport = require("passport");

////////////////google passport
passport.serializeUser((user, cb) => {
  cb(null, user.id);
}); //what iam going to save in the session : user._id with no error (the null is the error spot )

passport.deserializeUser((id, cb) => {
  users
    .findById(id)
    .then((user) => cb(null, user))
    .catch((error) => {
      console.log(error);
      cb(error, null);
    });
}); // using the id that i put in serialzeuser to find the user in ur database (or not ), if user found we inject the user
// else if user is not found we inject nothing

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback", // Ensure this matches your Google Console
    },
    async (accessToken, refreshToken, profile, cb) => {
      const existUser = await users.findOne({
        methodID: profile.id,
        method: "google",
      });

      if (existUser) {
        return cb(null, existUser);
      }
      const user = new users({
        method: "google",
        methodID: profile.id,
        fullName: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
      });

      await user.save();
      return cb(null, user);
    }
  )
);

// ////////facebook passport
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["id", "displayName", "emails"],
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       const existUser = await users.findOne({ methodID: profile.id });
//       console.log(profile);
//       if (existUser) {
//         return cb(null, existUser);
//       }

//       const user = new users({
//         method: "facebook",
//         methodID: profile.id,
//         fullName: profile.displayName,
//         email: profile.emails[0].value,
//         picture: profile.photos[0].value,
//       });

//       await user.save();
//       return cb(null, user);
//     }
//   )
// );

// //////////passport twitter
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: process.env.TWITTER_CONSUMER_KEY,
//       consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//       callbackURL: "/auth/twitter/callback",
//     },
//     function (token, tokenSecret, profile, cb) {
//       User.findOrCreate({ twitterId: profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );
