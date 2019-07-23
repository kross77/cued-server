import {Router} from 'express';
import {db} from "../../../admin";
import {getArray} from "../../utils/collectionToArray";
import {addItem} from "../utils/addItem";
import {getById} from "../utils/getById";

const projectTransfersRouter: Router = Router();

/* POST contract listing. */
addItem({
    router: projectTransfersRouter,
    dbPath: '/project-transfers'
})

getById({
    router: projectTransfersRouter,
    dbPath:  '/project-transfers'
})


export default projectTransfersRouter;