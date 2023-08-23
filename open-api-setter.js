import { exec } from 'child_process';
import 'dotenv/config'

// eslint-disable-next-line no-undef
const OPEN_API_URL = process.env.OPEN_API_URL;

const generateTypes = async () => {
  const outputFile = "./src/types/OpenAPITypes.ts";
  exec(
    `npx openapi-typescript ${OPEN_API_URL} -o ${outputFile}`,
    (err, stdout) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
    }
  );
};

generateTypes();
