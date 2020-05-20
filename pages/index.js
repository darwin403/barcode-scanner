import Head from "next/head";
import Scanner from "../components/scanner";
import Add from "../components/add";
import Search from "../components/search";
import Settings from "../components/settings";
import { useState } from "react";
import shortid from "shortid";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";

export default function Index() {
  const [showScanner, setShowScanner] = useState(false);
  const [items, setItems] = useState([]);

  const handleShowScanner = () => setShowScanner(true);
  const handleHideScanner = () => setShowScanner(false);

  const updateItems = (item) => {
    setItems((items) => [...items, item.codeResult.code]);
    setShowScanner(false);
  };

  return (
    <div className="app">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section class="hero is-info is-fullheight">
        <div class="hero-head">
          <header class="navbar">
            <div class="container">
              <div class="navbar-brand">
                <a class="navbar-item">
                  <img
                    src="https://bulma.io/images/bulma-type-white.png"
                    alt="Logo"
                  />
                </a>
                <span
                  class="navbar-burger burger"
                  data-target="navbarMenuHeroC"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
              <div id="navbarMenuHeroC" class="navbar-menu">
                <div class="navbar-end">
                  <a class="navbar-item is-active">Home</a>
                  <a class="navbar-item">Source</a>
                </div>
              </div>
            </div>
          </header>
        </div>
        <div class="hero-body">
          <div class="container has-text-centered">
            <h1>Build: 123</h1>
            {items.length === 0 ? (
              <h1 className="title">Find a Product</h1>
            ) : (
              <h1 className="title">Add another Product?</h1>
            )}
            <ul>
              {items.map((item) => (
                <li>{item}</li>
              ))}
            </ul>

            <button
              class="button is-large is-rounded"
              onClick={handleShowScanner}
            >
              <span class="icon is-small">
                <FontAwesomeIcon icon={faBarcode} />
              </span>

              <span>Scan Barcode</span>
            </button>
            {showScanner && (
              <div class={showScanner ? "modal is-active" : "modal"}>
                {/* <div class="modal-background"></div> */}
                <div class="modal-background">
                  <Scanner onDetected={updateItems} />
                </div>
                <button
                  class="modal-close is-large"
                  aria-label="close"
                  onClick={handleHideScanner}
                ></button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Add />
      <Search />
      <Settings />
    </div>
  );
}
