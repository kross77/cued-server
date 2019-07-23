import {Router} from 'express';
import authTokenResolver from "../../resolvers/authTokenResolver";
import {addItem} from "../utils/addItem";
import {getList} from "../utils/getList";

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

export default projectRouter;