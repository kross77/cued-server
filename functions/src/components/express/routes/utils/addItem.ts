/* POST contract listing. */
import {db} from "../../../admin";

export const addItem = ({
                            router,
                            dbPath,
                            method = "post"
                        }) =>
    router[method]('/', async function (req, res, next) {
        const record = req.body;
        const {key: id} = await db.ref(dbPath).push(record);
        res.json({
            id,
            responseCode: 'ok'
        })
    });