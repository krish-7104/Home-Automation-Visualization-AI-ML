import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    databaseURL: import.meta.env.VITE_DATABASE,
    projectId: import.meta.env.VITE_PROJECTID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
