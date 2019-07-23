import {Router} from 'express';
import {db} from "../../../admin";
import {getArray} from "../../utils/collectionToArray";
import authTokenResolver from "../../resolvers/authTokenResolver";

const projectRouter: Router = Router();
projectRouter.use(authTokenResolver)
/* POST project listing. */
projectRouter.post('/', async function (req, res, next) {
    const project = req.body;
    const {key: id} = await db.ref('/projects').push(project);
    res.json({
        id,
        responseCode: 'ok'
    })
});

/* GET list. */
projectRouter.get('/', async function (req, res, next) {
    const projects = await getArray('projects');
    console.log('GET PROJECTS')
    res.json({
        projects,
        responseCode: 'ok'
    })
});

export default projectRouter;