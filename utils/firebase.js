import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
//import firebase from '@react-native-firebase/app';

module.exports = {dbCreateBlank, dbGet, dbSet, dbFileGetUrl, dbFileAdd, dbGetReviews, dbUpdate, dbUpdateOnce, dbUpdateArrayAdd, dbUpdateArrayRemove, dbGetFollowers, dbGetFollowed, dbIncrement};


/**
 * a utility class to simplify usage of firebase functions
 */


const db = firestore();

/**
 * creates a blank document, doesnt do anything to existing documents
 * @param {*} collection 
 * @param {*} doc 
 * @returns 
 */
async function dbCreateBlank(collection, doc){
    return db.collection(collection).doc(doc).set({}, {merge:true});
}

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
 * simple file getter
 * @param {*} filename name to get
 * @returns promise of url
 * EXAMPLE CODE
 *  const [imageUrl, setImageUrl] = React.useState(undefined);
 *  React.useState(() => {
 *      dbFileGetUrl('investor.jpg').then((url) => {
 *           setImageUrl(url);
 *      })
 *      .catch(() => console.log("Downloading file from Firebase failed."));
 *  });
 */
async function dbFileGetUrl(filename){
    return storage().ref(filename).getDownloadURL();
}

/**
 * simple file adder
 * @param {*} filename name of the file to upload
 * @param {*} filePath the file path of the image to upload
 * @returns task object
 *  EXAMPLE CODE USING IMAGE-PICKER
 *   const [image, setImage] = React.useState(undefined);
 *   const selectImage = () => {
 *       const options = {
 *         storageOptions: {
 *           skipBackup: true,
 *           path: 'images'
 *         }
 *       };
 *
 *       launchImageLibrary(options).then(response => {
 *           setImage(response.assets[0].uri);
 *       });
 *     };
 *
 *   const uploadImage = async () => {
 *       const uploadUri = image;
 *       console.log(uploadUri);
 *       const task = dbFileAdd("test.jpg", uploadUri)
 *       try {
 *           await task;
 *       } catch (e) {
 *           console.error(e);
 *       }
 *       setImage(null);
 *   };
 */
async function dbFileAdd(filename, filePath){
    const ref = storage().ref(filename);
    return ref.putFile(filePath);
}

/**
 * simple query that returns all reviews that have fields equal to keyword
 * @param {*} keyword what the field equals
 * @param {*} field default value is restaurant_alias but can use whatever field you want
 * @returns list of all objects matching query
 */
async function dbGetReviews(keyword, field="restaurant_alias"){
    let query = db.collection("reviews").where(field, "==", keyword).get().then((reviews_query) => {
        let reviews = [];
        reviews_query.docs.forEach((review_query) => {
            reviews.push(review_query.data())
        });
        return reviews;   
    });

    return query? query: [];
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


/**
 * acquires a map of all users that follow a specific user by id
 * @param {*} uid user id we are getting followers of
 * @returns 
 */
async function dbGetFollowers(uid){
    let query = await db.collection("users").where("following", "array-contains", uid).get().then((user_query) => {
        let followers = new Map();
        user_query.docs.forEach((user_query) => {
            followers.set(user_query.ref.id, user_query.data());
        });
        return followers;   
    });
    
    return query? query: new Map();
}

/**
 * acquires a map of all users given a list of users
 * @param {*} followedList list the original user follows
 * @returns 
 */
async function dbGetFollowed(followedList){
    let query = await db.collection("users").where(firebase.firestore.FieldPath.documentId(), "in", followedList).get().then((user_query) => {
        let followed = new Map();
        user_query.docs.forEach((user_query) => {
            followed.set(user_query.ref.id, user_query.data());
        });
        return followed;   
    });
    
    return query? query: new Map();
}

/**
 * increments values by 1
 * @param {*} collection 
 * @param {*} doc 
 * @param {*} fields 
 * @returns 
 */
async function dbIncrement(collection, doc, fields){
    Object.keys(fields).forEach((key) => {
        fields[key] = firestore.FieldValue.increment(1);
    });
    return dbUpdate(collection, doc, fields);
}