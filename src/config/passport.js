import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { usersService } from "@/services/userService";
import { getToken } from "@/util/token";
const configPassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }
          const isMatch = await user.comparePassword(password); // Hàm so sánh mật khẩu
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password." });
          }
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/v1/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = {
            idGoogle: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          };
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: getToken,
        secretOrKey: process.env.SECRET_KEY,
      },
      (jwt_payload, done) => {
        if (!jwt_payload) return done(err, false);
        done(null, jwt_payload);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default configPassport;
