import { Preloader } from "./components/common";
import PropType from "prop-types";
import React, { StrictMode, useMemo } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "./routers/AppRouter";
import { Store } from "redux";
import { Persistor } from "redux-persist";
import { ContextProvider } from "./Context";

type Props = {
  store: Store;
  persistor: Persistor;
};

const App = ({ store, persistor }: Props) => {
  return (
    <StrictMode>
      <Provider store={store}>
        <ContextProvider>
          <PersistGate loading={<Preloader />} persistor={persistor}>
            <AppRouter />
          </PersistGate>
        </ContextProvider>
      </Provider>
    </StrictMode>
  );
};

App.propTypes = {
  store: PropType.any.isRequired,
  persistor: PropType.any.isRequired,
};

export default App;
