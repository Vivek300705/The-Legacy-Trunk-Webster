import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Prompt from './src/models/Prompt.model.js';

dotenv.config();

const prompts = [
  { question: "What's the best gift you've ever received?" },
  { question: "Describe a time you felt truly happy." },
  { question: "Who was your best friend in elementary school?" },
  { question: "What was your favorite family vacation?" },
  { question: "Describe your first car or bicycle." },
  { question: "What's a meal that reminds you of home?" },
  { question: "Who was your favorite teacher and why?" },
  { question: "What's a lesson you learned the hard way?" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
    
    await Prompt.deleteMany({});
    console.log('Old prompts removed.');

    await Prompt.insertMany(prompts);
    console.log('New prompts added!');
    
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();