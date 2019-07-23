import {Router} from 'express';
import {db} from "../../../admin";
import {getArray} from "../../utils/collectionToArray";
import authTokenResolver from "../../resolvers/authTokenResolver";
import {getList} from "../utils/getList";

const projectMembersRouter: Router = Router();
projectMembersRouter.use(authTokenResolver)

/* POST projectMember listing. */
projectMembersRouter.post('/invite', async function (req, res, next) {
    const {projectId, email, ...member} = req.body;
    const members = await getArray(`/projects/${projectId}/members`);
    const existMember = members.find(v => v.email === email);
    if (existMember) {
        res.status(401).json(
            {error: {message: 'Member already invited'}}
        )
    } else {
        const {key} = await db.ref(`/projects/${projectId}/members`).push({...member, email, status: "INVITED"});
        res.json({
            id: key,
            responseCode: 'ok'
        })
    }

});

/* POST projectMember listing. */
projectMembersRouter.post('/accept', async function (req, res, next) {
    const {projectId, email} = req.body;
    const {user} = req.params;
    if (user.email.toLowerCase() !== email.toLowerCase()) {
        res.status(403).json({
            error: {
                code: 2,
                message: 'User could accept only own invitations'
            }
        })
    } else {
        await db.ref(`/projects/${projectId}/members/${email}`).update({status: 'ACCEPTED'})
    }

    res.json({
        responseCode: 'Succeed'
    })
});


getList({
    router: projectMembersRouter,
    dbPath: '/project-members/members',
    path: '/project-members/:projectId',
    name: 'members',
    mapFn: async (members) => {
        const users = await getArray('/users');
        return members.map(({email, ...member}) => {
            const user = users.find(u => u.email === email);
            return {
                ...member,
                ...user,
            }
        })
    }
})

export default projectMembersRouter;