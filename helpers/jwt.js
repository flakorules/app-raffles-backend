const jwt = require('jsonwebtoken');

const createJWT = (uid, userName) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid, userName
        };

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('Token could not be created');
            }

            resolve(token);

        })
    })
}

module.exports = {
    createJWT
}