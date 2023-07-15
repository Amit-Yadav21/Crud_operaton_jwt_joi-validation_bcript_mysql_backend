const express = require("express")
const {genratetoken, veryfitoken} = require('../JWT/jwt')
const {alluserData, insertUserData, loginUser,loginUserData, updateUserData, deleteUserData,deleteAll_Data, logoutUserData} = require("../Controller/logic");
const {signup_Validation,login_Validation} = require("../Validation/Validation");

const updated = require('../Multer/multer')

const router =express.Router();
router.use('/image',express.static('Images'))                // show image on localhost

router.get('/search',searchData )                           // search any data 
router.get('/alldata', alluserData)                         // all user data show
router.post('/signup',updated.product.single('Image'),signup_Validation,insertUserData)     // signup user 
router.get('/login',login_Validation, loginUser)            // login user
router.get('/loginUserData',veryfitoken, loginUserData)     // show login user data 
router.put('/update',veryfitoken, updateUserData)           // update current login user data 
router.delete('/delete',veryfitoken,deleteUserData)         // delete currnent login user data 
router.delete('/deleteAll',deleteAll_Data)                  // delete all data 
router.get('/logout',veryfitoken, logoutUserData)           // logout current login user data

module.exports =router
