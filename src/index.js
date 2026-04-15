import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";

function Test() {
  //in order to catch the rating selected at this level we need to pass our variable state
  //to take as a return value from the component starRating in that way we can use this info
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating
        color="blue"
        maxRating={10}
        onSetRating={setMovieRating}
      ></StarRating>
      <p>This movie was rated {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      messages={["terrible", "bad", "ok", "good", "Amazing"]}
    ></StarRating>
    <StarRating
      size={24}
      color="red"
      className="test"
      defaultRating={3}
    ></StarRating>
    <Test /> */}
  </React.StrictMode>,
);
