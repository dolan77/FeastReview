const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const dbKey = require('./db_key.json');

initializeApp({
    credential: cert(dbKey)
});


const db = getFirestore();

async function setZero() {
    const docRef = db.collection('tests').doc('ide_setup');

    await docRef.set({
        test_number: 0
    });
}

async function logCollection() {
    const snapshot = await db.collection('tests').get();
    console.log(snapshot);
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });
}

async function getTestNumber() {
    const snapshot = await db.collection('tests').get();
    let testNumber = snapshot.docs[0].data()['test_number'];
    return testNumber;
}

async function incrementTestNumber() {
    let testNumber = await getTestNumber();
    console.log('before increment: ' + testNumber);

    const docRef = db.collection('tests').doc('ide_setup');

    await docRef.set({
        test_number: testNumber + 1
    });

    testNumber = await getTestNumber();
    console.log('after increment: ' + testNumber);

}

incrementTestNumber();


