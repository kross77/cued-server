import {Router} from 'express';
import {db} from "../../../admin";
import {getArray} from "../../utils/collectionToArray";

const contractsRouter: Router = Router();

/* POST contract listing. */
contractsRouter.put('/', async function (req, res, next) {

    const contract = req.body;
    const {key: id} = await db.ref('/contracts').push(contract);
    res.json({
        id,
        responseCode: 'ok'
    })
});

/* POST contract listing. */
contractsRouter.get('/:projectId', async function (req, res, next) {
    const {projectId} = req.params;
    const contracts = await getArray('/contracts');
    contracts.filter(v => v.projectId === projectId);
    res.json({
        contracts,
        responseCode: 'ok'
    })
});

export default contractsRouter;