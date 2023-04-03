import { useScrollTop } from "../../hooks";
import PropType from "prop-types";
import React from "react";

const Error = ({ navigate }) => {
  useScrollTop();

  return (
    <div className="page-not-found">
      <h1>:( An error has occured. Please try again.</h1>
      <br />
      <button className="button" onClick={() => navigate("/")} type="button">
        Try Again
      </button>
    </div>
  );
};

Error.propTypes = {
  navigate: PropType.shape(() => {}).isRequired,
};

export default Error;
