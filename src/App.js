 import firebaseConfig from "./firebase.config.js"
 import * as firebase from 'firebase/app';
import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut ,createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile, FacebookAuthProvider  } from "firebase/auth";
import { useState } from 'react';
 

                                                      // Google Login Startup
 
firebase.initializeApp(firebaseConfig);
 
function App() {
  const googleProvider = new GoogleAuthProvider();
  const [user, setUser] = useState( { 
    isSignedIn: false,      
    name: "",
    email: "",
    password: "",
    photo: "",
  })


   const handleOnClick = () =>{
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log(result);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        
        const {displayName,email,photoURL} = result.user;
        const signInUser = {

                  isSignedIn: true, 
                  name: displayName,
                  email: email,
                  photo: photoURL,
        }
        setUser(signInUser);
      console.log(displayName,email,photoURL)
      })
      
      
      .catch((error) => {
        
        const errorCode = error.code;
        const errorMessage = error.message;        
        const email = error.email;        
        const credential = GoogleAuthProvider.credentialFromError(error);
         
      });
   }

                                                                  //THIS ONE ALSO USES
                                                                  //START :1

   const signOuts = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      
      const signOutUsers ={
        isSignedIn: false, 
        name: "",
        email: "",
        photo: "",
        error: "",
        success: false,
      }                                         
      setUser(signOutUsers); })
                                                                       //THE END :1

                                            
      .catch((error) => {
      
    });  
    
                              }                                      //Google login end
                                                                    // Facebook Login  Start 



               const fbprovider = new FacebookAuthProvider(); 
               
               const handleFbSignIn = () => {
                const auth = getAuth();
                signInWithPopup(auth, fbprovider)
                  .then((result) => {                    
                    const user = result.user;
                    console.log("Fb user after sign in",user);             
                    
                    const credential = FacebookAuthProvider.credentialFromResult(result);
                    const accessToken = credential.accessToken;              
                    
                  })
                  .catch((error) => {                   
                    const errorCode = error.code;
                    const errorMessage = error.message;                     
                    const email = error.email;                     
                    const credential = FacebookAuthProvider.credentialFromError(error);               
                     
                  });
               }
               
               
                                                             // Facebook Login  End 






                                                                //NEW password/email  // Main Start
                                                                //START :2




  

   
   const handleSubmit = (event) => {
      if (newUser && user.email && user.password) {

              const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)         
        .then(res=> {
          const newUserInfo = {...user};
          newUserInfo.error =  "";
          newUserInfo.success = true;
          setUser(newUserInfo);   
          updateUserName(user.name)
        })                
        .catch((error) => {
         const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);  
        });
      } 
        if (!newUser && user.email && user.password) {
          
        const auth = getAuth();
        signInWithEmailAndPassword(auth, user.email, user.password)
          .then((res) => {    
            const newUserInfo = {...user};
            newUserInfo.error =  "";
            newUserInfo.success = true;
            setUser(newUserInfo);      
            console.log("Sign in user info",res.user)
           })
          .catch((error) => {
            const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);   
          });
                }
        event.preventDefault();
   }



   const handleBlur = (event) => {  
      let isFieldValid =   true;
      if (event.target.name === "email") {
        isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);        
      }

      if (event.target.name === "password") {        
        const isPasswordValid = event.target.value.length >6;
        const passwordHasNumber =  /\d{1}/.test(event.target.value);
        isFieldValid = isPasswordValid && passwordHasNumber ;
      }
      if (isFieldValid) {

        const newUserInfo = {...user};
        newUserInfo[event.target.name] = event.target.value;
        setUser(newUserInfo);
      }
   }
   const [newUser, setNewUser] = useState(false);
   const updateUserName = name => {
                const auth = getAuth();
                updateProfile(auth.currentUser, {
                  displayName:  name, 
                  // photoURL: "https://example.com/jane-q-user/profile.jpg"
                }).then(() => {
                   
                }).catch((error) => {
                  
                });    

   }
                                                                    //THE END :2                                  




  return (

    <div className="App">
       
       { user.isSignedIn ? <button onClick={signOuts}  >Sign Out</button>:
         <button onClick={handleOnClick}  >Sign In</button>}<br />
         <button onClick={handleFbSignIn}>Sign in using Facebook</button>

       {user.isSignedIn && <div>
         <p>Name: {user.name}</p>
         <p>Email: {user.email}</p>
         <img src={user.photo} alt="" />     
         
                 </div>}
                           
                                                                {/* NEW password/email */}

                                                                {/* START :3 */}


              <h1>Our Own Authentication</h1>
              <input type="checkbox" name="newUser" onChange={()=>setNewUser(!newUser)} id="" />
              <label htmlFor="newUser">New User Sign up</label>
               
                    <form onSubmit={handleSubmit}>
          { newUser && <input name="name" type="text" onBlur={handleBlur}  placeholder="Your Name" />}<br />
      <input type="text" name="email"  id=""  placeholder="Your email address" onBlur={handleBlur}  required /><br />
      <input type="password" name="password" id="" placeholder="Your password" onBlur={handleBlur} required  /><br />
          <input type="submit" value={newUser ? "Sign Up" : "Sign In"} />
                 </form>

               {user.error &&  <p style={{color:"red"}}> The email address is already in use by another account</p>}
              {user.success && <p style={{color:"green"}}>User {newUser ?"Created" : "Logged In"}  Successfully </p>}

                                                              {/* THE END :3 */}

    </div>
  );
}

export default App;
