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

export const { store, persistor } = configureStore();
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
