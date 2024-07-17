const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

async function registerUser(request, response) {
    try {
        const { name, email, password, confirmpassword } = request.body;

        console.log('Request body:', request.body);  // Log the request body

        // Check if the user already exists
        const checkEmail = await UserModel.findOne({ email });
        if (checkEmail) {
            return response.status(400).json({
                message: "User already exists",
                error: true,
            });
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            return response.status(400).json({
                message: "Passwords do not match",
                error: true,
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user payload
        const payload = {
            name,
            email,
            password: hashedPassword
        };

        // Save the user
        const user = new UserModel(payload);
        const userSave = await user.save();

        return response.status(201).json({
            message: "User created successfully",
            data: userSave,
            success: true
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return response.status(500).json({
            message: error.message || "An error occurred during registration",
            error: true
        });
    }
}

module.exports = registerUser;
