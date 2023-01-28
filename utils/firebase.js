const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const apiKey = require('../../api_keys.json').firebase;

module.exports = {get, set};

/**
 * a utility class to simply usage of firebase functions
 */

// example of usage
//get('api_keys', 'key').then((result) => console.log(result));

initializeApp({
    credential: cert(apiKey)
});

const db = getFirestore();

async function get(collection, doc){
    const docSnapshot = await db.collection(collection).doc(doc).get();
    return docSnapshot.data();
}

async function set(collection, doc, value){
    const docRef = db.collection(collection).doc(doc);
    await docRef.set(value);
}
