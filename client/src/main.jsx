import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ApolloProvider } from '@apollo/client/react'
import client from "./apolloClient.js";
import 'bootstrap/dist/css/bootstrap.min.css';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Elements stripe={stripePromise}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </Elements>
    </ApolloProvider>
  </React.StrictMode>,
)
