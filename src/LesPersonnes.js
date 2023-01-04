import TitleBar from "./TitleBar";
import { onAuthStateChanged } from '@firebase/auth';
import { getDocs, collection, query, where, orderBy, onSnapshot, updateDoc, doc } from "@firebase/firestore";
import { db, auth } from "./firebase";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

function LesPersonnes() {
  const { handle } = useParams();

  const [allUsers, setUsers] = useState([]);
  const [_retUser, _setUser] = useState();
  const [retUser, setUser] = useState({});
  const [allPosts, setPosts] = useState([]);
  const [postIds, setIds] = useState([]);
  
  let itemsRef = useRef([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserByNumber(user.phoneNumber);
      } else {
        console.log("user is signed out");
      }
    });
    if (handle == undefined)
      getAllUsers();
    else
      getUser(handle);
      getAllPosts(handle);
  }, []);
  async function getUserByNumber(number) {
    const usersRef = collection(db, "users");
  
    // Create a query against the collection.
    const q = query(usersRef, where("number", "==", number));
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setUser(doc.data());
    });
  }
  async function getAllUsers() {
    let l = [];
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      l.push(doc.data());
    });
    setUsers(l);
  }
  async function getUser(handle) {
    const usersRef = collection(db, "users");
  
    // Create a query against the collection.
    const q = query(usersRef, where("handle", "==", handle));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      _setUser(doc.data());
    });
  }
  let _allPosts = [];
  let _ids = [];
  async function getAllPosts() {
    const postsRef = collection(db, "posts");

    const q = query(postsRef, where("handle", "==", handle), orderBy("date"));
    onSnapshot(q, querySnapshot => {
      querySnapshot.forEach((doc) => {
        _allPosts.push(doc.data());
        _ids.push(doc.id);
      });
      setIds(_ids.reverse());
      setPosts(_allPosts.reverse());
      itemsRef.current = itemsRef.current.slice(0, _allPosts.length);
    })
  }
  function likePost(e, key, likedBy, i) {
    if (retUser && Object.keys(retUser).length === 0 && Object.getPrototypeOf(retUser) === Object.prototype) {
      console.log("mama mia!");
      return;
    }
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
  return (
    <div>
      <TitleBar /><br />
      {
        _retUser ?
        <div>
          <h1 className="margin-bottom-zero">{_retUser.username}</h1>
          <h3 className="margin-top-zero">@{_retUser.handle}</h3>
          <h2 style={{border: "1px solid #ccc", padding: "10px"}}>{_retUser.bio}</h2>
          <div>
            {
              allPosts.map((post, i) => (
                <div>
                  <h1 className="margin-bottom-zero" key={`${postIds[i]}-username`}>{_retUser.username}</h1>
                  <h3 className="margin-top-zero" key={`${postIds[i]}-handle`}>@{post.handle}</h3>
                  <h1 key={`${postIds[i]}-text`}>{post.text}</h1>
                  {
                    post.likedBy.includes(_retUser.handle) ?
                    <button onClick={(e) => likePost(e, postIds[i], post.likedBy, i)} style={{display: "inline"}}>Unlike</button>
                    : <button onClick={(e) => likePost(e, postIds[i], post.likedBy, i)} style={{display: "inline"}}>Like</button>
                  }
                  <h1 ref={el => itemsRef.current[i] = el} key={`${postIds[i]}-likes`} style={{display: "inline"}}>&nbsp;{post.likes}</h1>
                  <h3><a className="imnothere okikindaam" key={`${postIds[i]}-replies`} href={`/replies/${postIds[i]}`}>Replies</a></h3>
                  <h4 key={`${postIds[i]}-date`}>{post.date.toDate().toString()}</h4>
                  <hr style={{width: "50%", borderTopColor: "#ccc"}} />
                </div>
              ))
            }
          </div>
        </div>
        :
        <div>
          {
            allUsers.map((u) => (
              <h1 key={`lespersonnes/${u.handle}`}><a href={`lespersonnes/${u.handle}`} className="imnothere okikindaam">@{u.handle} - {u.username}</a></h1>
            ))
          }
        </div>
      }
    </div>
  );
}

export default LesPersonnes;