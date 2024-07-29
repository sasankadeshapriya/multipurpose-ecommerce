import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.get("/",(req,res) => {
    res.send("server is ready!");
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});