import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getDatabase, ref, set, get, update, onValue, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';
let app, auth, db, stopRoomListener = null;
export function initFirebase(){
  if(!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('PASTE_')) throw new Error('Add your Firebase web configuration in firebase-config.js first.');
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app); db = getDatabase(app); return {auth,db};
}
export async function connectFirebase(){initFirebase();if(!auth.currentUser){const credential=await signInAnonymously(auth);return {uid:credential.user.uid};}return {uid:auth.currentUser.uid};}
export async function registerAccount(email,password,displayName){initFirebase();const cred=await createUserWithEmailAndPassword(auth,email,password);if(displayName)await updateProfile(cred.user,{displayName});return cred.user;}
export async function loginAccount(email,password){initFirebase();const cred=await signInWithEmailAndPassword(auth,email,password);return cred.user;}
export async function logoutAccount(){initFirebase();await signOut(auth);}
export async function resetAccountPassword(email){initFirebase();await sendPasswordResetEmail(auth,email);}
export function watchAuth(callback){initFirebase();return onAuthStateChanged(auth,callback);}
export function currentUser(){initFirebase();return auth.currentUser;}
const makeCode=()=>Math.random().toString(36).slice(2,8).toUpperCase();
export async function createRoom(initialFen, minutes, increment){if(!auth?.currentUser)await connectFirebase();let code=makeCode();for(let i=0;i<5;i++){const snap=await get(ref(db,`rooms/${code}`));if(!snap.exists())break;code=makeCode();}await set(ref(db,`rooms/${code}`),{status:'waiting',host:auth.currentUser.uid,guest:null,fen:initialFen,pgn:'',turn:'w',whiteMs:minutes*60000,blackMs:minutes*60000,incrementMs:increment*1000,updatedAt:serverTimestamp()});return {code,color:'w'};}
export async function joinRoom(code){if(!auth?.currentUser)await connectFirebase();const roomRef=ref(db,`rooms/${code.toUpperCase()}`);const result=await runTransaction(roomRef,room=>{if(!room||room.status!=='waiting'||room.host===auth.currentUser.uid)return;room.guest=auth.currentUser.uid;room.status='active';return room;});if(!result.committed)throw new Error('Room unavailable, full, or you are already the host. Check the code.');return {code:code.toUpperCase(),color:'b'};}
export function listenRoom(code,callback){if(stopRoomListener)stopRoomListener();const unsub=onValue(ref(db,`rooms/${code}`),snap=>callback(snap.val()));stopRoomListener=unsub;return unsub;}
export async function publishPosition(code,payload){if(!auth?.currentUser)throw new Error('Not connected to Firebase.');const roomRef=ref(db,`rooms/${code}`);const snap=await get(roomRef);const room=snap.val();if(!room||!['host','guest'].some(k=>room[k]===auth.currentUser.uid))throw new Error('You are not a member of this room.');const color=room.host===auth.currentUser.uid?'w':'b';if(room.turn!==color)throw new Error('It is not your turn.');await update(roomRef,{...payload,turn:color==='w'?'b':'w',updatedAt:serverTimestamp()});}
export async function closeRoom(code){if(db)await update(ref(db,`rooms/${code}`),{status:'finished',updatedAt:serverTimestamp()});}
export function firebaseUser(){return auth?.currentUser||null;}
