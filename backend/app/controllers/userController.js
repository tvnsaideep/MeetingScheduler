const mongoose = require('mongoose');
const check = require('./../libs/checkLib');
const shortid = require('shortid');
const passwordLib = require('./../libs/passwordLib');
const validator = require('./../libs/validateParamsLib');
const response = require('./../libs/responseLib')
const time = require('./../libs/timeLib');
const token = require('./../libs/tokenLib');
const logger = require('./../libs/loggerLib');
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth');
const emailLib = require('./../libs/emailLib');
const applicationUrl = 'http://localhost:4200';


/*******User Signup Function */
let signUpFunction = (req, res) =>{
    console.log('req came');
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if(req.body.email) {
                if(validator.Email(req.body.email)) {
                    resolve(req)
                } 
                else if(check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true,'Password is Empty or Missing !',400,null);
                    reject(apiResponse)
                }
                else {
                    let apiResponse = response.generate(true,'Email Doesnot meet Requirement',400,null);
                    reject(apiResponse)
                }
            } else {
                logger.error('Fields are missing','userController: createUser()',5)
                let apiResponse = response.generate(true,'One or More fields are missing !!',400,null);
                reject(apiResponse);
            }
        })
    }

    let createUser= () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({email: req.body.email})
            .exec((err, detailsRetrieved) => {
                if(err) {
                    logger.error(err.message, 'userController: createUser', 10)
                    let apiResponse = response.generate(true,'Failed to create',500,null);
                    reject(apiResponse)
                } else if(check.isEmpty(detailsRetrieved)) {
                    console.log(req.body)
                    let new_userId = shortid.generate()
                    console.log(new_userId)
                    let newUser = new UserModel({
                        userId: new_userId,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName || '',
                        userName: req.body.userName,
                        isAdmin: req.body.isAdmin,
                        country: req.body.country,
                        mobile: req.body.mobile,
                        email: req.body.email,
                        password: passwordLib.hashpassword(req.body.password),
                        createdOn: time.now()
                    })
                    newUser.save((err, newUser) => {
                        if(err) {
                            console.log(err)
                            logger.error(err.message, 'userController: createUser', 10)
                            let apiResponse = response.generate(true,'Failed to create',500,null);
                            reject(apiResponse)
                        }
                        else {
                            let newUserObj = newUser.toObject();
                            let verifyLink = `${applicationUrl}/user/verify-email/${newUserObj.userId}`;
                            console.log(`${verifyLink}`)
                            //create object for verification email
                            let sendEmailOptions = {
                                email: newUserObj.email,
                                name: newUserObj.firstName,
                                subject: 'Meeting Scheduler Welcomes you !!',
                                html: `<b> Dear ${newUserObj.firstName}</b><br>
                                <h1>Welcome to our Meeting scheduler application :)<br>
                                You are one step away for scheduling your meetings.
                                <p> Click on the following link to verify your Email</p><br>
                                <a href="${verifyLink}">Click here</a>
                                <br><b>Have A Good Day !!</b></h1>`
                            }
                            setTimeout(()=> {
                                emailLib.sendEmail(sendEmailOptions);
                            },2000);
                            resolve(newUserObj)
                        }
                    })
                } else {
                    logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                    let apiResponse = response.generate(true,'Email already Exists!!',403,null);
                    reject(apiResponse);
                }
            })
        })
    }//end create User

    validateInput(req, res)
    .then(createUser)
    .then((resolve) => {
        delete resolve.password
        let apiResponse = response.generate(false,'User Created',200, resolve);
        res.send(apiResponse);
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })
}
/****Signup Function Completed */

/*Verifying Email*/

