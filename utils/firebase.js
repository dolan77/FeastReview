const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const dbKey = require('../../db_key.json');

initializeApp({
    credential: cert(dbKey)
});

const db = getFirestore();

module.exports = {get, set};

get('api_keys', 'key').then((result) => console.log(result));

async function get(collection, doc){
    const docSnapshot = await db.collection(collection).doc(doc).get();
    return docSnapshot.data();
}

async function set(collection, doc, value){
    const docRef = db.collection(collection).doc(doc);
    await docRef.set(value);
}
