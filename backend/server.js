import express from "express";
import passport from "./auth.js";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware for session handling
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        // Redirect to frontend with JWT token
        res.redirect(`http://localhost:3000/login-success?token=${req.user.token}`);
    }
);

app.listen(3001, () => console.log("Server running on port 5000"));
