import {
  CHECKOUT_STEP_1,
  HOME,
  PAYMENT_COMPLETE,
} from "../../../constants/routes";
import { Form, Formik } from "formik";
import { displayActionMessage } from "../../../helpers/utils";
import { useDocumentTitle, useScrollTop } from "../../../hooks";
import PropType from "prop-types";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import CreditPayment from "./CreditPayment";
import PayPalPayment from "./PayPalPayment";
import Total from "./Total";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { httpsCallable, getFunctions } from "firebase/functions";
import { useSelector } from "react-redux";
import { Context } from "../../../Context";
import { CHECKOUT_STEP_2 } from "../../../constants/routes";
import { useDispatch } from "react-redux";
import { setPaymentDetails } from "../../../redux/actions/checkoutActions";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51MsecRBYg3TEtrAxYQA6k05IQTyGgwOgqf2e2vVOQHiEdWBRT6Z4HWJaRgmWtubNNhUCBhMvnFHAzQdFlYQFtZGa00DhIA7EaY"
);

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Name should be at least 4 characters.")
    .required("Name is required"),
  cardnumber: Yup.string()
    .min(13, "Card number should be 13-19 digits long")
    .max(19, "Card number should only be 13-19 digits long")
    .required("Card number is required."),
  expiry: Yup.date().required("Credit card expiry is required."),
  ccv: Yup.string()
    .min(3, "CCV length should be 3-4 digit")
    .max(4, "CCV length should only be 3-4 digit")
    .required("CCV is required."),
  type: Yup.string().required("Please select paymend mode"),
});

const PaymentForm = (shipping, subtotal) => {
  const stripe = useStripe();
  const elements = useElements();
  const store = useSelector((state) => ({
    basketLength: state.basket.length,
    basket: state.basket,
    user: state.auth,
    isAuthenticating: state.app.isAuthenticating,
    isLoading: state.app.loading,
    profile: state.profile,
  }));

  const initFormikValues = {
    name: store.profile.fullname,
    cardnumber: "",
    expiry: "",
    ccv: "",
    type: "credit",
  };

  const { setPaymentProcessing, paymentProcessing, cost } = useContext(Context);

  const [orderComplete, setOrderComplete] = useState(false);

  const functions = getFunctions();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stripePayment = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${process.env.REACT_APP_URL}${PAYMENT_COMPLETE}`,
      },
      redirect: "if_required",
    });

    console.log(result);

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      displayActionMessage(
        `Your payment could not be processed\n\n${result.error}`,
        "info"
      );
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.

      // if the result has a type, it was not confirmed:

      // rearrange database:
      const updateDatabase = httpsCallable(functions, "updateDatabase");
      const update = await updateDatabase({
        result,
        basket: store.basket,
        address: store.profile.address,
      });

      console.log(update);

      const details = {
        cost: (cost / 100).toFixed(2).toString(),
      };

      setOrderComplete(true);
      setPaymentProcessing(false);

      let order = {
        details,
        basket: store.basket,
        email: store.profile.email,
        address: store.profile.address,
      };
      const sendReceiptEmail = httpsCallable(functions, "sendReceiptEmail");
      await sendReceiptEmail({ order });

      displayActionMessage("Order placed, thanks!", "success");
      navigate(HOME);
    }
  };

  const onClickBack = () => {
    // destructure to only select left fields omitting cardnumber and ccv
    navigate(CHECKOUT_STEP_2);
  };

  const onConfirm = (e) => {
    // if (paymentProcessing) {
    //   return;
    // }
    console.log("onConfirm");
    setPaymentProcessing(true);

    displayActionMessage("Your payment is processing", "success");
    stripePayment();
  };

  return (
    <Formik
      initialValues={initFormikValues}
      validateOnChange
      validationSchema={FormSchema}
      validate={(form) => {
        if (form.type === "paypal") {
          displayActionMessage("Feature not ready yet :)", "info");
        }
      }}
      onSubmit={onConfirm}
    >
      {() => (
        <>
          <Form className="checkout-step-3">
            <>
              <lottie-player
                src="https://assets1.lottiefiles.com/private_files/lf30_ykdoon9j.json"
                background="transparent"
                speed="1"
                style={{
                  margin: "0 auto",
                  position: "relative",
                  bottom: "25%",
                  display: paymentProcessing ? "initial" : "none",
                }}
                loop
                autoplay
              ></lottie-player>
            </>
            <div
              style={{
                display:
                  paymentProcessing || orderComplete ? "none" : "initial",
              }}
            >
              <CreditPayment />
              {/* <PayPalPayment /> */}
              <Total
                onConfirm={onConfirm}
                isInternational={shipping.isInternational}
                subtotal={(cost / 100).toFixed(2)}
              />
              <div className="checkout-shipping-action">
                <button
                  className="button button-muted"
                  onClick={() => onClickBack()}
                  type="button"
                >
                  <ArrowLeftOutlined />
                  &nbsp; Go Back
                </button>
                <button className="button" onClick={onConfirm} type="button">
                  <CheckOutlined />
                  &nbsp; Confirm
                </button>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

const Payment = ({ shipping, payment, subtotal }) => {
  useDocumentTitle("Check Out Final Step | Salinaka");
  useScrollTop();

  const functions = getFunctions();
  const [clientSecret, setClientSecret] = useState(null);
  const { cost } = useContext(Context);

  const options = {
    clientSecret: clientSecret,
  };

  useEffect(() => {
    (async () => {
      const createPaymentIntent = httpsCallable(
        functions,
        "createPaymentIntent"
      );
      const intent = await createPaymentIntent({ cost });
      setClientSecret(intent.data.clientSecret);
      console.log(intent);
    })();
  }, [cost, functions]);

  if (!shipping || !shipping.isDone) {
    return <Navigate to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />

      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm shipping={shipping} subtotal={subtotal} />
        </Elements>
      ) : (
        <></>
      )}
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool,
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string,
  }).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckout(Payment);
