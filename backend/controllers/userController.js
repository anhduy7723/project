import asyncHandler from "express-async-handler";

import generateToken from "../utils/generateToken";

import User from "../utils/user";

import pool from "../config/db";

/*
Auth user & get token
Post /api/users/login
Public
*/

const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    const [rows]=await pool.query('Select * form users where email=?',[email]);

    const user=rows[0];

    if(user &&(await user.matchPassword(password))){
       res.json({
         _id:user.id,
         name:user.name,
         email:user.email,
         isAdmin:user.isAdmin,
         token:generateToken(user.id)
       });
    } else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

/*
Register user
Post /api/users
Public */

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if user with the same email already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      res.status(400);
      throw new Error('User already exists');
    }
  
    // Create a new user in the database
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [insertResult] = await pool.query(insertQuery, [name, email, password]);
  
    const newUser = {
      id: insertResult.insertId,
      name,
      email,
      isAdmin: false,
    };
  
    res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: generateToken(newUser.id),
    });
  });
  
    // @desc Get user profile
    // @route GET /api/users/profile
    // @access Private
    const getUserProfile = asyncHandler(async (req, res) => {
        const userId = req.user.id; // Assuming you've stored user ID in the token payload
    
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const user = rows[0];
    
        if (user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
        } else {    
        res.status(404);
        throw new Error('User not found');
        }
    });

  // @desc Update user profile
  // @route PUT /api/users/profile
  // @access Private

  const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Assuming you've stored user ID in the token payload
  
    // Get the existing user details from the database
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const existingUser = rows[0];
  
    if (existingUser) {
      // Update user details based on the request
      const { name, email, password } = req.body;
  
      const updatedName = name || existingUser.name;
      const updatedEmail = email || existingUser.email;
      const updatedPassword = password || existingUser.password;
  
      // Update the user details in the database
      const updateQuery = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
      await pool.query(updateQuery, [updatedName, updatedEmail, updatedPassword, userId]);
  
      // Fetch the updated user details
      const [updatedRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
      const updatedUser = updatedRows[0];
  
      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser.id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });
  
    // @desc Update user user
    // @route PUT /api/users/:id
    // @access Private/Admin
    const updateUser = asyncHandler(async (req, res) => {
        const userId = req.params.id;
        const { name, email, isAdmin } = req.body;
    
        // Get the existing user details from the database
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const existingUser = rows[0];
    
        if (existingUser) {
        // Update user details in the database
        const updateQuery = 'UPDATE users SET name = ?, email = ?, isAdmin = ? WHERE id = ?';
        await pool.query(updateQuery, [name, email, isAdmin, userId]);
    
        // Fetch the updated user details
        const [updatedRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const updatedUser = updatedRows[0];
    
        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
        } else {
        res.status(404);
        throw new Error('User not found');
        }
    });

    // @desc Get All users
    // @route GET /api/users
    // @access Private/admin
    const getUsers = asyncHandler(async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM users');
        const users = rows;
      
        res.json(users);
      });

    
    // @desc Get user by ID
    // @route GET /api/users/:id
    // @access Private/admin
    const getUserByID = asyncHandler(async (req, res) => {
        const userId = req.params.id;
      
        const [rows] = await pool.query('SELECT id, name, email, isAdmin FROM users WHERE id = ?', [userId]);
        const user = rows[0];
      
        if (user) {
          res.json(user);
        } else {
          res.status(404);
          throw new Error('User not found');
        }
      });  
      

    // @desc Delete User
    // @route DELETE /api/users/:id
    // @access Private/admin
    const deleteUser = asyncHandler(async (req, res) => {
        const userId = req.params.id;
      
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const user = rows[0];
      
        if (user) {
          // Delete the user from the database
          await pool.query('DELETE FROM users WHERE id = ?', [userId]);
      
          res.json({ message: 'User removed' });
        } else {
          res.status(404);
          throw new Error('User not found');
        }
      });


export { authUser, getUserProfile, registerUser, updateUserProfile,getUsers,deleteUser,getUserByID,updateUser}      