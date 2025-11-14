import express from 'express';
import { UserSchem } from '../mongoose/UserSchema.mjs';
import bcrypt from 'bcryptjs';

const carsRoutes = express.Router();
const saltRounds = 10;

carsRoutes.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.trim().length < 5) {
        return res.status(400).json({ message: "Password must be at least 5 characters long" });
    }

    const emailExists = await UserSchem.findOne({ email });

    if (emailExists) {
        return res.status(400).json({ message: "Email aready Registered!!!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const registerUser = new UserSchem({ email: email, username: username, password: hashedPassword });

    try {
        const savedUser = await registerUser.save();

        return res.status(200).json({
            message: "User Registered successfully",
            user: { email: savedUser.email, username: savedUser.username },
        });
    }catch(err){
        return res.status(500).json({ message: "Server Error"})
    }

})

export default carsRoutes;