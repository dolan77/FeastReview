import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

module.exports = {dbGet, dbSet, dbFileGetUrl};

/**
 * a utility class to simplify usage of firebase functions
 */


const db = firestore();

/**
 * simple getter function
 * @param {*} collection 
 * @param {*} doc 
 * @returns the object stored in the collection's document
 */
async function dbGet(collection, doc){
    const docSnapshot = await db.collection(collection).doc(doc).get();
    return docSnapshot.data();
}

/**
 * simple setter
 * @param {*} collection 
 * @param {*} doc 
 * @param {*} value the object overwriting the collection's doc value
 */
async function dbSet(collection, doc, value){
    const docRef = db.collection(collection).doc(doc);
    await docRef.set(value);
}


async function dbFileGetUrl(filename){
    return storage().ref(filename).getDownloadURL();
}