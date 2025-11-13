import express from 'express';
import { UserSchem } from '../mongoose/UserSchema.mjs';

const carsRoutes = express.Router();

carsRoutes.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    const registerUser = new UserSchem({ email: email, username: username, password: password});
    
    const savedUser = await registerUser.save();

    return res.status(200).json(savedUser);
})

export default carsRoutes;