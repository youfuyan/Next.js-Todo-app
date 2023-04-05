import '@/styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
