import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// import {
//   getAuth,
//   sendSignInLinkToEmail,
// } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
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
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// REFERENCES //
const name = document.getElementById("nameInp");
const email = document.getElementById("emailInp");
const username = document.getElementById("userInp");
const pass = document.getElementById("passInp");
const submit = document.getElementById("sub_btn");

// VALIDATION //

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

function Validation() {
  let nameregex = /^[a-zA-Z\s]+$/;
  let emailregex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let userregex = /^[a-zA-Z0-9]{5,}$/;

  if (
    isEmptyOrSpaces(name.value) ||
    isEmptyOrSpaces(email.value) ||
    isEmptyOrSpaces(username.value) ||
    isEmptyOrSpaces(pass.value)
  ) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert-emptyfields">
        <span class="closebtn" onclick="this.parentElement.style.display='none';"
          >&times;</span
        >
        You cannot left any field empty
      </div>`
    );
    return false;
  }
  if (!nameregex.test(name.value)) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert-alphabets">
      <span class="closebtn" onclick="this.parentElement.style.display='none';"
        >&times;</span
      >
      The name should only contain alphabets!
    </div>`
    );
    return false;
  }

  if (!emailregex.test(email.value)) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert-validemail">
      <span class="closebtn" onclick="this.parentElement.style.display='none';"
        >&times;</span
      >
      Enter a valid email
    </div>`
    );
    return false;
  }

  if (!userregex.test(username.value)) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `    <div class="alert-validuser">
      <span class="closebtn" onclick="this.parentElement.style.display='none';"
        >&times;</span
      >
      - Username can only be alphanumeric
      - Username must be aleast 5 characters
      - Username cannot contain spaces
    </div>`
    );
    return false;
  }

  return true;
}

// REGISTER USER TO FIREBASE //
export function RegisterUser() {
  if (!Validation()) {
    return;
  }
  const dbref = ref(db);

  get(child(dbref, "UsersList/" + username.value)).then((snapshot) => {
    if (snapshot.exists()) {
      document.body.insertAdjacentHTML(
        "afterbegin",
        `<div class="alert-alreadyexists">
        <span class="closebtn" onclick="this.parentElement.style.display='none';"
          >&times;</span
        >
        This account already exists !
      </div>`
      );
    } else {
      set(ref(db, "UsersList/" + username.value), {
        fullname: name.value,
        email: email.value,
        username: username.value,
        password: encPass(),
        profilepic: "/img/defaultpp.jpg",
        myList: "",
      })
        .then(() => {
          document.body.insertAdjacentHTML(
            "afterbegin",
            `<div class="alert-useradded">
          <span class="closebtn" onclick="this.parentElement.style.display='none';"
            >&times;</span
          >
          User added successfully
        </div>`
          );
        })
        .catch((error) => {
          document.body.insertAdjacentHTML(
            "afterbegin",
            `    <div class="alert-error">
            <span class="closebtn" onclick="this.parentElement.style.display='none';"
              >&times;</span
            >
            Error: ${error}
          </div>`
          );
        });
    }
  });
}
// ENCRIPTION //
function encPass() {
  var pass12 = CryptoJS.AES.encrypt(pass.value, pass.value);
  return pass12.toString();
}

// ASSIGN THE EVENTS //
submit.addEventListener("click", RegisterUser);
