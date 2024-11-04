import express from "express";
import { userRoutes } from "./app/modules/User/user.routes";
import { adminRoutes } from "./app/modules/admin/admin.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send({
    message: "Health Care Server is running!",
  });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
export default app;
