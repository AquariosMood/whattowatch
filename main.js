import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

// import getAnalytics from "./node_modules/@firebase/analytics";
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  update,
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
const search = document.querySelector(".search");
const icon = document.querySelector(".icon");
const apikey = "ad8af5d89a16699bae2e2bc4c74c8c5f";
const myList = document.querySelector(".mylist");
const movies = document.querySelector(".movies");
const mymovie = document.querySelector(".mymovie");
const save = document.querySelector(".savelist");
// Get a reference to the root of the Database

// Storage Local //
// const storage = localStorage.getItem("myMovieList");
// const initStorage = function () {
//   if (storage) myList.insertAdjacentHTML("beforeend", storage);
// };
// const persistList = function () {
//   localStorage.setItem("myMovieList", myList.innerHTML);
// };

// Main //

const getTMDBAPI = async function () {
  if (!icon) {
    return;
  }
  icon.addEventListener("click", function () {
    search.classList.toggle("active");
  });

  search.addEventListener("keyup", (e, i) => {
    let query = e.target.value.toLowerCase();

    document.querySelector(".clear").addEventListener("click", function () {
      document.querySelector(".movies").innerHTML = "";
    });
    const getResults = async function () {
      let searchResults = await fetch(
        `https://api.themoviedb.org/3/search/movie?sort_by=vote_average.desc&api_key=${apikey}&language=en-US&page=1&include_adult=false&query=${query}`
      );
      let resultmovies = await searchResults.json();
      let results = resultmovies.results;
      console.log(results);

      const insertresults = function () {
        results.map(function (_, i) {
          movies.insertAdjacentHTML(
            "beforeend",
            `<div class="movieid">
            
            <div class="lds-ripple --hidden"><div></div><div></div></div>
            <img class="img img-${i}" src="https://image.tmdb.org/t/p/original/${results[i].poster_path}"/>
            <div class="title">${results[i].title}</div>
            <div class="date">${results[i].release_date}</div>
            <div class="notation">
            <div class="popularity">${results[i].vote_average}</div>
            <i class="fa fa-solid fa-heart"></i></div>
            </div></div></div>
            `
          );

          const img = movies.querySelectorAll(".img");
          const spinner = movies.querySelectorAll(".lds-ripple");
          // const spinner = document.querySelector(".lds-ripple");

          movies.onclick = function (e, i) {
            const clicked = e.target;
            const thisMovie = clicked.closest(".movieid");
            let thisMoviePoster = thisMovie.children[1].src;
            let thisMovieTitle = thisMovie.children[2].textContent;
            let thisMovieDate = thisMovie.children[3].textContent;
            let thisMovieNotation = thisMovie.children[4].textContent;

            myList.insertAdjacentHTML(
              "beforeend",
              `<div class="mymovie">
              <img class ="mymovieposter" src =${thisMoviePoster}>
              <div class ="mymovieinfos">
              <div class ="mymovietitle">Titre : ${thisMovieTitle}</div>
              <div class ="mymoviedate">Date : ${thisMovieDate}</div>
              <div class ="mymovienotation">Note spectateurs : ${thisMovieNotation}/10</div>
              <div class="clearmovie">
              <div class="clearthismovie"></div>
              <div class="cleartext" >Retirer le film</div>
              </div>
              </div>`
            );
            // <div class="intheathers">
            // <label class="switchmylist">
            // <input type="checkbox" id="customSwitch1" />
            // <span class="sliderlist roundlist"></span>
            // </label>
            // <div class="cinematext">
            // Cinema</div>
            // </div>
            // <div class="seenordelete">
            // <div class="vu">
            // <input type="checkbox" id="accept">
            // Vu</div>
            // </div>
            // </div>
            const mymovie = document.querySelector(".mymovie");

            // console.log(thismovie);

            deleteThisMovie();

            shadow();

            saveButton();
          };
        });
      };

      if (!document.querySelector(".movieid")) {
        insertresults();
      } else {
        movies.innerHTML = "";
        insertresults();
      }
    };
    getResults();
  });
};
getTMDBAPI();

// initStorage();
// var ref = firebase.database().ref("users");

// Store to account //
const insertList = function () {
  if (!currentUser) {
    return;
  }
  sessionStorage.setItem("currentList", myList.innerHTML);
  let curList = sessionStorage.getItem("currentList");
  set(ref(db, "UsersList/" + currentUser.username), {
    fullname: currentUser.fullname,
    email: currentUser.email,
    username: currentUser.username,
    password: currentUser.password,
    profilepic: currentUser.profilepic,
    myList: curList,
  })
    .then(() => {
      console.log("done");
      updateData();
    })
    .catch((error) => {
      console.log(error);
    });
};
const deleteThisMovie = function () {
  const deleteit = document.querySelectorAll(".clearmovie");
  deleteit.forEach(function (deleteit) {
    deleteit.addEventListener("click", function () {
      console.log("salut");
      deleteit.parentElement.parentElement.remove();
      shadow();
    });
  });
};
function updateData() {
  if (!currentUser) {
    return;
  }
  let curList = sessionStorage.getItem("currentList");

  update(ref(db, "UsersList/" + currentUser.username), {
    myList: curList,
  })
    .then(() => {
      console.log("stored");
    })
    .catch((error) => {
      console.log("error" + error);
    });
}
const saveButton = function () {
  if (
    document.querySelector(".mymovie") &&
    !document.querySelector(".savelist")
  ) {
    myList.insertAdjacentHTML(
      "afterend",
      `<button class="savelist">SAVE</button>`
    );
    const save = document.querySelector(".savelist");
    save.addEventListener("click", function () {
      if (!currentUser) {
        document.body.insertAdjacentHTML(
          "afterbegin",
          `<div class="alert-logorsign">
        <span class="closebtn" onclick="this.parentElement.style.display='none';"
          >&times;</span
        >
        Login or create an account to save your list
        
        <div class="btninpopup">
        <a class="btn" href="login.html">Login</a>
        <a class="btn" href="register.html">Sign Up</a>
        </div>
      </div>`
        );
      }
      if (currentUser) {
        document.body.insertAdjacentHTML(
          "afterbegin",
          `<div class="alert-saved">
          <span class="closebtn" onclick="this.parentElement.style.display='none';"
          >&times;</span
          >
          List saved successfully !
          </div>`
        );
      }
      insertList();
    });
  }
};
const shadow = function () {
  if (myList.children[0] == undefined) {
    myList.style.cssText = "box-shadow: 0px 0px 0px 0px var(--dark)";
  } else {
    myList.style.cssText = "box-shadow: 1px 10px 20px 10px var(--dark)";
  }
};

// Init account list //

const initRegisteredList = function () {
  if (!currentUser) {
    return;
  }

  get(ref(db, "UsersList/" + currentUser.username))
    .then(() => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `UsersList/${currentUser.username}/myList`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            myList.insertAdjacentHTML("beforeend", snapshot.val());
            myList.style.cssText = "box-shadow: 1px 10px 20px 10px var(--dark)";
            saveButton();
            deleteThisMovie();
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      console.log("listLoaded");
    })
    .catch((error) => {
      console.log(error);
    });
};
initRegisteredList();
