import React from "react";
import Graph from "./Graph";
import "./Layout.css"; // Import the CSS file for styling

function Layout() {
  const [fillAmount, setFillAmount] = React.useState(-1);
  const [lastRefresh, setLastRefresh] = React.useState(
    new Date().toLocaleString("en-US")
  );
  const [serverErr, setServerErr] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const lastFive = [100, 93, 84, 80, fillAmount];

  function refresh() {
    try {
      setLoading(true);
      fetch("http://water-meter.ddns.net/analyze_image/api/")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((json) => {
          setFillAmount(json.response);
          setLoading(false);
          let date = new Date().toLocaleString("en-US");
          setServerErr(0);
          setLastRefresh(date);
        })
        .catch((error) => {
          setServerErr(1);
          setLoading(false);
          console.error("There was a problem with the fetch operation:", error);
        });
    } catch (e) {
      setServerErr(1);
      setLoading(false);
      console.error("There was a problem with the try block:", e);
    }
  }

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="layout-container">
      <div className="fill-container">
        <h1>Water Level:</h1>
        <div className="big-number">{fillAmount}%</div>

        <div
          className="progress"
          role="progressbar"
          aria-label="Animated striped example"
          aria-valuenow={fillAmount}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={
              fillAmount < 20
                ? "progress-bar progress-bar-striped bg-danger progress-bar-animated"
                : "progress-bar progress-bar-striped progress-bar-animated"
            }
            style={{ width: `${fillAmount}%` }}
          ></div>
        </div>
        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={loading}
          onClick={refresh}
        >
          Refresh Data
        </button>
        {serverErr === 0 && (
          <div className="last-refresh">Last Refreshed: {lastRefresh}</div>
        )}
        {serverErr === 1 && (
          <div className="alert alert-danger" role="alert">
            There was an error connecting to the server.
          </div>
        )}
      </div>

      <div className="graph-element">
        <Graph data={lastFive} />
      </div>
    </div>
  );
}

export default Layout;
