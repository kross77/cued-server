import userRegister from "./user-register";
import login from "./login";
import project from "./project";
import projectMembers from "./project-members";
import smartcontracts from "./project-smartcontracts";
import contracts from "./project-contracts";
import transfers from "./project-transfers";


const addRoutes = (app) => {
    app.use('/user-register', userRegister);
    app.use('/login', login);
    app.use('/project', project);
    app.use('/project-members', projectMembers);
    app.use('/project-smartcontracts', smartcontracts);
    app.use('/project-contracts', contracts);
    app.use('/project-transfers', transfers);
};

export default addRoutes;