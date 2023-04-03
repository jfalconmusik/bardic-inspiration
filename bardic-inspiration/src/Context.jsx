import React, { useState, useEffect, ReactElement, ReactNode } from "react";
// import Images from "./images";
const Context = React.createContext({
  cost: 0,
});

function ContextProvider({ children }) {
  const [cost, setCost] = useState(0);
  ////
  return (
    <Context.Provider
      value={{
        cost,
        setCost,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
