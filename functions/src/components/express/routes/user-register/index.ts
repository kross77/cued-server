import {Router} from 'express';
import {createCustomToken, db} from "../../../admin";
import * as admin from "firebase-admin";

const userRegisterRouter: Router = Router();

/* POST userRegister listing. */


userRegisterRouter.post('/', async function (req, res, next) {
    try{
        const user: any = req.body;
        const {uid} = await admin.auth().createUser({
            email: user.email
        })
        const token = await createCustomToken(uid);
        await db.ref(`/users/${uid}`).set({
            ...user,
            token,
        });

        res.json({
            userId: uid,
            responseCode: 'ok',
        })
    }catch (e) {
        res.status(500).json({
            error: {
                message: e.message,
            }
        })
    }


    //add token to user record


});

export default userRegisterRouter;