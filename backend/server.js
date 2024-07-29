import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("server is ready!");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
