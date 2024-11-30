import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { SpecialtiesRoutes } from "../modules/specialities/specialties.route";
import { doctorRoutes } from "../modules/Doctor/doctor.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },

  {
    path: "/admin",
    route: adminRoutes,
  },

  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route?.route));
export default router;
