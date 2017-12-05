import * as firebase from 'firebase';
import config from './config';

let database; // eslint-disable-line no-unused-vars

export const init = () => {
    firebase.initializeApp(config.firebase);
    database = firebase.database();
};

export const db = () => {
    if (firebase.apps.length === 0) {
        init();
    }
    return firebase.database();
};

