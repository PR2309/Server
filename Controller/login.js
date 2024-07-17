const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
async function loginUser(request, response) {
    try {
        const { email, password } = request.body;


        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
            });
        }

      
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({
                message: "Invalid credentials",
                error: true,
            });
        }

        
      

        const tokenData = {
            id: user._id,
            email: user.email
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
         response.status(200).json({
            message: "Login successful",
            success:true,
            token,
            email,
            name:user.name
         })
       
    

    } catch (error) {
        console.error('Login Error:', error);
        return response.status(500).json({
            message: error.message || "An error occurred during login",
            error: true,
        });
    }
}

module.exports = loginUser;
