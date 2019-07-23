import {db, verifyIdToken} from "../../admin";
import {getArray} from "../utils/collectionToArray";

export const authTokenResolver = async (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize yourrequest by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>',
            'or by passing a "__session" cookie.');
        res.status(403).json({error: {message: 'Unauthorized'}});
        return;
    }

    let idToken;
    try{
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            console.log('Found "Authorization" header');

            // Read the ID Token from the Authorization header.
            idToken = req.headers.authorization.split('Bearer ')[1];
            const users = await getArray('/users')

            const user = users.find( v => v.token === idToken);
            console.log({user, idToken})
            if(user){
                req.params.user = user;
                next()
                return;
            }

        }
    }catch (e) {
        res.status(403).json({error: {message: e.message}});
        return;
    }


    res.status(403).json({error: {message: 'Unauthorized'}});
    return;

};

export default authTokenResolver;
