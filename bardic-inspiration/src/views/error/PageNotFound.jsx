import { useScrollTop } from "../../hooks";
import PropType from "prop-types";
import React from "react";

const PageNotFound = ({ navigate }) => {
  useScrollTop();

  return (
    <div className="page-not-found">
      <h1>:( Page you are looking for doesn&apos;t exists.</h1>
      <br />
      <button className="button" onClick={navigate.goBack} type="button">
        Go back
      </button>
    </div>
  );
};

PageNotFound.propTypes = {
  navigate: PropType.shape(() => {}).isRequired,
};
export default PageNotFound;
