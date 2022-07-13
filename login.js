import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// import getAnalytics from "./node_modules/@firebase/analytics";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAENBZcCtxGt2-83me8tyP4qvREa__bwag",
  authDomain: "what-to-watch-f941b.firebaseapp.com",
  databaseURL:
    "https://what-to-watch-f941b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "what-to-watch-f941b",
  storageBucket: "what-to-watch-f941b.appspot.com",
  messagingSenderId: "270504987835",
  appId: "1:270504987835:web:73329de6210609ea322d9e",
  measurementId: "G-3BSKFCE4VJ",
};
const username = document.getElementById("userInp");
const pass = document.getElementById("passInp");
const submit = document.getElementById("sub_btn");
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// DECRIPT PROCESS //
function decPass(dbpass) {
  var pass12 = CryptoJS.AES.decrypt(dbpass, pass.value);
  return pass12.toString(CryptoJS.enc.Utf8);
}
// AUTHENTIFICATION PROCESS //
export function AuthenticateUser() {
  const dbref = ref(db);

  get(child(dbref, "UsersList/" + username.value)).then((snapshot) => {
    if (snapshot.exists()) {
      let dbpass = decPass(snapshot.val().password);
      if (dbpass == pass.value) {
        login(snapshot.val());
      } else {
        document.body.insertAdjacentHTML(
          "afterbegin",
          `<div class="alert-usernotexisting">
        <span class="closebtn" onclick="this.parentElement.style.display='none';"
          >&times;</span
        >
        This user does not exist
      </div>`
        );
      }
    } else {
      document.body.insertAdjacentHTML(
        "afterbegin",
        `<div class="alert-wrongpassoruser">
        <span class="closebtn" onclick="this.parentElement.style.display='none';"
          >&times;</span
        >
        Username or password invalid
      </div>`
      );
    }
  });
}
// LOGIN //

// VALIDATION //

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

function Validation() {
  if (isEmptyOrSpaces(username.value) || isEmptyOrSpaces(pass.value)) {
    alert("you cannot left any field empty");
    return false;
  }
  return true;
}

function login(user) {
  if (!Validation()) {
    return;
  }
  let keepLoggedIn = document.getElementById("customSwitch1").checked;

  if (!keepLoggedIn) {
    sessionStorage.setItem("user", JSON.stringify(user));
    window.location = "index.html";
  } else {
    localStorage.setItem("keepLoggedIn", "yes");
    localStorage.setItem("user", JSON.stringify(user));
    window.location = "index.html";
  }
}

// ASSIGN THE EVENTS //
submit.addEventListener("click", AuthenticateUser);
