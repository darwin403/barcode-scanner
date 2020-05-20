import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faEdit,
  faBarcode,
  faTag,
  faDollarSign,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function Add(props) {
  const [name, setName] = useState("asd");
  const [description, setDescription] = useState("asd");
  const [barcode, setBarcode] = useState("asd");
  const [cost, setCost] = useState("asd");
  const [retail, setRetail] = useState("asd");

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // api request
  const submit = () => {
    setError(null);
    setResult(null);

    return fetch(
      "/api/add?" +
        new URLSearchParams({
          name,
          description,
          barcode,
          cost,
          retail,
        })
    )
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response && response.statusCode !== 200)
          throw new Error(response.message);
        setResult(response);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // hide success notifs
  useEffect(() => {
    const timer = setTimeout(() => {
      setResult(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [result]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title is-3">Add Products</h1>
        <div className="row">
          <div className="columns">
            <div className="column">
              {result && !error && (
                <div class="notification is-success">
                  Product added successfully!
                  <p>
                    Product ID: {result.id}, Product Name: {result.name},
                    Product Barcode: {result.barcode}
                  </p>
                </div>
              )}
              {error && !result && (
                <div class="notification is-danger">
                  Product add failed! {error}
                </div>
              )}
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control is-expanded has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="GPMP"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faBox} />
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control is-expanded has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="GP-MULTI PURPOSE CLEANR 32 OZ"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control is-expanded has-icons-left has-icons-right">
                      <input
                        className="input"
                        type="text"
                        placeholder="ABC-abc-1234"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faBarcode} />
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control is-expanded has-icons-left has-icons-right">
                      <input
                        className="input"
                        type="text"
                        placeholder="25.33"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faDollarSign} />
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control is-expanded has-icons-left has-icons-right">
                      <input
                        className="input"
                        type="text"
                        placeholder="50.33"
                        value={retail}
                        onChange={(e) => setRetail(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faTag} />
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <button class="button is-primary" onClick={submit}>
                      <span class="icon">
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </span>
                      <span>Create</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
