import fs from "node:fs/promises";

const [templatePath = "firebase.template.json", outputPath = "firebase.generated.json"] =
  process.argv.slice(2);

const serviceId = process.env.FIREBASE_CLOUD_RUN_SERVICE_ID;
const region = process.env.FIREBASE_CLOUD_RUN_REGION;

if (!serviceId || !region) {
  console.error("FIREBASE_CLOUD_RUN_SERVICE_ID and FIREBASE_CLOUD_RUN_REGION are required.");
  process.exit(1);
}

const template = await fs.readFile(templatePath, "utf8");
const rendered = template
  .replaceAll("__CLOUD_RUN_SERVICE_ID__", serviceId)
  .replaceAll("__CLOUD_RUN_REGION__", region);

await fs.writeFile(outputPath, rendered, "utf8");
