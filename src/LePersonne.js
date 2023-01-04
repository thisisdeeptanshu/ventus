import "./css/style.css"
import { onAuthStateChanged } from '@firebase/auth';
import { getDocs, collection, query, where, orderBy, onSnapshot, updateDoc, doc } from "@firebase/firestore";
import { auth, db } from "./firebase";
import { useEffect, useState, useRef } from 'react';
import TitleBar from "./TitleBar";

function LePersonne() {
  const [retUser, setUser] = useState({});
  const [docId, setId] = useState();
  const [allPosts, setPosts] = useState([]);

  const bioRef = useRef();
  const nameRef = useRef();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserByNumber(user.phoneNumber)
        .then((handle) => {
          getAllPosts(handle);
        })
      } else {
        console.log("user is signed out");
      }
    });
  }, []);

  let _allPosts = [];
  async function getAllPosts(handle) {
    const postsRef = collection(db, "posts");

    const q = query(postsRef, where("handle", "==", handle), orderBy("date"));
    onSnapshot(q, querySnapshot => {
      querySnapshot.forEach((doc) => {
        _allPosts.push(doc);
      });
      setPosts(_allPosts.reverse());
    })
  }

  async function getUserByNumber(number) {
    const usersRef = collection(db, "users");
  
    // Create a query against the collection.
    const q = query(usersRef, where("number", "==", number));
    let handle;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setUser(doc.data());
      setId(doc.id);
      handle = doc.data().handle;
    });
    
    return handle;
  }

  function updateUser() {
    const username = nameRef.current.value;
    const bio = bioRef.current.value;
    const docRef = doc(db, "users", docId);
    updateDoc(docRef, {
      bio: bio,
      username: username
    })
    .then(() => {
      alert("Updated!")
    })
  }

  return (
    <div>
      <TitleBar /><br />
      <h1>Username: <input ref={nameRef} defaultValue={retUser.username} className="secret-input" /></h1>
      <h1>Handle: @{retUser.handle}</h1>
      <h1>Phone Number: {retUser.number}</h1>
      <h1>Bio:</h1><textarea ref={bioRef} defaultValue={retUser.bio} /><br /><br />
      <button onClick={updateUser}>Save</button>

      {
          allPosts.map((post) => (
            <div>
              <h1 className="margin-bottom-zero" key="username">{retUser.username}</h1>
              <h3 className="margin-top-zero" key="handle"><a href={`lespersonnes/${post.data().handle}`} className="imnothere okikindaam">@{post.data().handle}</a></h3>
              <h2 key="text">{post.data().text}</h2>
              <h2 key="likes" style={{display: "inline"}}>Likes: {post.data().likes}</h2>
              <h3><a className="imnothere okikindaam" key="replies" href={`/replies/${post.id}`}>Replies</a></h3>
              <h4 key="date">{post.data().date.toDate().toString()}</h4>
              <hr style={{width: "50%", borderTopColor: "#ccc"}} />
            </div>
          ))
        }
    </div>
  );
}

export default LePersonne;