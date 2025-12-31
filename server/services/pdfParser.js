// services/pdfParser.js
import fs from "fs";
import * as pdfParse from "pdf-parse";

export async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse.default(dataBuffer);
  return data.text;
}
