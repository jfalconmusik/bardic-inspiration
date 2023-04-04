import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
const stripe = require("stripe")(
  "sk_test_51MsecRBYg3TEtrAxI6iaez0RSU23PlkmuQTg9j1stBHQzwSWs6eE1iVh1AQYZ8bg5h1vQWTEawg0HRm4uLbxoU1d007w7S9EsQ"
);

admin.initializeApp();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//

type Product = {
  name: string;
  selectedColor: string;
  selectedSize: string;
};

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
            await admin
              .firestore()
              .collection(`customers`)
              .doc(uid)
              .update({
                intent: `intents/${response.id}`,
              });
            return { clientSecret: response.client_secret };
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
    if (data.payMethod) {
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

// updates customer, adds order
export const updateDatabase = functions.https.onCall(async (data, context) => {
  console.log(data);
  if (data?.result?.paymentIntent?.status === "succeeded") {
    const uid = context?.auth?.uid;
    const address = data.address;

    const doc = await admin.firestore().doc(`customers/${uid}`).get();
    const intent = doc?.data()?.paymentIntent;

    const pendingIntent = admin.firestore().doc(`${intent}`);

    await admin
      .firestore()
      .doc(`payments/${data.result.id}`)
      .set({
        ...data.result,
      });
    await pendingIntent.delete();
    await admin
      .firestore()
      .doc(`customers/${uid}`)
      .update({
        intent: null,
        paymentsComplete: [
          ...doc?.data()?.paymentsComplete,
          `${data.result.id}`,
        ],
      });

    let basket = data.basket.map((product: Product) => {
      return {
        name: product.name,
        size: product.selectedSize,
        color: product.selectedColor,
      };
    });

    let uidAndTime = `${uid}_${data.result.created}`;

    let order = {
      basket,
      address,
      uid,
      shipped: false,
      delivered: false,
      ...data.result,
    };
    return admin
      .firestore()
      .collection("orders")
      .doc(uidAndTime)
      .set({ order });
  } else {
    return null;
  }
});

// export const updateOrders = functions.https.onCall(async (data, context) => {
//   const userID = context.auth.uid;
//   const item = data.item;
//   const itemName = item[0];
//   let itemQuery = db
//     .collection(`/products`)
//     .where("productName", "==", `${itemName}`);
//   let updateFunction = itemQuery
//     .get()
//     .then((snapshot) => {
//       if (snapshot.empty) {
//         return console.log("no matching product");
//       }
//       let updateItems = snapshot.forEach((product) => {
//         console.log(product.data());
//         console.log(product.id);
//         let productId = product.id;
//         let prevOrdered = product.data().Ordered;

//         let emptyArr = [];

//         let itemColorFull = item[4].split("_");
//         let itemColor = itemColorFull[0];

//         if (item[3] === "One-Size" || item[3] === "One Size") {
//           emptyArr.push("oneSize");
//         } else {
//           let itemSize = item[3].split("/").join("").toLowerCase();
//           emptyArr.push(itemSize);
//         }

//         let optionsString = `${itemColor}_${emptyArr[0]}`;

//         let prevStockCount = product.data().Stock[optionsString];

//         let newStockCount = Number(prevStockCount) - 1;

//         let orderedNum = Number(prevOrdered);
//         let newNum = Number(orderedNum + 1);

//         console.log(orderedNum, newNum);

//         const productDoc = db
//           .collection(`/products`)
//           .doc(`${productId}`)
//           .update({
//             Ordered: newNum,
//             [`Stock.${optionsString}`]: newStockCount,
//           });

//         return productDoc;
//       });
//       return updateItems;
//     })
//     .catch((error) => {
//       return console.log(error);
//     });
//   return updateFunction;
// });

export const sendReceiptEmail = functions.https.onCall(
  async (data, context) => {
    const { details, basket, email, address } = data.order;

    let products = basket.map((product: Product) => {
      return `${product.name} (${product.selectedSize}, ${product.selectedColor})`;
    });

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "jfalconmusik@gmail.com", // generated ethereal user
        pass: "bozxnfpjcaswiixq", // specific to this app
      },
    });

    // send mail with defined transport object
    let clientEmail = await transporter.sendMail({
      from: "<no-reply-bardic-inspiration@gmail.com>", // sender address
      to: email?.toString(), // list of receivers
      subject: "Your Order from Bardic Inspiration", // Subject line
      text: "newText", // plain text body
      html: `<h2>Bardic Inspiration</h2>
      <p>An order containing the following items:
      <br />
      <b>
      ${products.join("\n")}
      </b>
      <br />
       has been confirmed for a total of <b>$${details.cost}</b>
       \n
       and will be sent to <b>${address}</b>
       \n
                         Expect your items in the mail soon!
                              </p>
                              `, // html body
    });

    let adminEmail = await transporter.sendMail({
      from: "<no-reply-bardic-inspiration@gmail.com>", // sender address
      to: "jfalconmusik@gmail.com", // list of receivers
      subject: `New Order - $${details.cost}`, // Subject line
      text: "", // plain text body
      html: `<h2>Bardic Inspiration</h2>
      <p>An order containing the following items:
      <br />
      <b>
      ${products.join("\n")}
      </b>
      <br />
       has been confirmed for a total of <b>$${details.cost}</b>.
       \n
       Ship to <b>${address}</b>.
       \n
                              </p>
                              `, // html body
    });
    return {
      adminEmail,
      clientEmail,
    };
  }
);

// Get order info from db - send timestamp, items, and amount paid:
export const getUserOrders = functions.https.onCall((data, context) => {
  let uid = context?.auth?.uid;
  const ordersQuery = admin
    .firestore()
    .collection(`/orders`)
    .where("order_data.uid", "==", uid);

  const ordersTotal = ordersQuery
    .get()
    .then((snapshot) => {
      const orders: any[] = [];
      snapshot.forEach((order) => {
        let timeStamp = order.data().order_data.created;
        let orderItems = order.data().order_data.items;
        let orderAmount = order.data().order_data.amount;
        let orderType = order.data().order_data.type;
        let creditUsed = order.data().order_data.storeCreditUsed;
        let uspsStatus = order.data().order_data.uspsStatus;
        let uspsTracking = order.data().order_data.uspsTracking;

        orders.push({
          timeStamp,
          orderItems,
          orderAmount,
          orderType,
          creditUsed,
          uspsStatus,
          uspsTracking,
        });
      });
      return orders.reverse();
    })
    .catch((error) => {
      console.log(error);
    });

  return ordersTotal;
});
