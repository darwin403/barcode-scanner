import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import shortid from "shortid";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";

import Scanner from "../components/scanner";
import Add from "../components/add";
import Search from "../components/search";
import Settings from "../components/settings";
import Cart from "../components/cart";

export default function Index() {
  const [showScanner, setShowScanner] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const maxBarcodeAttempts = 10;
  const currentBarcodeAttempts = useRef(0);

  const handleShowScanner = () => setShowScanner(true);
  const handleHideScanner = () => {
    setShowScanner(false);
    currentBarcodeAttempts.current = 0;
  };

  const fetchProduct = (barcode) => {
    if (currentBarcodeAttempts.current >= maxBarcodeAttempts) {
      setError(`Unable to find product for barcode: "${barcode}"`);
      handleHideScanner();
      return;
    }

    fetch("/api/search?" + new URLSearchParams({ barcode }))
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) throw new Error(response.message);

        setProducts((prevProducts) => {
          if (prevProducts.some((i) => i.id === response.id)) {
            return prevProducts;
          }
          return [...prevProducts, response];
        });
        setError(null);
        handleHideScanner();
      })
      .catch((error) => {
        currentBarcodeAttempts.current++;
      });
  };

  return (
    <div className="app">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="hero is-info is-fullheight">
        <div className="hero-head">
          <header className="navbar">
            <div className="container">
              <div className="navbar-brand">
                <a className="navbar-item">DEMO</a>
                <span
                  className="navbar-burger burger"
                  data-target="navbarMenuHeroC"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
              <div id="navbarMenuHeroC" className="navbar-menu">
                <div className="navbar-end">
                  <a className="navbar-item">Source</a>
                </div>
              </div>
            </div>
          </header>
        </div>
        <div className="hero-body">
          <div className="container has-text-centered">
            <img
              src="https://i.imgur.com/yuGpzAH.png"
              style={{ height: "50px" }}
            />
            <div className="row" style={{ margin: "3em 0" }}>
              <h1 className="title">
                {products.length === 0
                  ? "Add a Product"
                  : "Add another product?"}
              </h1>

              <button
                className="button is-large is-rounded"
                onClick={handleShowScanner}
              >
                <span className="icon is-small">
                  <FontAwesomeIcon icon={faBarcode} />
                </span>

                <span>Scan Barcode</span>
              </button>
              {showScanner && (
                <div className={showScanner ? "modal is-active" : "modal"}>
                  <div className="modal-background">
                    <Scanner onBarcode={fetchProduct} />
                  </div>
                  <button
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={handleHideScanner}
                  ></button>
                </div>
              )}
            </div>
            <div className="row">
              {error && <div className="notification is-danger">{error}</div>}
              <Cart products={products} />
            </div>
          </div>
        </div>
      </section>
      <Add />
      <Search />
      <Settings />
    </div>
  );
}
