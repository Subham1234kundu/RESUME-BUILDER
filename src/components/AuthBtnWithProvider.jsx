import React from 'react'
import { FaAngleRight } from "react-icons/fa";
import { GoogleAuthProvider,GithubAuthProvider } from 'firebase/auth';
import { signInWithRedirect } from 'firebase/auth';
import { auth } from '../config/firebase.config';


const AuthBtnWithProvider = ({Icon, label, provider}) => {

    const googleAuthProvider = new GoogleAuthProvider();
    const githubAuthProvider = new GithubAuthProvider();
    const handleClick = async() =>{
        switch(provider){
            case "GoogleAuthProvider" :
                await signInWithRedirect(auth, googleAuthProvider).then((result)=>{
                    console.log(result)
                }).catch((err)=> {
                    console.log(`Error: ${err.Message}`)
                })
                break;
            case "GithubAuthProvider" :
                await signInWithRedirect(auth, githubAuthProvider).then((result)=>{
                    console.log(result)
                }).catch((err)=> {
                    console.log(`Error: ${err.Message}`)
                })
                break;
            default:
                console.log("google");
                break;

        }
    };

  return (
    <div onClick={handleClick} className='w-full px-4 py-3 rounded-md bg-red-700 flex items-center justify-between cursor-pointer group hover:bg-red-800 active:scale-95 duration-150 hover:shadow-lg'>
      <Icon className="text-gray-400 text-xl group-hover:text-white"/>
      <p className="text-gray-400 text-lg group-hover:text-white">{label}</p>
      <FaAngleRight className="text-gray-400 text-lg group-hover:text-white"/>
    </div>

  )
}

export default AuthBtnWithProvider
