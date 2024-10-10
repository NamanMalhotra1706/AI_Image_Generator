import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongoDb/connect.js';
import postRoutes from './routes/postRoutes.js';
import imageRoutes from './routes/imageRoutes.js';


const port = 3000;
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/image', imageRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from Naman Malhotra"S(AI_Image_Generator)',
  });
// res.send("Hello World!");
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(port, () => console.log(`Server Started on Port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();