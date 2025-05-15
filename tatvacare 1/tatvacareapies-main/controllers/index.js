const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
const db = require("./models");
const { URL, REQUEST_TIMEOUT, PORT, DB_NAME } = require("./config");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from the 'public' folder
app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    message: `Tatva Care Server running on ${PORT}`
  });
});

app.use("/api", require("./routes"));

const startApp = async () => {
  await db.mongoose.connect(URL, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: REQUEST_TIMEOUT,
    minPoolSize: 5,
    maxPoolSize: 30,
  });
  console.log(`Successfully connected with the Database`);
  app.listen(PORT, () =>
    console.log(`Tatva Care Server started on port ${PORT}`)
  );
};

startApp();
