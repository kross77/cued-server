import {Router} from 'express';
import {db} from "../../../admin";
import collectionToArray from "../../utils/collectionToArray";

const loginRouter: Router = Router();
/* GET users listing. */
loginRouter.post('/', async function (req, res, next) {
    const {email, encryptedData: publicKey}: { [key: string]: any } = req.body;
    const usersObject: { [key: string]: any } = await db.ref('/users')
    const users = collectionToArray(usersObject);
    const user = users.find(v => email === v.email && publicKey === v.publicKey)
    if (user) {
        res.json({
            authToken: user.token,
            userId: user.id,
            responseCode: 'ok',
        })
    } else {
        res.status(403).json({
            error: {
                code: 1,
                message: "User not found"
            },
        })
    }

});

export default loginRouter;