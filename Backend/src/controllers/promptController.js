import Prompt from '../models/Prompt.model.js';
console.log("Inside promptController.js");
export const getRandomPrompt = async (req, res) => {
  try {
    const randomPrompt = await Prompt.aggregate([{ $sample: { size: 1 } }]);
    console.log("Random Prompt Fetched:", randomPrompt);
    if (!randomPrompt.length) {
      return res.status(404).json({ message: 'No prompts found.' });
    }

    res.status(200).json(randomPrompt[0]);
  } catch (error) {
    console.error("Error in getRandomPrompt controller:", error);
    res.status(500).json({ message: 'Error fetching prompt', error });
  }
};