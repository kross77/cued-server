import {Router} from 'express';
import {db} from "../../../admin";
import {getArray} from "../../utils/collectionToArray";
import {getById} from "../utils/getById";
import {addItem} from "../utils/addItem";
import {getList} from "../utils/getList";

const router: Router = Router();

addItem({
    router,
    dbPath: '/contracts'
})

getList({
    router,
    path: '/all/:projectId',
    dbPath: '/contracts',
    name: 'contracts',
    mapFn: (contracts, {projectId: id}) => contracts.filter(({projectId}) => projectId === id)
})

getById({
    router,
    dbPath: '/contracts'
})

export default router;