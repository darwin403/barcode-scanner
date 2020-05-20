import { useState, useEffect, setState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faBarcode,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import shortid from "shortid";

export default function Cart(props) {
  const [products, setProducts] = useState([]);
  const [fromEmail, setFromEmail] = useState("wow@bo.io");

  const [emailResult, setEmailResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setProducts(
      props.products.map((i) => {
        return { ...i, quantity: 1 };
      })
    );
  }, [props.products]);

  const updateQuantity = (e, id) => {
    const value = e.target.value;
    let newQuantity = value ? parseInt(value) : value;

    setProducts((prevProducts) =>
      prevProducts.map((i) => {
        if (i.id !== id) return i;
        return { ...i, quantity: newQuantity };
      })
    );
  };
  const removeProduct = (id) => {
    setProducts((prevState) => prevState.filter((i) => i.id !== id));
  };

  const submitEmail = () => {
    fetch(
      "/api/email?" +
        new URLSearchParams({
          from: fromEmail,
          products: JSON.stringify(products),
        }),
      { method: "POST" }
    )
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response && response.statusCode !== 200)
          throw new Error(response.message);
        if ("ok" in response) {
          setProducts([]);
        }
        setError(null);
        setEmailResult(response);
      })
      .catch((err) => {
        setEmailResult(null);
        setError(err.message);
      });
  };

  return (
    <div className="has-text-left">
      {emailResult && "ok" in emailResult && (
        <div class="notification is-success">
          The shipper has been notified!
        </div>
      )}
      {error && <div class="notification is-success">{error}</div>}
      {products.length !== 0 && (
        <>
          <h1 className="title is-6">Product(s) in Cart: {products.length}</h1>
          <div className="box">
            {products.map((i) => (
              <article className="media" key={shortid.generate()}>
                <figure className="media-left is-hidden-mobile">
                  <p className="image is-64x64">
                    <img src={`https://picsum.photos/id/${i.id}/128/128`} />
                  </p>
                </figure>
                <div className="media-content">
                  <div className="content">
                    <div>
                      <strong>{i.name}</strong>{" "}
                      <small>
                        <FontAwesomeIcon
                          icon={faBarcode}
                          style={{ marginLeft: "16px" }}
                        />{" "}
                        {i.barcode.toUpperCase()}
                      </small>
                    </div>
                    <div>{i.description}</div>
                    <div className="has-text-grey">
                      Cost: ${i.cost * i.quantity} | Retail: $
                      {i.retail * i.quantity} | Quantity:{" "}
                      <div
                        className="field"
                        style={{
                          display: "inline-block",
                          width: "36px",
                          marginLeft: "4px",
                        }}
                      >
                        <div className="control">
                          <input
                            className="input is-small"
                            type="text"
                            value={i.quantity}
                            onChange={(e) => updateQuantity(e, i.id)}
                            style={{ padding: "3px", height: "2em" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="media-right">
                  <button
                    className="delete"
                    onClick={() => removeProduct(i.id)}
                  ></button>
                </div>
              </article>
            ))}
          </div>

          <button
            class="button is-success is-large is-fullwidth"
            onClick={submitEmail}
          >
            <span className="icon">
              <FontAwesomeIcon icon={faPaperPlane} />{" "}
            </span>
            <span>Email Shipper</span>
          </button>
        </>
      )}
    </div>
  );
}

Cart.defaultProps = {
  products: [
    {
      id: 1,
      name: "H7G",
      description: "FORMULA (H7) 1 GALON",
      barcode: "ABC-abc-1234",
      cost: 6.0,
      retail: 10.0,
    },
    {
      id: 2,
      name: "H7MP36",
      description: "H7 MULTI PURPOSE CLEANER 36 OZ",
      barcode: "KLM-osj-1234",
      cost: 3.0,
      retail: 6.0,
    },
    {
      id: 3,
      name: "GPMP",
      description: "GP-MULTI PURPOSE CLEANR 32 OZ",
      barcode: "EFG-dbc-1234",
      cost: 3.0,
      retail: 6.0,
    },
  ],
};
