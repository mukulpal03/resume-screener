import { SmartPDFParser } from 'pdf-parse-new';
import mammoth from 'mammoth';

async function extractText(file: Express.Multer.File) {
  const { mimetype, buffer } = file;

  if (mimetype === 'application/pdf') {
    const parser = new SmartPDFParser();
    const data = await parser.parse(buffer);
    return data.text;
  }

  if (
    mimetype === 'application/msword' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(`Unsupported file type: ${mimetype}`);
}

export default extractText;
