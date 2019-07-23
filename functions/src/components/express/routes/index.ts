import userRegister from "./user-register";
import login from "./login";
import project from "./project";
import projectMembers from "./project-members";
import smartcontracts from "./project-smartcontracts";


const addRoutes = (app) => {
    app.use('/user-register', userRegister);
    app.use('/login', login);
    app.use('/project', project);
    app.use('/project-members', projectMembers);
    app.use('/project-smartcontracts', smartcontracts);
    // app.use(authTokenResolver);
};

export default addRoutes;