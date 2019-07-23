import * as admin from 'firebase-admin';


export const db = admin.database();
export const auth = admin.auth();
export const verifyIdToken = async(id) => await auth.verifyIdToken(id);
export const createCustomToken = async (uid) => await auth.createCustomToken(uid);