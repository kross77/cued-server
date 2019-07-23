/* POST contract listing. */
import {getArray} from "../../utils/collectionToArray";

export const getById = ({
                            router,
                            path = '/:id',
                            findItem = (items, params) => items.find(v => v.id === params.id),
                            dbPath,
                        }) =>
{
    return router.get(path, async function (req, res, next) {
        const items = await getArray(dbPath);
        const item = await findItem(items, req.params)
        res.json({
            ...item
        })
    });
}