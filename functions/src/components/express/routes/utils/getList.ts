/* POST contract listing. */
import {getArray} from "../../utils/collectionToArray";

export const getList = ({
                            router,
                            path = '/',
                            dbPath,
                            mapFn = (v, params) => v,
                            name,
                        }) => {

    router.get(path, async function (req, res, next) {
        try {
            const items = await getArray(dbPath);
            const mappedItems = await mapFn(items, {...req.params, user: req.user});
            res.json({
                [name]: mappedItems,
                responseCode: 'ok'
            })
        } catch (e) {
            res.status(500).json({error: {message: e.message}})
        }
    })

};