import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const router = express.Router();

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET route
router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from Naman Malhotra (Ai_Image_Generator)' });
});

// POST route for generating images using OpenAI
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    const image = aiResponse.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message || 'Something went wrong');
  }
});

// Set up multer storage
const storage = multer.memoryStorage(); // Use memory storage for Cloudinary
const upload = multer({ storage });

// POST route for uploading images (CyHR)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { originalname, buffer } = req.file; // Get original name and buffer

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'CyHr',  // Specify the folder in Cloudinary
        public_id: `Cyhr_Expert_${originalname.split('.')[0]}`,  // Unique file name
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Image upload failed', details: error });
        }
        // Send the Cloudinary URL back to the client
        res.json({ url: result.secure_url });
      }
    );

    // Use the stream method to upload the buffer
    const stream = cloudinary.uploader.upload_stream(result);
    stream.end(buffer); // Upload the buffer
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image', details: error });
  }
});

export default router;
