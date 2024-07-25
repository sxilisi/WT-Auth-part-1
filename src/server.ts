import express from "express";
import "express-async-errors";
import morgan from "morgan";
import {
  getAll,
  getOneById,
  create,
  updateOneById,
  deleteOneById,
  createImage,
} from "./controllers/planets.js";
import { logIn } from "./controllers/users.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const app = express();
const port = 3000;

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/planets", getAll);
app.get("/api/planets/:id", getOneById);
app.post("/api/planets", create);
app.put("/api/planets/:id", updateOneById);
app.delete("/api/planets/:id", deleteOneById);
app.post("/api/planets/:id/image", upload.single("image"), createImage);

app.post("/api/users/login", logIn);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello My Dev!" });
});

app.listen(port, () => {
  console.log(`Express app listening on http://localhost:${port}`);
});
