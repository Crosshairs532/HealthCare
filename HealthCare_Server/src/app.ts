import express from "express";
import { userRoutes } from "./app/modules/User/user.routes";
import { adminRoutes } from "./app/modules/admin/admin.routes";
import router from "./app/routes";
import globalErrorhandler from "./app/utils/globalErrorHandler";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send({
    message: "Health Care Server is running!",
  });
});

// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1", router);

app.use(globalErrorhandler);
app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      message: "Your Requested path is Not Found!",
    },
  });
});
export default app;
