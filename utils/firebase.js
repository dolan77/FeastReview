//const { initializeApp, cert } = require('firebase-admin/app');
//const { getFirestore } = require('firebase-admin/firestore');
import firestore from '@react-native-firebase/firestore';
//const apiKey = require('../../api_keys.json').firebase;

module.exports = {dbGet, dbSet};

/**
 * a utility class to simply usage of firebase functions
 */

// example of usage
//get('api_keys', 'key').then((result) => console.log(result));


const db = firestore();

async function dbGet(collection, doc){
    const docSnapshot = await db.collection(collection).doc(doc).get();
    return docSnapshot.data();
}

async function dbSet(collection, doc, value){
    const docRef = db.collection(collection).doc(doc);
    await docRef.set(value);
}
