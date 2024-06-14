const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/user");

dotenv.config();

const authenticate = async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "You are unauthorized!" });
    }

    const token = authHeader.replace('Bearer ', "");

    if (!token) {
        return res.status(401).json({ message: "You are unauthorized!" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

        const user = await UserModel.findOne({ email: decodedToken }, { password: 0 });

        if (!user) {
            return res.status(401).json({ message: "You are unauthorized!" });
        }

        req.user = user;
        next(); 

    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!", error });
    }
};

module.exports = authenticate;
