import { auth as firebaseAuth } from 'firebase';
import { db } from './firebase';

export function saveUser(user) {
    return db().ref().child(`users/${user.uid}/info`)
        .set({
            email: user.email,
            uid: user.uid,
        })
        .then(() => user);
}

export function saveUserScores(scores) {
    const userId = firebaseAuth().currentUser.uid;
    return db().ref().child(`user/${userId}/quiz`)
        .set({
            scores,
        })
        .then(res => res);
}

export function getUserScores() {
    const userId = firebaseAuth().currentUser.uid;
    return db().ref(`user/${userId}/quiz`).once('value');
}

export function auth(email, pw) {
    return firebaseAuth().createUserWithEmailAndPassword(email, pw)
        .then(saveUser);
}

export function logout() {
    return firebaseAuth().signOut();
}

export function login(email, pw) {
    return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetPassword(email) {
    return firebaseAuth().sendPasswordResetEmail(email);
}

function getProviderForProviderId(providerId) {
    if (providerId === 'facebook') {
        return new firebaseAuth.FacebookAuthProvider();
    } else if (providerId === 'google.com') {
        return new firebaseAuth.GoogleAuthProvider();
    }
    return null;
}

export function socialAuth(providerId) {
    return firebaseAuth()
        .signInWithPopup(getProviderForProviderId(providerId))
        .then(result => result.user);
}

export function getProvidersForEmail(email) {
    return firebaseAuth().fetchProvidersForEmail(email).then((providers) => {
        if (providers[0] === 'password') {
            return providers[0];
        }
        const provider = getProviderForProviderId(providers[0]);
        return provider;
    });
}

export function socialLink(provider, pendingCred) {
    return firebaseAuth()
        .signInWithPopup(provider)
        .then(result => result.user.linkWithCredential(pendingCred).then(() => true));
}

export function passwordLink(user, pendingCred) {
    return user.linkWithCredential(pendingCred).then(() => true);
}
