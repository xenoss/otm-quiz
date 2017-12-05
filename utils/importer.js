const admin = require('firebase-admin');
const questions = require('../data/questions');

const serviceAccount = require('../conf/quiz-ac49e-firebase-adminsdk-mydl1-6fdb895a54.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://quiz-ac49e.firebaseio.com',
});

const db = admin.database();
const ref = db.ref('questions');

ref.set(questions).then((data) => {
    console.log('Imported ', data);
})
.then(()=>{
    admin.auth().createUser({
        email: 'test@xenoss.io',
        emailVerified: false,
        phoneNumber: '+11234567890',
        password: 'fefIUf35OJFOedm289$',
        displayName: 'John Doe',
        disabled: false,
    })
})
    .then(u => console.log('User created'))
    .then(() => process.exit())
    .catch(err => console.log('err ', err));



// database.ref('/questions').once('value')
//     .then(data=>console.log(data))
//     .catch(err=>console.log(err))
