import firestore from '@react-native-firebase/firestore';

module.exports = {dbGet, dbSet, dbUpdate, dbUpdateOnce, dbUpdateArrayAdd, dbUpdateArrayRemove};

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
    return docRef.set(value);
}


/**
 * adder that updates based on supplied field
 * @param {*} collection 
 * @param {*} doc 
 * @param {*} field an object that has the fields you want to update in a document
 *                example => {field:"to update"}
 *            also works with dot notation
 *                 example => {field.nestField: "to update"}
 */
async function dbUpdate(collection, doc, field){
    const docRef = db.collection(collection).doc(doc);
    return docRef.update(field);
}

/**
 * simpler adder that updates only one field but is much easier to use
 * @param {*} collection 
 * @param {*} doc 
 * @param {string} field to update
 *               also works with dot notation
 *                 example => "field.nestField"
 * @param {*} value you want to change to
 */
async function dbUpdateOnce(collection, doc, field, value){
    const docRef = db.collection(collection).doc(doc);
    let updatedField = {[field]: value};
    return docRef.update(updatedField);
}

/**
 * simple adder that uses dbUpdate for array changes
 * @param {*} collection 
 * @param {*} doc 
 * @param {string} field to update
 *               also works with dot notation
 *                 example => "field.nestField"
 * @param {[]} values in an array that you want to add
 * @returns 
 */
async function dbUpdateArrayAdd(collection, doc, field, values){
    return dbUpdateOnce(collection, doc, field, firestore.FieldValue.arrayUnion(...values));
}

/**
 * simple adder that uses dbUpdate for array changes
 * @param {*} collection 
 * @param {*} doc 
 * @param {string} field to update
 *               also works with dot notation
 *                 example => "field.nestField"
 * @param {[]} values in an array that you want to remove
 * @returns 
 */
async function dbUpdateArrayRemove(collection, doc, field, values){
    return dbUpdateOnce(collection, doc, field, firestore.FieldValue.arrayRemove(...values));
}

