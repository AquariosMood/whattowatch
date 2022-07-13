import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
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
let currentUser;
let curPic = sessionStorage.getItem("uploadedImg");

const getCurrentUser = function () {
  if (!sessionStorage.getItem("user")) {
    currentUser = localStorage.getItem("user");
  }
  if (sessionStorage.getItem("user")) {
    currentUser = sessionStorage.getItem("user");
  }
};
getCurrentUser();

let header = document.getElementById("hh");

const initProfilePic = function () {
  if (!currentUser) {
    return;
  }
  get(ref(db, "UsersList/" + currentUser.username))
    .then(() => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `UsersList/${currentUser.username}/profilepic`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            header.insertAdjacentHTML(
              "beforeend",
              `<div class="profilepic">
                <img class="picturejpg" src="${curPic}">
                </div>`
            );
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      updateData();
      console.log("listLoaded");
    })
    .catch((error) => {
      console.log(error);
    });
};
initProfilePic();

function selectImage(afterSelection) {
  var inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = "image/*";
  inputFile.addEventListener("change", function () {
    if (afterSelection) {
      /**
       * What do after selecting image.
       * @callback selectImage~callback
       * @param {HTMLInputElement} inputFile - The `HTMLInputElement` used to select photo from library.
       */
      afterSelection(inputFile);
    }
  });
  return inputFile;
}
function readImage(inputFile, afterConvertion) {
  var reader = new FileReader();
  reader.addEventListener("load", function () {
    var image = document.createElement("img");
    image.addEventListener("load", function () {
      if (afterConvertion) {
        /**
         * What do after converting image.
         * @callback readImage~callback
         * @param {HTMLImageElement} image  - The `HTMLImageElement` that content the correct Data Url Base64 source.
         * @param {FileReader}       reader - The `FileReader` used to convert the original Image.
         */
        afterConvertion(image, reader);
      }
    });
    image.src = reader.result;
  });
  reader.readAsDataURL(inputFile.files[0]);
}
function reduceImage(imageSource, afterResizing) {
  var canvas = document.createElement("canvas"),
    imageResult = document.createElement("img"),
    context,
    maxWidth = 200,
    maxHeight = 200,
    width = imageSource.width,
    height = imageSource.height;
  if (width > height) {
    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }
  }
  canvas.width = width;
  canvas.height = height;
  context = canvas.getContext("2d");
  context.drawImage(imageSource, 0, 0, width, height);
  imageResult.addEventListener("load", function () {
    /**
     * What do after resizing image.
     * @callback reduceImage~callback
     * @param {HTMLImageElement} image  - The `HTMLImageElement` that content the correct Data Url Base64 source.
     * @param {FileReader}       reader - The `FileReader` used to convert the original Image.
     */
    afterResizing(imageResult, canvas);
  });
  imageResult.src = canvas.toDataURL("image/jpg", 0.8);
}

header.appendChild(
  selectImage(function (inputFile) {
    readImage(inputFile, function (image) {
      reduceImage(image, function (imageResult) {
        header.appendChild(imageResult);
        sessionStorage.setItem("uploadedImg", imageResult.src);
      });
    });
  })
);

function updateData() {
  if (!currentUser) {
    return;
  }
  let curPic = sessionStorage.getItem("uploadedImg");

  update(ref(db, "UsersList/" + currentUser.username), {
    profilepic: curPic,
  })
    .then(() => {
      console.log("stored");
    })
    .catch((error) => {
      console.log("error" + error);
    });
}
