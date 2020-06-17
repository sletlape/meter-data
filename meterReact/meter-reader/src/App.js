import React, { useState } from "react";
import axios from "axios";

import "./App.css";

import Search from "./components/Search";
import MeterCharts from "./components/MeterCharts";

const meterAPI = "http://localhost:5000/meterReading/";
let searching = "";
let msg = {};

const App = () => {
  const [readings, setReadings] = useState(null);

  const search = async (searchValue) => {
    searching = searchValue;
    const response = await axios.get(meterAPI + searchValue);
    setReadings(response.data);
  };

  if (readings) {
    console.log("Here");
    msg = readings.message;
    console.log(msg);
  } else {
    msg = "Please enter meter number search again!";
  }

  return (
    <div className="App">
      <Search search={search} />

      <p>{searching}</p>
      {msg[0].WH}
      <div>
        <div className="VARH_Container">
          <MeterCharts metric={"VARH"} data={msg} />
        </div>

        <div className="WH_Container">
          <MeterCharts metric={"WH"} data={msg} />
        </div>
      </div>
      <div>
        {/* {() => {
          if ((msg = "Please enter meter number search again!")) {
            return <p>No Meter selected</p>;
          } else {
            return (
              <div>
                <div className="VARH_Container">
                  <MeterCharts metric={"VARH"} data={msg} />
                </div>

                <div className="WH_Container">
                  <MeterCharts metric={"WH"} data={msg} />
                </div>
              </div>
            );
          }
        }} */}
      </div>
    </div>
  );
};

export default App;
