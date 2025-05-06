import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8P89iDnobzCrJw3U8dwByKsQNemJ1_vg",
  authDomain: "jerseymakerpro.firebaseapp.com",
  projectId: "jerseymakerpro",
  storageBucket: "jerseymakerpro.firebasestorage.app",
  messagingSenderId: "250566518773",
  appId: "1:250566518773:web:378850babcddd9f9d0e2bc",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
