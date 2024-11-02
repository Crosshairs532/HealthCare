import { Server } from "http";
import app from "./app";

const port = 2000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`Server is listening on port : ${port}`);
  });
}
main();
