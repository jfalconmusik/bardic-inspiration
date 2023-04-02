import { Basket } from "../components/basket";
import { Footer, Navigation } from "../components/common";
import * as ROUTES from "../constants/routes";
import { createBrowserHistory } from "history";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import * as view from "../views";
import AdminRoute from "./AdminRoute";
import ClientRoute from "./ClientRoute";
import PublicRoute from "./PublicRoute";

// Revert back to history v4.10.0 because
// v5.0 breaks navigation
export const history = createBrowserHistory();

const AppRouter = () => (
  <Router>
    <>
      <Navigation />
      <Basket />
      <Routes>
        <Route element={<view.Home />} path={ROUTES.HOME} />
        <Route element={<view.Search />} path={ROUTES.SEARCH} />
        <Route element={<view.Shop />} path={ROUTES.SHOP} />
        <Route
          element={<view.FeaturedProducts />}
          path={ROUTES.FEATURED_PRODUCTS}
        />
        <Route
          element={<view.RecommendedProducts />}
          path={ROUTES.RECOMMENDED_PRODUCTS}
        />
        <Route
          element={<PublicRoute component={view.SignUp} path={ROUTES.SIGNUP} />}
          path={ROUTES.SIGNUP}
        />
        <Route
          element={<PublicRoute component={view.SignIn} path={ROUTES.SIGNIN} />}
          path={ROUTES.SIGNIN}
        />
        <Route
          element={
            <PublicRoute
              component={view.ForgotPassword}
              path={ROUTES.FORGOT_PASSWORD}
            />
          }
          path={ROUTES.FORGOT_PASSWORD}
        />
        <Route element={<view.ViewProduct />} path={ROUTES.VIEW_PRODUCT} />
        <Route
          element={
            <ClientRoute component={view.UserAccount} path={ROUTES.ACCOUNT} />
          }
          path={ROUTES.ACCOUNT}
        />

        <Route
          element={
            <ClientRoute
              component={view.EditAccount}
              path={ROUTES.ACCOUNT_EDIT}
            />
          }
          path={ROUTES.ACCOUNT_EDIT}
        />

        <Route
          element={
            <ClientRoute
              component={view.CheckOutStep1}
              path={ROUTES.CHECKOUT_STEP_1}
            />
          }
          path={ROUTES.CHECKOUT_STEP_1}
        />

        <Route
          element={
            <ClientRoute
              component={view.CheckOutStep2}
              path={ROUTES.CHECKOUT_STEP_2}
            />
          }
          path={ROUTES.CHECKOUT_STEP_2}
        />

        <Route
          element={
            <ClientRoute
              component={view.CheckOutStep3}
              path={ROUTES.CHECKOUT_STEP_3}
            />
          }
          path={ROUTES.CHECKOUT_STEP_3}
        />

        <Route
          element={
            <AdminRoute
              component={view.Dashboard}
              path={ROUTES.ADMIN_DASHBOARD}
            />
          }
          path={ROUTES.ADMIN_DASHBOARD}
        />
        <Route
          element={
            <AdminRoute
              component={view.Products}
              path={ROUTES.ADMIN_PRODUCTS}
            />
          }
          path={ROUTES.ADMIN_PRODUCTS}
        />
        <Route
          element={
            <AdminRoute component={view.AddProduct} path={ROUTES.ADD_PRODUCT} />
          }
          path={ROUTES.ADD_PRODUCT}
        />

        <Route
          element={
            <AdminRoute
              component={view.EditProduct}
              path={`${ROUTES.EDIT_PRODUCT}/:id`}
            />
          }
          path={`${ROUTES.EDIT_PRODUCT}/:id`}
        />
        <Route element={<view.PrivacyPolicy />} path={ROUTES.PRIVACY_POLICY} />
        <Route
          element={<view.TermsOfService />}
          path={ROUTES.TERMS_OF_SERVICE}
        />
        <Route
          element={<view.DataDeletion />}
          path={ROUTES.DATA_DELETION_POLICY}
        />
        <Route element={<view.PageNotFound />} />
      </Routes>
      <Footer />
    </>
  </Router>
);

export default AppRouter;
