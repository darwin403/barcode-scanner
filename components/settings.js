import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faAt,
  faEnvelopeOpenText,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function Add(props) {
  const [to, setTo] = useState("bot@nextjs.io");
  const [subject, setSubject] = useState("Awesome Nextjs");
  const [html, setHTML] = useState("You should definitely check it out!");

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // api request
  const submit = () => {
    setError(null);
    setResult(null);

    return fetch(
      "/api/settings?" +
        new URLSearchParams({
          type: "email",
          setting: JSON.stringify({ to, subject, html }),
        }),
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response && response.statusCode !== 200)
          throw new Error(response.message);
        setResult(JSON.parse(response["setting"]));
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
        <h1 className="title is-3">Email settings</h1>
        <div className="row">
          <div className="columns">
            <div className="column">
              {result && !error && (
                <div className="notification is-success">
                  Email settings updated successfully!
                  <p>
                    To: {result.to}, Subject: {result.subject}, HTML:{" "}
                    {result.html}
                  </p>
                </div>
              )}
              {error && !result && (
                <div className="notification is-danger">
                  Email settings update failed! {error}
                </div>
              )}
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control is-expanded has-icons-left">
                      <input
                        className="input"
                        type="email"
                        placeholder="noreply@bot.io"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faAt} />
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control is-expanded has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="My subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faPen} />
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <p className="control is-expanded has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="My HTML template..."
                        value={html}
                        onChange={(e) => setHTML(e.target.value)}
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faEnvelopeOpenText} />
                      </span>
                    </p>
                  </div>
                  <div className="field">
                    <button className="button is-primary" onClick={submit}>
                      <span>Update</span>
                      <span className="icon">
                        <FontAwesomeIcon icon={faArrowCircleRight} />
                      </span>
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
