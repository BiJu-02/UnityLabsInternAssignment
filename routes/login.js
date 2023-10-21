const db = require('../utils/connectDb');
const authUtil = require('../utils/auth');

module.exports = require('express').Router().post('/auth/login', async (req, res) => {
    const respObj = {};
    if (    // validation for existence of those parameters and their type
        typeof(req.body.userName) === 'string'  &&
        typeof(req.body.password) === 'string'
    ) {
        const usersCollection = db.collection('users');
        let dbRes = await usersCollection.findOne({uName: req.body.userName});
        if (dbRes) {
            if (dbRes.uPassHash === authUtil.genHash(req.body.password)) {
                respObj.newToken = authUtil.genToken(req.body.userName);
                respObj.message = 'Login successful';
            } else {
                respObj.message = 'Incorrect password';
            }
        } else {
            respObj.message = 'User not found';
        }
    } else {
        res.status(400);
        respObj.message = 'Invalid parameters';
    }
    res.send(respObj);
});