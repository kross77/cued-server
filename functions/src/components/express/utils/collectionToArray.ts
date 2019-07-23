import {db} from "../../admin";

const collectionToArray = (collection):any[] => {
    return Object.entries(collection).map(([id, value]) => ({id, ...value}))
}

export const getArray = async (path): Promise<any[]> => {
    console.log(`getArray ${JSON.stringify(path)}`)
    const collection = await db.ref(path).once('value');
    const json = collection.val();
    console.log("RESULT", {collection: json})
    return collectionToArray(json);
}

export default collectionToArray;