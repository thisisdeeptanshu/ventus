import { signInWithPhoneNumber, RecaptchaVerifier } from '@firebase/auth';
import { useRef } from 'react';
import { auth, db } from "./firebase";
import { addDoc, collection, query, where, getDocs } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./css/style.css";

function SignIn() {
  let numberRef, codeRef, usernameRef, handleRef, userExists;
  const navigate = useNavigate();
  
  async function signInUser() {
    const handle = handleRef.current.value;
    const username = usernameRef.current.value;
    userExists = await getUserByNumber(numberRef.current.value);
    if (username == "" || handle == "") {
      if (!userExists) {
        alert("Username or handle cannot be empty!");
        return;
      }
    }
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        // reCAPTCHA has been verified, sign in with phone number
        sendSMS(numberRef.current.value);
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    }, auth);  window.recaptchaVerifier.render();
  }
  
  async function getUserByNumber(number) {
    const usersRef = collection(db, "users");
      
    // Create a query against the collection.
    const q = query(usersRef, where("number", "==", `+91${number}`));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }
  
  function sendSMS(number) {
    signInWithPhoneNumber(auth, "+91"+number, window.recaptchaVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          // ...
        }).catch((error) => {
          // Error; SMS not sent
          console.log(error);
        });
  }
  
  function verifyCode() {
    const code = codeRef.current.value;
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      // ...
      if (!userExists) addUserToDatabase()
      else {
        navigate("/lepersonne")
      }
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
      alert("Login Unsuccessful :(");
    });
  }
  
  function addUserToDatabase() {
    addDoc(collection(db, "users"), {
      username: usernameRef.current.value,
      handle: handleRef.current.value,
      number: "+91" + numberRef.current.value,
      bio: ""
    })
    .then(() => {
      navigate("/lepersonne")
    })
    .catch((error) => {
      console.log(":((((((((((((((((((");
      console.log(error);
    })
  }

  numberRef = useRef();
  codeRef = useRef();
  usernameRef = useRef();
  handleRef = useRef();
  return (
    <div className='center-div'>
      <h1 className='title'>LogIn</h1>
      <h2>*username and handle will be ignored if an account already exists with this phone number</h2><br />
      <input className='center' type="email" placeholder="Username" ref={usernameRef}></input><br />
      <input className='center' placeholder="Handle" ref={handleRef}></input><br />

      <input className='center' type="tel" placeholder="Phone Number" ref={numberRef}></input><br />
      <button className='center' onClick={signInUser}>Send SMS</button><br />

      <hr /><br />

      <input className='center' placeholder="Verification Code" ref={codeRef}></input><br />
      <button className='center' onClick={verifyCode}>Verify</button><br />
      
      <div id='recaptcha-container' />
    </div>
  );
}

export default SignIn;