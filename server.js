import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { mergePdfs } from './merge.js';

const app = express()
const upload = multer({ dest: 'uploads/' })
const port = 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static('public'))

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'))
});

app.post('/merge', upload.array('pdfs', 2), async (req, res, next) => {
  console.log(req.files);
  if (req.files.length !== 2) {
    return res.status(400).send('Two PDF files are required.');
  }

  const pdf1Path = path.join(__dirname, req.files[0].path);
  const pdf2Path = path.join(__dirname, req.files[1].path);

  console.log(`PDF 1 Path: ${pdf1Path}`);
  console.log(`PDF 2 Path: ${pdf2Path}`);

  try {
    let  d = await mergePdfs(pdf1Path, pdf2Path);
    res.json(`/static/${d}.pdf`);
  } catch (error) {
    console.error('Error merging PDFs:', error);
    res.status(500).send('An error occurred while merging the PDFs.');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
