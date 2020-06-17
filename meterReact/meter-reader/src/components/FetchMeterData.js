import React from "react";

export default class FetchMeterData extends React.Component {
  state = {
    loading: true,
    readings: null,
  };
  componentDidMount() {
    const url = "localhost:5000/meterReadings/";
  }
  render() {
    return <div></div>;
  }
}
