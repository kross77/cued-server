import {Router} from 'express';
import {db} from "../../../admin";
import {getArray} from "../../utils/collectionToArray";
import authTokenResolver from "../../resolvers/authTokenResolver";

const projectMembersRouter: Router = Router();
projectMembersRouter.use(authTokenResolver)

/* POST projectMember listing. */
projectMembersRouter.post('/invite', async function (req, res, next) {
    const {projectId, email, ...member} = req.body;
    const {key} = await db.ref(`/projects/${projectId}/members`).push({...member, email, status: "INVITED"});
    res.json({
        id: key,
        responseCode: 'ok'
    })
});

/* POST projectMember listing. */
projectMembersRouter.post('/accept', async function (req, res, next) {
    const {projectId, email} = req.body;
    const {user} = req.params;
    if(user.email.toLowerCase() !== email.toLowerCase()){
        res.status(403).json({
            error: {
                code: 2,
                message: 'User could accept only own invitations'
            }
        })
    }else{
        await db.ref(`/projects/${projectId}/members/${email}`).update({status: 'ACCEPTED'})
    }

    res.json({
        responseCode: 'Succeed'
    })
});

/* POST projectMember listing. */
projectMembersRouter.get('/project-members/:projectId', async function (req, res, next) {
    const {projectId} = req.params;
    const members = await getArray(`/projects/${projectId}/members`);
    const users = await getArray('/users');
    const userMembers = members.map( ({id: email, ...member}) => {
        const user = users.find(u => u.email === email);
        return {
            ...user,
            ...member,
        }
    })

    res.json({
        members: userMembers,
        responseCode: 'ok'
    })
});

export default projectMembersRouter;