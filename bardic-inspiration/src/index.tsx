// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import reportWebVitals from "./reportWebVitals";

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA4ps7jnUzmkeWim_7qZCCSC59beVFjQck",
//   authDomain: "bardic-inspiration-tal.firebaseapp.com",
//   databaseURL: "https://bardic-inspiration-tal-default-rtdb.firebaseio.com",
//   projectId: "bardic-inspiration-tal",
//   storageBucket: "bardic-inspiration-tal.appspot.com",
//   messagingSenderId: "556723700527",
//   appId: "1:556723700527:web:5ba7ad488d904c75b3d7da",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import { Preloader } from "./components/common";
import "normalize.css/normalize.css";
import React from "react";
import { render } from "react-dom";
import "react-phone-input-2/lib/style.css";
import {
  onAuthStateFail,
  onAuthStateSuccess,
} from "./redux/actions/authActions";
import configureStore from "./redux/store/store";
import "./styles/style.scss";
// import WebFont from "webfontloader";
import App from "./App";
import firebase from "./services/firebase";
import { createRoot } from "react-dom/client";

// WebFont.load({
//   google: {
//     families: ["Tajawal"],
//   },
// });

const { store, persistor } = configureStore();
const domNode = document.getElementById("root") as HTMLElement;
const root = createRoot(domNode);
// Render the preloader on initial load
root.render(<Preloader />);

firebase.auth.onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(onAuthStateSuccess(user));
  } else {
    store.dispatch(onAuthStateFail("Failed to authenticate"));
  }
  // then render the app after checking the auth state
  root.render(<App store={store} persistor={persistor} />);
});

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