let verifyEmailFunction = (req, res) => {
    let findUser= () => {
        console.log("finding user");
        return new Promise((resolve, reject) =>{
            if(req.body.userId) {
                console.log("User Id is present in req body");
                UserModel.findOne({ 'userId': req.body.userId})
                .select('-password -__v -_id')
                .lean()
                .exec((err, result) => {
                    if(err) {
                        console.log(err)
                        logger.error(err.message, 'User Controller: getSingleUser', 10)
                        let apiResponse = response.generate(true, 'Failed to Find User',500,null)
                        reject(apiResponse)
                    }
                    else if(check.isEmpty(result)) {
                        logger.info('No User Found', 'User Controller:getSingleUser')
                        let apiResponse = response.generate(true,'Usr Not Found',404,null)
                        reject(apiResponse)
                    } else {
                        let apiResponse = response.generate(false,'User Found',200,result)
                        resolve(result)
                    }
                })
            } else {
                let apiResponse = response.generate(true,'UserId NOT FOUND',400,null)
                reject(apiResponse)
            }
        })
    }

    let verifyEmail = (retrievedUserDetails) => {
        return new Promise((resolve,reject) => {
            console.log("Verify Email is called");
            UserModel.updateOne({ 'userId': retrievedUserDetails.userId },{ 'emailVerified': 'Yes'}).exec((err, result) => {
                if (err) {
                    console.log("Error Verifying" + err);
                    logger.error(err.message, 'User Controller:verifyEmail', 10)
                    let apiResponse = response.generate(true, 'Failed To Verify ',500,null)
                    reject(apiResponse)
                } else if(check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller: verifyEmail')
                    let apiResponse = response.generate(true, ' User doesnt exist',404,null);
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false,'Email Verified',200,result)
                    resolve(result)
                }
            }); // end user model
        })
    }
    
    findUser(req, res)
    .then(verifyEmail)
    .then((resolve) => {
        let apiResponse = response.generate(false, 'User Email Verified',200,resolve)
        res.status(200)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log("errorhandler");
        console.log(err);
        res.status(err.status)
        res.send(err)
    })

}

/*
*Login Function
*/

let userLogin =(req,res) => {
    let findUser = () => {
        return new Promise((resolve,reject) => {
            if(req.body.email) {
                UserModel.findOne( { $and : [{email: req.body.email} ,{emailVerified:'Yes'}]}, (err, userDetails) => {
                    if(err) {
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        let apiResponse = response.generate(true, 'Failed To Find User Details',500,null)
                        reject(apiResponse)
                    } else if(check.isEmpty(userDetails)) {
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    
    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isSame) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isSame) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            console.log('generating token');
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })

}
/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find({ 'emailVerified': 'Yes' })
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users

/* Get single user details */
/* params : userId
*/
let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user


/* Delete user */
/* params : userId
*/

let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user

/* Edit user details */
/* params : userId
   body : firstName,lastName,mobileNumber 
*/

let editUser = (req, res) => {

    let updatedDetails = req.body;
    UserModel.update({ 'userId': req.params.userId }, updatedDetails).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details Updated', 200, "None")
            res.send(apiResponse)
        }
    });// end user model update


}// end edit user


/**
 * function to logout user.
 * auth params: userId.
 */
let logout = (req, res) => {
    AuthModel.findOneAndRemove({userId: req.user.userId}, (err, result) => {
      if (err) {
          console.log(err)
          logger.error(err.message, 'user Controller: logout', 10)
          let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
          res.send(apiResponse)
      } else if (check.isEmpty(result)) {
          let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
          res.send(apiResponse)
      } else {
          let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
          res.send(apiResponse)
      }
    })
  } // end of the logout function.


/* Function to generate recoveryPassword and sending recoveryPassword via email */
/* params : email
*/

let resetPasswordFunction = (req, res) => {
    //finding user with email
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    //reset password
    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let resetPassword = (tokenDetails) =>{
        return new Promise((resolve, reject) => {

            let updatedDetails = {
                validationToken: tokenDetails.token
            }
    
            UserModel.update({ 'email': req.body.email }, updatedDetails).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller:resetPasswordFunction', 10)
                    let apiResponse = response.generate(true, 'Failed To reset user Password', 500, null)
                    reject(apiResponse)
                }  else {
    
                    //let apiResponse = response.generate(false, 'Password reset successfully', 200, result)
                    resolve(result)
                    //Creating object for sending welcome email
                    console.log(tokenDetails)
                    let sendEmailOptions = {
                        email: tokenDetails.userDetails.email,
                        subject: 'Reset Password for Meeting scheduler ',
                        html: `<h4> Hi ${tokenDetails.userDetails.firstName}</h4>
                            <p>
                                We got a request to reset your password associated with this ${tokenDetails.userDetails.email} . <br>
                                <br>Please use following link to reset your password. <br>
                                <br> <a href="${applicationUrl}/update-password/${updatedDetails.validationToken}">Click Here</a>                                 
                            </p>
    
                            <br><b>Meeting scheduler</b>
                                        `
                    }
    
                    setTimeout(() => {
                        emailLib.sendEmail(sendEmailOptions);
                    }, 2000);
    
                }
            });// end user model update
    
        });//end promise
    
    }//end reset password

    //making promise call
    findUser(req, res)
        .then(generateToken)
        .then(resetPassword)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Password reset instructions sent successfully', 200, 'None')
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })


}// end resetPasswordFunction

