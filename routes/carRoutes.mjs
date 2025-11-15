import express from 'express';
import { UserModel } from '../mongoose/UserSchema.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const carsRoutes = express.Router();


carsRoutes.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const saltRounds = 10;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.trim().length < 5) {
        return res.status(400).json({ message: "Password must be at least 5 characters long" });
    }

    const emailExists = await UserModel.findOne({ email });

    if (emailExists) {
        return res.status(400).json({ message: "Email aready Registered!!!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const registerUser = new UserModel({ email: email, username: username, password: hashedPassword });

    try {
        const savedUser = await registerUser.save();

        return res.status(200).json({
            message: "User Registered successfully",
            user: { email: savedUser.email, username: savedUser.username },
        });
    } catch (err) {
        return res.status(500).json({ message: "Server Error" })
    }
})

carsRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const findUser = await UserModel.findOne({ email: email })

    if (!findUser) {
        return res.status(401).json({ msg: "invalid username/password" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
        return res.status(401).json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign(
        { username: findUser.username, email: findUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 60 * 60 * 1000),
    }).json({
        message: "Login successful",
        id: findUser._id,
        username: findUser.username,
        email: findUser.email,
    });
})

export default carsRoutes;