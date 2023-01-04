import "./css/style.css"
import { onAuthStateChanged } from '@firebase/auth';
import { addDoc, getDocs, getDoc, collection, query, where, Timestamp, orderBy, updateDoc, doc } from "@firebase/firestore";
import { auth, db } from "./firebase";
import { useEffect, useRef, useState } from 'react';
import TitleBar from "./TitleBar";
import { useParams } from "react-router-dom";

function Replies() {
  const { id } = useParams();

  const postRef = useRef();

  const [retUser, setUser] = useState({});
  const [userId, setUserId] = useState(0);
  const [postData, setPostData] = useState({});
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserByNumber(user.phoneNumber);
      } else {
        console.log("user is signed out");
      }
    });
    getPost();
    getAllReplies();
  }, []);

  async function getUserByNumber(number) {
    const usersRef = collection(db, "users");
  
    // Create a query against the collection.
    const q = query(usersRef, where("number", "==", number));
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setUser(doc.data());
      setUserId(doc.id);
    });
  }

  function postMessage() {
    const text = postRef.current.value;
    const userRef = doc(db, `users/${userId}`);
    const firebasePostRef = doc(db, `posts/${id}`)
    addDoc(collection(db, "replies"), {
      user: userRef,
      post: firebasePostRef,
      handle: retUser.handle,
      text: text,
      date: Timestamp.now()
    })
    .catch((error) => {
      console.log(":((((((((((((((((((");
      console.log(error);
    })
  }

  function getPost() {
    const docRef = doc(db, "posts", id);
    getDoc(docRef)
    .then((d) => {
      setPostData(d.data());
    })
  }

  async function getAllReplies() {
    const repliesRef = collection(db, "replies");
    const postRef = doc(db, `posts/${id}`);
    const q = query(repliesRef, where("post", "==", postRef));
    let _replies = [];
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((d) => {
        let data = d.data()
        const uRef = doc(db, "users", data.user.id);
        getDoc(uRef)
        .then((dd) => {
          data.user = dd.data().username;
          _replies.push(data);
          setReplies(_replies.reverse());
        })
      })
    })
  }
  
  return (
    <div>
      <TitleBar /><br />
      <div className="flex-div">
        <textarea ref={postRef} placeholder="Got any opinions?" />
        <button onClick={postMessage}>Go!</button>
      </div><br />
      <div>
        <h1>{postData.text}</h1>
        <hr />
      </div>
      <div>
        {
          replies.map(reply => (
            <div>
              <h1 className="margin-bottom-zero" key={`${reply}-username`}>{reply.user}</h1>
              <h3 className="margin-top-zero" key={`${reply}-handle`}><a href={`/lespersonnes/${reply.handle}`} className="imnothere okikindaam">@{reply.handle}</a></h3>
              {console.log(reply.user)}
              <h1>{reply.text}</h1>
              <hr style={{width: "50%", borderTopColor: "#ccc"}} />
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Replies;