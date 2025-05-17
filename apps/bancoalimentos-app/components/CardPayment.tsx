import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_..."); // Tu clave pública de Stripe

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js aún no está cargado
      return;
    }

    // Llama a tu backend para crear PaymentIntent y obtener clientSecret
    const clientSecret = await fetchClientSecretFromBackend();

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      alert(`Error: ${error.message}`);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      alert("¡Pago exitoso!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: 1500, margin: "auto", padding: 20 }}
    >
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe} style={{ marginTop: 20 }}>
        Pagar
      </button>
    </form>
  );
}

// Simula llamada a backend
async function fetchClientSecretFromBackend() {
  const res = await fetch("https://tu-backend.com/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 1000, currency: "usd" }),
  });
  const data = await res.json();
  return data.clientSecret;
}

export function CardPayment() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}


// import React, { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// // Clave pública de Stripe (test)
// const stripePromise = loadStripe("pk_test_51RPR7RQTXuhvSkyhbrRTQYM7bcN8jFX3TDt1bQMNJ4RtKwRVyG3Ki70k63isVNg39j1vAb9f3Op8Pg09Kav5Dv9w00XIWnui3O");

// // Opciones del Payment Element (layout tabs, tema plano)
// const appearance = {
//   theme: "flat",
//   variables: {
//     colorPrimaryText: "#262626",
//   },
// };
// const paymentElementOptions = {
//   layout: {
//     type: "tabs",       // Diseño en pestañas
//     defaultCollapsed: false,
//   },
//   business: {
//     name: "RocketRides",
//   },
//   // Puedes agregar más opciones como carteras: true para mostrar Apple Pay, Google Pay
//   // carteras: true,
// };

// function CheckoutForm({ clientSecret }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setIsLoading(true);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: window.location.href, // puedes cambiar por tu URL de confirmación
//       },
//       redirect: "if_required",
//     });

//     if (error) {
//       setMessage(error.message);
//     } else {
//       setMessage("Pago confirmado!");
//     }
//     setIsLoading(false);
//   };

//   return (
//     <form id="payment-form" onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
//       <PaymentElement id="payment-element" options={paymentElementOptions} />
//       <button disabled={isLoading || !stripe || !elements} id="submit" style={{ marginTop: 20 }}>
//         {isLoading ? "Procesando..." : "Pagar"}
//       </button>
//       {message && <div id="payment-message" style={{ marginTop: 20, color: "red" }}>{message}</div>}
//     </form>
//   );
// }

// export default function PaymentPage() {
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     // Simula llamada al backend para crear PaymentIntent y obtener clientSecret
//     fetch("/create-payment-intent", { method: "POST" }) // Cambia por tu endpoint real
//       .then((res) => res.json())
//       .then((data) => {
//         setClientSecret(data.clientSecret);
//       });
//   }, []);

//   const options = {
//     clientSecret,
//     appearance,
//   };

//   return (
//     <div style={{ padding: 50 }}>
//       <h1>Pago seguro con Stripe Payment Element</h1>
//       {clientSecret ? (
//         <Elements stripe={stripePromise} options={options}>
//           <CheckoutForm clientSecret={clientSecret} />
//         </Elements>
//       ) : (
//         <p>Cargando formulario de pago...</p>
//       )}
//     </div>
//   );
// }


// import React, { useEffect } from "react";
// import { View, Button, Alert } from "react-native";
// import {
//   StripeProvider,
//   useStripe,
//   CardField,
// } from "@stripe/stripe-react-native";

// export function CardPayment() {
//   return (
//     <StripeProvider
//       publishableKey="pk_test_..." // tu clave pública
//     >
//       <PaymentScreen />
//     </StripeProvider>
//   );
// }

// function PaymentScreen() {
//   const { confirmPayment } = useStripe();

//   const handlePayPress = async () => {
//     // Aquí normalmente haces una llamada a tu backend para crear un PaymentIntent y obtener el clientSecret
//     const clientSecret = await fetchClientSecretFromBackend();
//     const { error, paymentIntent } = await confirmPayment(clientSecret, {
//       paymentMethodType: "Card",
//     });

//     if (error) {
//       Alert.alert(`Error: ${error.message}`);
//     } else if (paymentIntent) {
//       Alert.alert("¡Pago exitoso!");
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <CardField
//         postalCodeEnabled={false}
//         style={{ height: 50, marginVertical: 30 }}
//       />
//       <Button title="Pagar" onPress={handlePayPress} />
//     </View>
//   );
// }

// // Simula tu backend (debes implementarlo realmente con Stripe)
// async function fetchClientSecretFromBackend() {
//   const res = await fetch("https://tu-backend.com/create-payment-intent", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ amount: 1000, currency: "usd" }),
//   });
//   const data = await res.json();
//   return data.clientSecret;
// }
