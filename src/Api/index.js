import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../Config/firebase.config";
import { toast } from "react-toastify";

export const GetUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred.providerData[0];

        const unsubscribe = onSnapshot(
          doc(db, "users", userData?.uid),
          (_doc) => {
            if (_doc.exists()) {
              resolve(_doc.data());
            } else {
              setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                resolve(userData);
              });
            }
          }
        );

        return unsubscribe;
      } else {
        reject(new Error("User is not authenticated"));
      }
      // Make sure to unsubscribe from the listener to prevent memory leaks
      unsubscribe();
    });
  });
};

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });
    return unsubscribe;
  });
};

export const saveTocollection = async (user, data) => {
  if (!user?.collections?.includes(data?._id)) {
    const docRef = doc(db, "users", user?.uid);

    await updateDoc(docRef, {
      collections: arrayUnion(data?._id),
    })
      .then(() => toast.success("Saved To Collections"))
      .catch((e) => toast.error(`Error:${e.message}`));
  } else {
    const docRef = doc(db, "users", user?.uid);

    await updateDoc(docRef, {
      collections: arrayRemove(data?._id),
    })
      .then(() => toast.success("Removed From Collections"))
      .catch((e) => toast.error(`Error:${e.message}`));
  }
};

export const saveToFavourites = async (user, data) => {
  console.log(data);
  if (!data?.favourites?.includes(user?.uid)) {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, {
      favourites: arrayUnion(user?.uid),
    })
      .then(() => toast.success("Saved To Favourites"))
      .catch((e) => toast.error(`Error:${e.message}`));
  } else {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, {
      favourites: arrayRemove(user?.uid),
    })
      .then(() => toast.success("Removed To Favourites"))
      .catch((e) => toast.error(`Error:${e.message}`));
  }
};

export const getTemplateDeatails = async (templateID) => {
  return new Promise((resolve,reject)=>{
    const unsubscribe=onSnapshot(doc(db,'templates',templateID),(doc)=>{
      resolve(doc.data());
      // console.log(doc.data());
    });
    return unsubscribe;
  })
};

export const getTemplateDetailEditByUser = (uid, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      doc(db, "users", uid, "resumes", id),
      (doc) => {
        resolve(doc.data());
      }
    );

    return unsubscribe;
  });
};

export const getSavedResumes=(uid)=>{
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "users",uid,'resumes'),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });
    return unsubscribe;
  });
}