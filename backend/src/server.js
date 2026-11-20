import { createConfiguredApp } from "./app.js";
import { config } from "./config.js";

const app = await createConfiguredApp();
app.listen(config.port, () => {
  console.log(`API disponível em http://localhost:${config.port}`);
});
