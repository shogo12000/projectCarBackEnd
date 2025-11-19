import express from 'express';
import cloudinary from '../middleware/cloudinaryConfig.mjs';
import { UserModel, CarModel, AddCarModel } from '../mongoose/UserSchema.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema, addCarSchema } from '../utils/validationSchemas.mjs';
import { validationResult, matchedData } from 'express-validator';
import { verifyToken } from "../middleware/verifyToken.mjs";
//import upload from "../middleware/upload.mjs"
import { upload } from '../middleware/photoStorage.mjs';
import streamifier from "streamifier";

const carsRoutes = express.Router();

carsRoutes.post('/register', registerSchema, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

    const saltRounds = 10;
    const { email, username, password } = matchedData(req);

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

carsRoutes.post('/login', loginSchema, async (req, res) => {
    const errors = validationResult(req);

    console.log(errors.array());
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

    const { email, password } = matchedData(req);

    const findUser = await UserModel.findOne({ email: email })

    if (!findUser) {
        return res.status(401).json({ msg: "invalid username/password" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
        return res.status(401).json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign(
        { _id: findUser._id, username: findUser.username, email: findUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 60 * 60 * 1000),
    }).json({
        message: "Login successful",
        id: findUser._id,
        username: findUser.username,
        email: findUser.email,
    });
})

carsRoutes.get('/userstatus', (req, res) => {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
        return res.status(401).json({ loggedIn: false })
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ LoggedIn: true, user })
    } catch (err) {
        return res.status(401).json({ loggedIn: false })
    }
})

carsRoutes.get('/cars', async (req, res) => {
    try {
        const allCars = await CarModel.find();

        return res.status(200).json(allCars);
    } catch (err) {
        res.status(400).json({ msg: "Error getting cars.." });;
    }
})

carsRoutes.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }).status(200).json({ msg: "Logout Success" })
})


carsRoutes.post("/addcar", verifyToken, upload.single("photo"), addCarSchema, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { brand, model, year, price } = matchedData(req);



    try {
        let photoUrl = "";

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "cars" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });

            photoUrl = result.secure_url;
        }

        const newCar = new AddCarModel({
            brand,
            model,
            year,
            price,
            userId: req.user._id,
            photo: photoUrl,
        });

        await newCar.save();
        return res.status(201).json({ msg: "Car added successfully", car: newCar });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
});

carsRoutes.post("/updatecar", verifyToken, upload.single("photo"), addCarSchema, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { brand, model, year, price, userId } = matchedData(req);

    const myId = req.user._id;

    try {
        const car = await AddCarModel.findById(userId);

        if (!car) return res.status(404).json({ msg: "Car not found!!!" });

        if (car.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "Not allowed to edit this car" });
        }

        car.brand = brand || car.brand;
        car.model = model || car.model;
        car.year = year || car.year;
        car.price = price || car.price;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "cars" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });

            car.photo = result.secure_url; // substitui a foto antiga
        }

        await car.save();
        return res.status(200).json({ msg: "Car updated successfully", car });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Server error" });
    }
    // try {
    //     let photoUrl = "";

    //     if (req.file) {
    //         const result = await new Promise((resolve, reject) => {
    //             const uploadStream = cloudinary.uploader.upload_stream(
    //                 { folder: "cars" },
    //                 (error, result) => {
    //                     if (error) return reject(error);
    //                     resolve(result);
    //                 }
    //             );
    //             streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    //         });

    //         photoUrl = result.secure_url;
    //     }

    //     const newCar = new AddCarModel({
    //         brand,
    //         model,
    //         year,
    //         price,
    //         userId: req.user._id,
    //         photo: photoUrl,
    //     });

    //     await newCar.save();
    //     return res.status(201).json({ msg: "Car added successfully", car: newCar });
    // } catch (err) {
    //     console.error(err);
    //     return res.status(500).json({ msg: "Server error" });
    // }
});


carsRoutes.get('/allcar', async (req, res) => {
    try {

        const userCars = await AddCarModel.find();

        res.status(200).json(userCars);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Erro getting user car" });
    }
})

carsRoutes.get('/usercar', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;

        const userCars = await AddCarModel.find({ userId });

        res.status(200).json(userCars);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Erro getting user car" });
    }
})

carsRoutes.get('/editcar/:id', verifyToken, async (req, res) => {
    try {
        const carId = req.params.id;

        const car = await AddCarModel.findById(carId);

        if (!car) {
            return res.status(404).json({ msg: "Car not found!" });
        }

        res.status(200).json(car);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Erro getting car by id" });
    }
})

export default carsRoutes;