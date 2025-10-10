import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  }
});

const Prompt = mongoose.model('Prompt', promptSchema);

export default Prompt;