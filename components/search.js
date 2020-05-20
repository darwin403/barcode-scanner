import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function Add(props) {
  const [barcode, setBarcode] = useState("asd");

  const [stats, setStats] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // api request
  const submit = () => {
    setError(null);
    setResult(null);

    return fetch(
      "/api/search?" +
        new URLSearchParams({
          barcode,
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

  // update count
  useEffect(() => {
    const subscribe = setTimeout(() => {
      return fetch("/api/stats")
        .then((response) => response.json())
        .then((response) => {
          if ("statusCode" in response && response.statusCode !== 200)
            throw new Error(response.message);
          setStats(response);
        })
        .catch((err) => {
          setError(err.message);
        });
    }, 5000);
    return () => clearTimeout(subscribe);
  });

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
        <h1 className="title is-3">
          Search Products ({stats ? stats.count : 0})
        </h1>
        <div className="row">
          <div className="columns">
            <div className="column">
              {result && !error && (
                <div className="notification is-success">
                  Product found successfully!
                  <p>
                    Product ID: {result.id}, Product Name: {result.name}
                  </p>
                </div>
              )}
              {error && !result && (
                <div className="notification is-danger">
                  Product find failed! {error}
                </div>
              )}
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control is-expanded has-icons-left">
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
                    <button className="button is-primary" onClick={submit}>
                      <span className="icon">
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                      <span>Find</span>
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
