const {verify} = require('../helpers/jwt');
const {User} = require('../models/index');

async function UserAuthenticationMiddleware(req,res,next){
    try {
        const {authorization} = req.headers;
        if (!authorization) throw {name: 'AuthenticationFailed'};
        token = authorization.split('Bearer ');
        if (token.length !== 2) throw {name: 'invalidToken'};
        const {id , email } = verify(token[1]);
        const user = await User.findOne({where: {id, email}});
        if (!user) throw {name: 'unauthorized'};
        req.user = {id , email};
        next();
    } catch (error) {
        next(error)
    }
}

module.exports=UserAuthenticationMiddleware;