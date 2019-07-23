import * as admin from 'firebase-admin';
import * as functions from "firebase-functions";
admin.initializeApp();

import app from "./components/express/app";

exports.app = functions.https.onRequest(app);
