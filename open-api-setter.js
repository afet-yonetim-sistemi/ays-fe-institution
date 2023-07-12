require("dotenv").config();
const { exec } = require("child_process");

const OPEN_API_URL = process.env.OPEN_API_URL;

const generateTypes = async () => {
  const outputFile = "./src/types/OpenAPITypes.ts";
  exec(
    `npx openapi-typescript ${OPEN_API_URL} -o ${outputFile}`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
    }
  );
};

generateTypes();
