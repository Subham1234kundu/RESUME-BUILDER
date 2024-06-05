import { arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import {auth, db} from "../config/firebase.config";
import { toast } from "react-toastify";

export const getUserDetail = ()=>{
    return new Promise((res,rej)=>{
        const unSubscribe =  auth.onAuthStateChanged((userCard)=>{
            if(userCard){
                const userData = userCard.providerData[0];
                // console.log(userData)
                
                const unSubscribe = onSnapshot(doc(db,"user", userData?.uid),(_doc)=>{
                    if(_doc.exists()){
                        res(_doc.data());
                    }else{
                        setDoc(doc(db,"user", userData?.uid),userData).then(()=>{
                            res(userData);
                        })
                    }
                });

                return unSubscribe; 
            }else{
                rej(new Error("user is nor authenticated"));
            }

            unSubscribe();
        });
    });
};



export const getTemplates = ()=>{
    return new Promise((res , rej)=>{
        const templeteQuery = query(
            collection(db , "templates"),
            orderBy("timeStamp" , "asc")
        );
        
        const unSubscribe = onSnapshot(templeteQuery , (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data());
            res(templates);
        });
        
        return unSubscribe;
    });
};

export const saveToCollections = async(user,data)=>{
    if(!user?.collections?.includes(data?.id)){
        const docRef = doc(db,"user", user?.uid);
        await updateDoc(docRef,{
            collections : arrayUnion(data?.id)
        }).then(()=> toast.success("saved to collection")).catch((err) => `Error:${err.message}`)
    }else{
        const docRef = doc(db,"user", user?.uid);
        await updateDoc(docRef,{
            collections : arrayRemove(data?.id)
        }).then(()=> toast.success("Remove from collection")).catch((err) => `Error:${err.message}`)        
    }
}

export const saveTofavrourits = async(user,data)=>{
    if(!data?.favrourits?.includes(user?.uid)){
        const docRef = doc(db,"templates", data?.id);
        await updateDoc(docRef,{
            favrourits : arrayUnion(user?.uid)
        }).then(()=> toast.success("saved to favrourits")).catch((err) => `Error:${err.message}`)
    }else{
        const docRef = doc(db,"templates", data?.id);
        await updateDoc(docRef,{
            favrourits : arrayRemove(user?.uid)
        }).then(()=> toast.success("Remove from favrourits")).catch((err) => `Error:${err.message}`)        
    }
}

export const getTemplateDetails= async(templateID)=>{
    return new Promise((res,rej)=>{
        const unSubscribe = onSnapshot(doc(db,"templates",templateID),(doc)=>{
            res(doc.data());
        });

        return unSubscribe;
    });
};

export const getTemplateDetailEditByUser = (uid, id) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        doc(db, "user", uid, "resumes", id),
        (doc) => {
          resolve(doc.data());
        }
      );
  
      return unsubscribe;
    });
  };

  export const getSavedResumes = (uid)=>{
    return new Promise((res,rej)=>{
        const templeteQuery = query(
            collection(db,"user" ,uid,"resumes"),
            orderBy("timeStamp" ,"asc")
        );

        const unSubscribe = onSnapshot(templeteQuery,(querySnap)=>{
            const templates = querySnap.docs.map((doc)=>doc.data());
            res(templates);
        });
        return unSubscribe;
    })
  }

