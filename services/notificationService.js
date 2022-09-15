var admin = require("firebase-admin");

var serviceAccount = require("../config/beeritup-95b7f-firebase-adminsdk-xjgpa-4a54de3d19.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://beeritup-95b7f.firebaseio.com'
});

module.exports = admin