import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "./db.js"; // MySQL connection pool

dotenv.config();

// Google OAuth strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user already exists
                const [rows] = await pool.query("SELECT * FROM users WHERE google_id = ?", [profile.id]);

                let user;
                if (rows.length === 0) {
                    // User doesn't exist, insert into DB
                    const [result] = await pool.query(
                        "INSERT INTO users (google_id, name, email, picture) VALUES (?, ?, ?, ?)",
                        [profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value]
                    );

                    user = {
                        id: result.insertId,
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        picture: profile.photos[0].value
                    };
                } else {
                    user = rows[0]; // User exists, use existing data
                }

                // Create JWT token
                const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

                return done(null, { user, token });
            } catch (error) {
                console.error("Database error:", error);
                return done(error, null);
            }
        }
    )
);

export default passport;
