const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const appConfig = require('./../../config/appConfig');
const auth = require('./../middlewares/auth');

module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/users`;
    console.log(baseUrl);

    // params: firstName, lastName, email, password , mobileNumber.
    app.post(`${baseUrl}/signup`, userController.signUpFunction);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup User Register.
     *
     * @apiParam {string} firstName First Name of the user. (body params) (required)
     * @apiParam {string} lastname Last Name of the user. (body params) (required)
     * @apiParam {string} userName userName of the user. (body params) (required)
     * @apiParam {string} countryName country Name of the user. (body params) (required)
     * @apiParam {string} mobileNumber Mobile Number of the user. (body params) (required)
     * @apiParam {string} isAdmin String(true/false) true-if user is admin and false-if user is not admin. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
        "error": false,
        "message": "User Created",
        "status": 200,
        "data": [
            {
                "createdOn": "2018-09-12T13:42:58.000Z",
                "emailVerified": "Yes",
                "validationToken": "Null",
                "email": "sayyedsofttech313@gmail.com",
                "password": "$2a$10$XvHxf9JX76JvvIeqwd2CoOdxtCraX23nR2ToAYIhynLmNquDFdbOa",
                "isAdmin": "true",
                "mobileNumber": "91 7840962887",
                "countryName": "India",
                "userName": "Shah-admin",
                "lastName": "Sayyed",
                "firstName": "Shahrukh",
                "userId": "B1cyuc8OX"
            }
        }
    */

    // params: email, password.
    app.post(`${baseUrl}/login`,userController.loginFunction);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login User Login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InJrVW51b2pPbSIsImlhdCI6MTUzNzA5MTc1NzU1NywiZXhwIjoxNTM3MTc4MTU3LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJsZXRzTWVldEFwcCIsImRhdGEiOnsiZW1haWxWZXJpZmllZCI6IlllcyIsInZhbGlkYXRpb25Ub2tlbiI6Ik51bGwiLCJlbWFpbCI6InNheXllZHNvZnR0ZWNoMzEzQGdtYWlsLmNvbSIsImlzQWRtaW4iOiJ0cnVlIiwibW9iaWxlTnVtYmVyIjoiOTEgNzg0MDk2Mjg4NyIsImNvdW50cnlOYW1lIjoiSW5kaWEiLCJ1c2VyTmFtZSI6IlNoYWgtYWRtaW4iLCJsYXN0TmFtZSI6IlNheXllZCIsImZpcnN0TmFtZSI6IlNoYWhydWtoIiwidXNlcklkIjoiQjFjeXVjOE9YIn19.fcCu0TZQ-WnAs8bOmZa9YhF1YVv2JscTwOPT--rTwbc",
                "userDetails": {
                    "emailVerified": "Yes",
                    "validationToken": "Null",
                    "email": "sayyedsofttech313@gmail.com",
                    "isAdmin": "true",
                    "mobileNumber": "91 7840962887",
                    "countryName": "India",
                    "userName": "Shah-admin",
                    "lastName": "Sayyed",
                    "firstName": "Shahrukh",
                    "userId": "B1cyuc8OX"
                }
            }
        }    
    */
    // params: userId.
    app.put(`${baseUrl}/verifyEmail`, userController.verifyEmail);
     /**
       * @apiGroup users
       * @apiVersion  1.0.0
       * @api {put} /api/v1/users/verifyEmail Verify-Email.
       *
       * @apiParam {string} userId userId of the user. (body params) (required)
       *
       * @apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       * @apiSuccessExample {object} Success-Response:
          {
              "error": false,
              "message": "User email verified",
              "status": 200,
              "data": "None"
          }
      */
          
    //params: userId, authToken.      
    app.post(`${baseUrl}/:userId/logout`, auth.isAuthorized, userController.logout);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/:userId/logout Log-Out Api.
     *
     * @apiParam {string} userId userId of the user. (query params) (required)
     * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)

     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null
        }
    */
    app.put(`${baseUrl}/updatePassword`, userController.updatePassword);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/updatePassword Update Password.
     *
     * @apiParam {string} validationToken validationToken of the user recieved on Email. (body params) (required)
     * @apiParam {string} password new password of the user . (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Password Update Successfully",
            "status": 200,
            "data": "None"
            
        }
    */

    app.post(`${baseUrl}/resetPassword`, userController.resetPassword);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/resetPassword Password Reset.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Password reset instructions sent successfully",
            "status": 200,
            "data": None
        }    
    */

    app.post(`${baseUrl}/changePassword`, auth.isAuthorized,userController.changePassword);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/changePassword Change Password.
     *
     * @apiParam {string} userId userId of the user. (body params) (required)
     * @apiParam {string} oldPassword old Password of the user. (body params) (required)
     * @apiParam {string} newPassword new Password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Password Update Successfully",
            "status": 200,
            "data": "None"
        }
    */
    // params: userId.
    app.put(`${baseUrl}/:userId/edit`, auth.isAuthorized, userController.editUser);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/:userId/edit Edit User Details.
     *
     * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
     * @apiParam {string} userId userId of the user. (query params) (required)
     * @apiParam {string} firstName First Name of the user. (body params) (optional)
     * @apiParam {string} lastname Last Name of the user. (body params) (optional)
     * @apiParam {string} mobileNumber Mobile Number of the user. (body params) (optional)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "User details Updated",
            "status": 200,
            "data": "None"
        }
    */

    
    // params: userId.
    app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);
     /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/:userId/delete Delete User.
     *
     * @apiParam {string} userId userId of the user. (query params) (required)
     * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)

     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Deleted the user successfully",
            "status": 200,
            "data": {
                "createdOn": "2018-09-12T13:42:58.000Z",
                "emailVerified": "Yes",
                "validationToken": "Null",
                "email": "sayyedsofttech313@gmail.com",
                "password": "$2a$10$XvHxf9JX76JvvIeqwd2CoOdxtCraX23nR2ToAYIhynLmNquDFdbOa",
                "isAdmin": "true",
                "mobileNumber": "91 7840962887",
                "countryName": "India",
                "userName": "Shah-admin",
                "lastName": "Sayyed",
                "firstName": "Shahrukh",
                "userId": "B1cyuc8OX"
            }
        }
    */
    app.get(`${baseUrl}/view/all`, auth.isAuthorized, userController.allUser);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/view/all Get All Users.
     *
     * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "All User Details Found",
            "status": 200,
            "data": [
                {
                    "createdOn": "2018-09-12T13:42:58.000Z",
                    "emailVerified": "Yes",
                    "validationToken": "Null",
                    "email": "sayyedsofttech313@gmail.com",
                    "password": "$2a$10$XvHxf9JX76JvvIeqwd2CoOdxtCraX23nR2ToAYIhynLmNquDFdbOa",
                    "isAdmin": "true",
                    "mobileNumber": "91 7840962887",
                    "countryName": "India",
                    "userName": "Shah-admin",
                    "lastName": "Sayyed",
                    "firstName": "Shahrukh",
                    "userId": "B1cyuc8OX"
                }
            ]
        }
    */

    // params: userId.
    app.get(`${baseUrl}/:userId/details`, auth.isAuthorized,userController.singleUser);
     /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/:userId/details Get All Users Details.
     *
     * @apiParam {string} userId userId of the user. (query params) (required)
     * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)

     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "User Details Found",
            "status": 200,
            "data": {
                "createdOn": "2018-09-12T13:42:58.000Z",
                "emailVerified": "Yes",
                "validationToken": "Null",
                "email": "sayyedsofttech313@gmail.com",
                "password": "$2a$10$XvHxf9JX76JvvIeqwd2CoOdxtCraX23nR2ToAYIhynLmNquDFdbOa",
                "isAdmin": "true",
                "mobileNumber": "91 7840962887",
                "countryName": "India",
                "userName": "Shah-admin",
                "lastName": "Sayyed",
                "firstName": "Shahrukh",
                "userId": "B1cyuc8OX"
            }
        }
    */
}