/* Function to update password and sending email */
/* params : recoveryPassword,paswword
*/

let updatePasswordFunction = (req, res) => {

    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.validationToken) {
                console.log("req body validationToken is there");
                console.log(req.body);
                UserModel.findOne({ validationToken: req.body.validationToken }, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"validationToken" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let passwordUpdate = (userDetails) => {
        return new Promise((resolve, reject) => {

            let updatedDetails = {
                password: passwordLib.hashpassword(req.body.password),
                validationToken:'Null'
            }

            UserModel.update({ 'userId': userDetails.userId }, updatedDetails).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller:updatePasswordFunction', 10)
                    let apiResponse = response.generate(true, 'Failed To reset user Password', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found with given Details', 'User Controller: updatePasswordFunction')
                    let apiResponse = response.generate(true, 'No User Found', 404, null)
                    reject(apiResponse)
                } else {


                    let apiResponse = response.generate(false, 'Password Updated successfully', 200, result)
                    resolve(result)
                    //Creating object for sending welcome email

                    let sendEmailOptions = {
                        email: userDetails.email,
                        subject: 'Password Updated for Meeting scheduler ',
                        html: `<h4> Hi ${userDetails.firstName}</h4>
                        <p>
                            Password updated successfully.
                        </p>
                        <h3> Thanks for using Meeting scheduler </h3>
                                    `
                    }

                    setTimeout(() => {
                        emailLib.sendEmail(sendEmailOptions);
                    }, 2000);


                }
            });// end user model update
        });
    }//end passwordUpdate

    findUser(req, res)
        .then(passwordUpdate)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Password Update Successfully', 200, "None")
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })


}// end updatePasswordFunction


/* Function to change password and sending  email */
/* params : userId,oldPassword,newPassword
*/
let changePasswordFunction = (req, res) => {
    //finding user
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.userId != undefined && req.body.oldPassword != undefined) {
                console.log("req body userId and oldPassword is there");
                //console.log(req.body);
                UserModel.findOne({ userId: req.body.userId }, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"userId" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    //validate old password with database 
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        console.log(retrievedUserDetails);
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.oldPassword, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Validate Password Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Update Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    //password update 
    let passwordUpdate = (userDetails) => {
        return new Promise((resolve, reject) => {

            let updatedDetails = {
                password: passwordLib.hashpassword(req.body.newPassword),
            }

            UserModel.update({ 'userId': userDetails.userId }, updatedDetails).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller:updatePasswordFunction', 10)
                    let apiResponse = response.generate(true, 'Failed To update user Password', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found with given Details', 'User Controller: updatePasswordFunction')
                    let apiResponse = response.generate(true, 'No User Found', 404, null)
                    reject(apiResponse)
                } else {


                    let apiResponse = response.generate(false, 'Password Updated successfully', 200, result)
                    resolve(result)
                    //Creating object for sending welcome email

                    let sendEmailOptions = {
                        email: userDetails.email,
                        subject: 'Password Updated for .${tokenDetails.userDetails.email}',
                        html: `<h4> Hi ${userDetails.firstName}</h4>
                        <p>
                            Password updated successfully.
                        </p>
                        <h3> Thanks for using Meeting Scheduler </h3>
                                    `
                    }
                    console.log(sendEmailOptions)
                    
                    setTimeout(() => {
                        emailLib.sendEmail(sendEmailOptions);
                    }, 2000);


                }
            });// end user model update
        });
    }//end passwordUpdate

    //making promise call
    findUser(req, res)
        .then(validatePassword)
        .then(passwordUpdate)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Password Updated Successfully', 200, "None")
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })


}// end updatePasswordFunction



module.exports = {
    signUpFunction: signUpFunction,
    loginFunction: userLogin,
    verifyEmail: verifyEmailFunction,
    singleUser: getSingleUser,
    allUser : getAllUser,
    editUser:editUser,
    deleteUser: deleteUser,
    resetPassword: resetPasswordFunction,
    updatePassword: updatePasswordFunction,
    changePassword: changePasswordFunction,
    logout: logout
}