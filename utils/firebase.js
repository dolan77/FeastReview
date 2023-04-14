import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { CountQueuingStrategy } from 'node:stream/web';
//import firebase from '@react-native-firebase/app';

module.exports = {del, dbGet, dbSet, dbFileGetUrl, dbFileAdd, dbGetReviews, dbUpdate, dbUpdateOnce, dbDelete, dbUpdateArrayAdd, dbUpdateArrayRemove, dbGetQuery, dbGetFollowers, dbGetFollowed, dbGetReviews, dbSetReviewComment, dbGetReviewComments, dbGetReviewPhotos };


/**
 * a utility class to simplify usage of firebase functions
 */


const db = firestore();

// allows for deleting
// dbUpdate(someCollection, someDoc, {someValue: firebase.del});
const del = firestore.FieldValue.delete();

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
    return dbGetQuery("reviews", field, "==", keyword);
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
    return docRef.set(field, {merge:true});
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
    return docRef.set(updatedField, {merge:true});
}


/**
 * makes deleting simple, use literally the same way as a normal update it overwrites the value to delete
 * @param {*} collection 
 * @param {*} doc 
 * @param {*} fields field an object that has the fields you want to update in a document
 *                example => {field:"literally anything, its gonna get overwritten"}
 *            also works with dot notation
 *                 example => {field.nestField: "literally anything, its gonna get overwritten"}
 * @returns 
 */
async function dbDelete(collection, doc, fields){
    Object.keys(fields).forEach((key) => {
        fields[key] = firestore.FieldValue.delete();
    });
    return dbUpdate(collection, doc, fields);
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
 * general query to get a map
 * @param {} collection collection the documents are being queried from
 * @param {*} targetValue the document value you are comparing to
 * @param {*} operator the type of operation like == or in
 * @param {*} fromValue the input value you wanna check
 * @returns map of document id to its content
 */
async function dbGetQuery(collection, targetValue, operator, fromValue){
    let query = await db.collection(collection).where(targetValue, operator, fromValue).get().then((user_query) => {
        let results = new Map();
        user_query.docs.forEach((user_query) => {
            results.set(user_query.ref.id, user_query.data());
        });
        return results;   
    });
    
    return query? query: new Map();
}

/**
 * acquires a map of all users that follow a specific user by id
 * @param {*} uid user id we are getting followers of
 * @returns 
 */
async function dbGetFollowers(uid){
    return dbGetQuery("users", "following", "array-contains", uid);
}

/**
 * acquires a map of all users given a list of users
 * @param {*} followedList list the original user follows
 * @returns 
 */
async function dbGetFollowed(followedList){
    return dbGetQuery("users", firebase.firestore.FieldPath.documentId(), "in", followedList);
}



/**
 * 
 * @param {*} review_id the identifier for the review to be commented on
 * @param {*} comment_id the identifier for the comment to be uploaded
 * @param {*} value the fields of the comment 
 * @returns 
 */
async function dbSetReviewComment(review_id, comment_id, value) {
    const docRef = db.collection('reviews').doc(review_id).collection('comments').doc(comment_id);
    return docRef.set(value);
}

/**
 * 
 * @param {*} review_id 
 * @returns array of all comments related to the specified review
 */
async function dbGetReviewComments(review_id) {
    const query = await db.collection('reviews').doc(review_id).collection('comments').get();
    return query.docs.map(doc => doc.data());
}

/**
 * 
 * @param {*} image_urls an array of the names of each image stored on the db
 * @returns an array of each photo's full URL which can be used as a 'uri'
 *          for an <Image/>'s source
 */
async function dbGetReviewPhotos(image_urls) {
    var urls = []
    for (const url of image_urls) {
            await dbFileGetUrl('ReviewPhotos/' + url)
                .then((db_url) => {
                    urls = [...urls, db_url];
                })
        }
    return urls;
}