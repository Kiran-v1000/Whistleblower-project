import app from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`Ethics Portal API listening on port ${env.port}`);
});
