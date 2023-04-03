import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const stripe = require("stripe")(
  "sk_test_51MsecRBYg3TEtrAxI6iaez0RSU23PlkmuQTg9j1stBHQzwSWs6eE1iVh1AQYZ8bg5h1vQWTEawg0HRm4uLbxoU1d007w7S9EsQ"
);

admin.initializeApp();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// When a user is created, register them with Stripe
export const createStripeCustomer = functions.auth
  .user()
  .onCreate(async (user) => {
    const customer = await stripe.customers.create({ email: user.email });
    return admin.firestore().collection("customers").doc(user.uid).set({
      customer_id: customer.id,
      customer_email: user.email,
      userID: user.uid,
      intent: null,
      paymentsComplete: [],
      cart: [],
      address_shipping: [],
      address_billing: [],
      wishlist: [],
      receipt_email: "",
      payMethod: [],
      firstName: "",
      lastName: "",
    });
  });

export const createPaymentIntent = functions.https.onCall(
  async (data, context) => {
    const cost = data.cost;
    const uid = context?.auth?.uid;
    if (uid) {
      const customerPromise = await admin
        .firestore()
        .collection(`customers`)
        .doc(uid)
        .get();
      const customerID = customerPromise?.data()?.customer_id;
      const intent = customerPromise?.data()?.paymentIntent;
      if (!intent || intent.amount !== cost) {
        return await stripe.paymentIntents
          .create({
            amount: cost,
            currency: "usd",
            payment_method_types: ["card"],
            customer: customerID,
            receipt_email: context?.auth?.token.email,
            metadata: { integration_check: "accept_a_payment" },
          })
          .then(async (response: any) => {
            await admin
              .firestore()
              .collection(`intents`)
              .doc(response.id)
              .set({ ...response });
            return await admin
              .firestore()
              .collection(`customers`)
              .doc(uid)
              .update({
                intent: `intents/${response.id}`,
              });
          })
          .catch((error: Error) => {
            console.log("error getting intent data: " + error);
          });
      } else {
        return new Promise((resolve, reject) => {
          resolve("intent already exists.");
          reject(Error);
        });
      }
    }
  }
);

export const getClientSecret = functions.https.onCall(async (data, context) => {
  const uid = context?.auth?.uid;
  if (data && uid) {
    if (data.payMethod && data.rememberCard) {
      const payMethod = data.payMethod;
      admin
        .firestore()
        .doc(`/customers/${uid}`)
        .update({
          payMethod: [
            payMethod.last4,
            payMethod.brand,
            payMethod.country,
            payMethod.id,
          ],
        });
    } else {
      console.log("no payment method");
    }
  }
  const doc = await admin.firestore().doc(`/customers/${uid}`).get();
  const intent = doc?.data()?.intent;
  const pendingIntent = await admin.firestore().doc(`${intent}`).get();
  const client_secret = pendingIntent?.data()?.client_secret.toString();

  return new Promise((resolve, reject) => {
    resolve(`${client_secret}`);
    reject(new Error("Error retrieving client secret."));
  });
});

export const payPal = functions.https.onCall((data, context) => {
  const uid = context?.auth?.uid;
  const details = data.details;

  return admin
    .firestore()
    .doc(`paypal/${uid}`)
    .set({
      [`${details.id}`]: details,
    });
});
