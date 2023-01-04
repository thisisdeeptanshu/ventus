import "./css/style.css"
import { onAuthStateChanged } from '@firebase/auth';
import { addDoc, getDocs, getDoc, collection, query, where, Timestamp, orderBy, updateDoc, doc } from "@firebase/firestore";
import { auth, db } from "./firebase";
import { useEffect, useRef, useState } from 'react';
import TitleBar from "./TitleBar";

function LeursMots() {
  const [allPosts, setPosts] = useState([]);
  const [postIds, setIds] = useState([]);
  const [retUser, setUser] = useState({});
  const [userId, setUserId] = useState(0);
  const [handles, setHandles] = useState({});

  let itemsRef = useRef([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserByNumber(user.phoneNumber);
      } else {
        console.log("user is signed out");
      }
    });
    getAllPosts()
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
  
  async function getAllPosts() {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("date"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((d) => {
      let docId = d.data().user.id;
      
      const docRef = doc(db, "users", docId);
      getDoc(docRef)
      .then((e) => {
        setHandles({...handles, [e.data().handle]: e.data().username})
      })
      _allPosts.push(d.data());
      _ids.push(d.id);
    });
    setIds(_ids.reverse());
    setPosts(_allPosts.reverse());
    itemsRef.current = itemsRef.current.slice(0, _allPosts.length);
  }

  let postRef;
  let _allPosts = [];
  let _ids = [];
  
  function postMessage() {
    const text = postRef.current.value;
    const userRef = doc(db, `users/${userId}`);
    addDoc(collection(db, "posts"), {
      user: userRef,
      handle: retUser.handle,
      text: text,
      likes: 0,
      likedBy: [],
      date: Timestamp.now()
    })
    .catch((error) => {
      console.log(":((((((((((((((((((");
      console.log(error);
    })
  }

  function likePost(e, key, likedBy, i) {
    const docRef = doc(db, "posts", key);
    let _i, newValue;
    let likes = parseInt(itemsRef.current[i].innerHTML.split(";")[1]);
    if (e.target.innerHTML == "Like") {
      _i = 1;
      newValue = "Unlike";
    } else {
      _i = -1;
      newValue = "Like";
      removeItem(likedBy, retUser.handle);
    }
    let likesVal = likes + _i;
    updateDoc(docRef, {
        likes: likesVal,
        likedBy: _i == 1 ? [...likedBy, retUser.handle] : likedBy
      })
      .then(() => {
          itemsRef.current[i].innerHTML = "&nbsp;" + likesVal.toString()
          e.target.innerHTML = newValue;
    })
  }

  // https://stackoverflow.com/questions/48608119/javascript-remove-all-occurrences-of-a-value-from-an-array
  // Gracias Nina Scholz and caTS
  function removeItem(array, item) {
    var i = array.length;
  
    while (i--) {
      if (array[i] === item) {
        array.splice(i, 1);
      }
    }
  }

  postRef = useRef();
  return (
    <div>
      <TitleBar /><br />
      <div className="flex-div">
        <textarea ref={postRef} placeholder="What's on your mind?" />
        <button onClick={postMessage}>Go!</button>
      </div>
      <div>
        {
          allPosts.map((post, i) => (
            <div>
              <h1 className="margin-bottom-zero" key={`${postIds[i]}-username`}>{handles[post.handle]}</h1>
              <h3 className="margin-top-zero" key={`${postIds[i]}-handle`}><a href={`lespersonnes/${post.handle}`} className="imnothere okikindaam">@{post.handle}</a></h3>
              <h1 key={`${postIds[i]}-text`}>{post.text}</h1>
              {
                post.likedBy.includes(retUser.handle) ?
                <button onClick={(e) => likePost(e, postIds[i], post.likedBy, i)} style={{display: "inline"}}>Unlike</button>
                : <button onClick={(e) => likePost(e, postIds[i], post.likedBy, i)} style={{display: "inline"}}>Like</button>
              }
              <h1 ref={el => itemsRef.current[i] = el} key={`${postIds[i]}-likes`} style={{display: "inline"}}>&nbsp;{post.likes}</h1>
              <h3><a className="imnothere okikindaam" key={`${postIds[i]}-replies`} href={`replies/${postIds[i]}`}>Replies</a></h3>
              <h4 key={`${postIds[i]}-date`}>{post.date.toDate().toString()}</h4>
              <hr style={{width: "50%", borderTopColor: "#ccc"}} />
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default LeursMots;