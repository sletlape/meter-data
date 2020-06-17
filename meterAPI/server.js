const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//#region Convert CSV File to JSON
let readingsData = [];
// require csvtojson module
const CSVToJSON = require("csvtojson");
// convert users.csv file to JSON array
CSVToJSON()
  .fromFile("./metering_data.csv")
  .then((metering_data) => {
    readingsData = metering_data;
    console.log("Data Loaded");
  })
  .catch((err) => {
    // log error if any
    console.log(err);
  });
//#endregion

//#region Add record to CSV file
const ObjectsToCsv = require("objects-to-csv");

async function appendToCSV(jsonObj) {
  var arrObj = [jsonObj];
  const csv = new ObjectsToCsv(arrObj);

  await csv.toDisk("./metering_data.csv", { append: true });
}
//#endregion

//#region status messages
function successReq(res, msg) {
  res.status(200).json({ message: msg });
}

function failedReq(res, msg) {
  res.status(404).json({ message: msg });
}
//#endregion

//#region API endpoints

//create more readings.
app.post("/meterReadings", (req, res) => {
  if (
    req.body.Serial &&
    req.body.ReadingDateTimeUTC &&
    req.body.WH &&
    req.body.VARH
  ) {
    const newReading = req.body;

    console.log(newReading);
    readingsData.push(newReading);
    appendToCSV(newReading);

    console.log("Posting");
    successReq(res, "New reading added");
  } else {
    failedReq(
      res,
      "Couldn't  add new reading. Ensure that all fields are provided!"
    );
  }
});

app.get("/", (req, res) => {
  res.send("Testing api");
});

app.get("/meterReading/:meterSerial", (req, res) => {
  let match = [];
  const serial = req.params.meterSerial;
  console.log(req.params);

  for (let reading of readingsData) {
    if (reading.Serial === serial) {
      match.push(reading);
    }
  }

  match.length > 0
    ? successReq(res, match)
    : failedReq(res, "No readings with serial number: " + serial);
});

app.get("/meterReading/data", (req, res) => {
  res.json(readingsData);
});

app.get("/meterSerial/", (req, res) => {
  const serial = req.params.meterSerial;
  let meterSerials = [];

  for (let reading of readingsData)
    meterSerials.indexOf(reading.Serial) === -1
      ? meterSerials.push(reading.Serial)
      : {};

  meterSerials.length > 0
    ? successReq(res, meterSerials)
    : failedReq(res, "Serial numbers found!");
});

// //get meter number
// app.get("/meterSerial/:meterSerial", (req, res) => {
//   const serial = req.params.meterSerial;
//   let meterSerials = [];

//   for (let reading of readingsData)
//     meterSerials.indexOf(reading.Serial) === -1
//       ? meterSerials.push(reading.Serial)
//       : {};

//   meterSerials.length > 0
//     ? successReq(res, meterSerials)
//     : failedReq(res, "Serial number found!");
// });

//#endregion

app.listen(port, () => console.log(`Listening on Local host port  ${port}!`));
