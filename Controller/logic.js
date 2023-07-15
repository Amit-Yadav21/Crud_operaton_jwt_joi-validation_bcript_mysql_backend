const express = require('express')
const bcrypt = require('bcrypt');
const {createToken} = require('../JWT/jwt')
const knex = require('../Model/database')

// const {genratetoken, veryfitoken} = require('../JWT/jwt')

alluserData = async (req, res) => {
    try {
        const data = await knex('datas')
        if(!data.lenth >0){
            res.send({'All data here ':data})
        }
        else{
            res.send({message: 'Not anyone data availeble '})
        }
    }
    catch (err) {
        res.send(err.message);
    }
}

searchData = async (req, res) => {
    try {
        const search = req.body
        const what_search = search.Name || search.Email || search.Address || search.Phone_Number
        // console.log('what is seasrching :-',what_search);

        const data = await knex('*').from('datas');
        // console.log('All data here :',data);
        const searchData = data.filter((item) => {

            const name = item.Name;
            const email = item.Email;
            const address = item.Address;
            const phone = item.Phone_Number;

            return (
                name.includes(what_search) ||
                email.includes(what_search) ||
                address.includes(what_search) ||
                phone.includes(what_search)
            );
        })
        if(searchData.length>0){
            res.send({ 'searching data here': searchData })
            // console.log("searching data here :- ",searchData);
        }
        else{
            res.send({message:'user data not found. please type correctly...'})
        }
    }
    catch (err) {
        res.send(err.message);
    }
}

insertUserData = async (req, res) => {
    try {
        let {Name, Email,Password,Address, Phone_Number } = req.body;
        Password = await bcrypt.hash(Password, 10); // password bcrypt here 
        // console.log('this is bcrypt password : ', Password);

        let data = await knex('datas').where({ Email })  // read here 
        // console.log('===============',data);
        if (data.length > 0) {
            res.send({
                message: 'You are allready done signUp Please go and login',
                "This is your data": data
            });
        }
        else {
            // let AddData = {
            //     Name: req.body.Name,
            //     Email: req.body.Email,
            //     Password:Password,              // access bcrypt password here 
            //     Address: req.body.Address,
            //     Phone_Number:req.body.Phone_Number,
            //     Image:req.file.path
            // };
            // console.log(AddData);

            console.log('Image details : ',req.file);

            const d = await knex('datas').insert({Name,Email,Password,Address,Phone_Number,Image:`http://localhost:4000/image/${req.file.filename}`})
            res.send({message:'user data inserted successfully ', Image_url:`http://localhost:4000/image/${req.file.filename}`})
        };
    }
    catch (error) {
        // console.error(error);
        res.send(error.message);
    }
}

loginUser = async (req, res) => {
    try {
        let { Email, Password } = req.body

        let data = await knex('datas').where({ Email });
        // console.log('============', data);
        if (!data) {
            res.send({ message: 'Please signUp frist' });
        }
        else {
            const phoneMatch = await bcrypt.compare(Password, data[0].Password);
            // console.log('++++++++++++++++++',phoneMatch);

            let id = data[0].Employee_ID   // here I got the id from the login user
            // console.log('id',id);
            const token = await createToken(id)  // generatetoken here
            // console.log('token',token);
            res.cookie('token', token);

            res.send({
                'login user data': data,
                "token": token
            })
        }
    }
    catch (error) {
        res.send({message:'Please check Email or password is wrong.'})
    }
}

//=======================

loginUserData = async (req, res) => {
    try {
        let id = req.id
        const data = await knex('datas').where({Employee_ID:id})
        if(data.length>0){
            res.json({ 'show login user data successfully ': data })
        }else{
            res.json('login first');
        }
    }
    catch (err) {
        // console.log(err.message);
        res.send('users not find');
    }
}

updateUserData = async (req, res) => {
    try {
        const id = req.id // find id with jwt logn user data
        // console.log('ID here update :-',id);

        const data = await knex('datas').where({ Employee_ID:id }).update(req.body)
        // console.log("--------------",data);
        res.send({
            "user id": id,
            'update user data successfully ': req.body
        })
        // console.log({
        //     "user id": id, 'update user data successfully ': req.body,
        // });         // updated data on terminal 
    }
    catch (error) {
        res.send(error.message)
    }
}

deleteUserData = async (req, res) => {
    try {
        const id = req.id  // find id with jwt login user data
        const data = await knex('datas').where({ Employee_ID: id }).delete(req.body)
        res.send('user data delete ')
    }
    catch {
        res.send({message:'user data not find...'})
    }
}

deleteAll_Data = async (req, res) => {
    try {
        const data = await knex('datas').truncate();
        res.send({message:'Delete all user'})
    }
    catch {
        res.send('user data not find...')
    }
}

logoutUserData = async (req, res) => {
    try {
        const id = req.id  // find id with jwt login user data
        const data = await knex('datas').where({ Employee_ID: id })
        if(data.length > 0){
            res.clearCookie('token')
            res.send({ "Login User ID": id, 'Logout User Name': data[0]['Name'] })
            // console.log('login user id :-', id);
        }
        else{
            res.send({message:'User Not Found...'})
        }
    }
    catch {
        res.send({message:'Login First...'})
    }
}


module.exports = {alluserData, insertUserData, loginUser, loginUserData, updateUserData, deleteUserData, deleteAll_Data, logoutUserData }