import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {auth, db} from "../config/firebase.config";

export const getUserDetail = ()=>{
    return new Promise((res,rej)=>{
        const unSubscribe =  auth.onAuthStateChanged((userCard)=>{
            if(userCard){
                const userData = userCard.providerData[0];
                console.log(userData)
                
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
}