import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

module.exports = {dbGet, dbSet, dbFileGetUrl, dbFileAdd};

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