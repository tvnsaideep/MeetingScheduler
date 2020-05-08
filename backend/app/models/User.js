'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
Schema = mongoose.Schema;

let userSchema = new Schema({
    userId: {
        type: String,
        index:true,
        unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type:String
    },
    userName: {
        type: String
    },
    country:{
        type:String
    },
    mobile: {
        type:String
    },
    isAdmin: {
        type: String,
        default: 'false'
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: String,
        default:'offline'
    },
    validationToken: {
        type: String
    },
    emailVerified: {
        type: String,
        default: 'no'
    },
    createdOn: {
        type: Date
    }

})

mongoose.model('User', userSchema);