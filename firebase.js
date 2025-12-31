// Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyBBZxCwywnv_ZVXYezOV8IKG6iKWK5sL10",
    authDomain: "studio-ywlo1.firebaseapp.com",
    projectId: "studio-ywlo1",
    storageBucket: "studio-ywlo1.appspot.com",
    messagingSenderId: "791958850921",
    appId: "1:791958850921:web:149be668e7f132e59f41f8"
  };

firebase.initializeApp(firebaseConfig);

// Expose compat services
const auth = firebase.auth();
const db = firebase.database();

// Helpers for Realtime Database paths
function userProfilePath(uid){
  return `users/${uid}/profile`;
}
function videoStatsPath(videoId){
  return `videos/${videoId}/stats`;
}
function userVideoActionPath(uid, videoId){
  return `users/${uid}/actions/${videoId}`;
}

window.FirebaseServices = { auth, db, userProfilePath, videoStatsPath, userVideoActionPath };


<iframe src="file:///storage/emulated/0/index.html/ribrary/storage/books/Videos/video1.mp4" width="640" height="360" frameborder="0" allowfullscreen></iframe>
file:///storage/emulated/0/index.html/ribrary/storage/books/Videos/video1.mp4