import express from "express";
import { userRoutes } from "./app/modules/User/user.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send({
    message: "Health Care Server is running!",
  });
});

app.use("/api/v1/user", userRoutes);
export default app;
