import {Router} from 'express';
import {getArray} from "../../utils/collectionToArray";
import {getById} from "../utils/getById";
import smartContractRouter from "../project-smartcontracts";

const loginRouter: Router = Router();

/* GET users listing. */
loginRouter.post('/', async function (req, res, next) {
    const {email, encryptedData: signature} = req.body;
    const users = await getArray('/users');
    const user = users.find(v => email === v.email && signature === v.signature)
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