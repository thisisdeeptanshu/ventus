import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { onAuthStateChanged } from '@firebase/auth';
// import { auth } from "./firebase";

import SignIn from "./SignIn";
import LeursMots from "./LeursMots";
import LePersonne from "./LePersonne"
import LesPersonnes from "./LesPersonnes";
import Default from "./Default";
import Replies from "./Replies";

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     // ...
//     console.log("user is signed in");
//   } else {
//     // User is signed out
//     // ...
//     console.log("user is signed out");
//   }
// });

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/leursmots" element={<LeursMots />} />
        <Route path="/lepersonne" element={<LePersonne />} />
        <Route path="/lespersonnes" element={<LesPersonnes />} />
        <Route path="/lespersonnes/:handle" element={<LesPersonnes />} />
        <Route path="/" element={<Default />} />
        <Route path="/replies/:id" element={<Replies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
