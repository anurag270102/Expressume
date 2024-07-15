
import { auth } from "../Config/firebase.config"

export const GetUserDetail=async()=>{
    return new Promise((resolve, reject) => {
        const unsubscribe=auth.onAuthStateChanged((useCred)=>{
            if(useCred){
                const userData=useCred.providerData[0]
                console.log(userData);
               // const unsubscribe=onSnapshot();
            }else{
                reject( new Error('user Not Authenticated') );
            }
            //make unsubscribe from listner to prevent memoryleak

            unsubscribe();
        })
    })
}