import {Router} from 'express';
import authTokenResolver from "../../resolvers/authTokenResolver";
import {addItem} from "../utils/addItem";
import {getList} from "../utils/getList";
import {getById} from "../utils/getById";

const projectRouter: Router = Router();
projectRouter.use(authTokenResolver)
/* POST project listing. */

addItem({
    router: projectRouter,
    dbPath: '/projects'
})

getList({
    router: projectRouter,
    dbPath: '/projects',
    name: 'projects',
    mapFn: (projects, {user}) => projects.filter(v => v.ownerId === user.id)
})

getById({
    router: projectRouter,
    dbPath: '/projects',
})

export default projectRouter;