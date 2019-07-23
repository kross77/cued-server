import {Router} from 'express';
import {addItem} from "../utils/addItem";
import {getById} from "../utils/getById";
import {getList} from "../utils/getList";

const smartContractRouter: Router = Router();

addItem({
    router: smartContractRouter,
    dbPath: '/smart-contracts',
    method: 'put',
});

getList({
    router: smartContractRouter,
    dbPath: '/smart-contracts',
    path: '/smart-contracts/:projectId',
    name: 'smartContracts',
    mapFn: async (contracts, {projectId}) => (
        contracts.filter(v => v.projectId === projectId)
    )
});

getById({
    router: smartContractRouter,
    dbPath: '/smart-contracts',
    path: '/smart-contracts/:projectId/:smartContractType',
    findItem: (items, {projectId, smartContractType}) => {
        return items.find(v => v.projectId === projectId && smartContractType === smartContractType)
    }
});


export default smartContractRouter;