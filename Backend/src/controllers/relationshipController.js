import Relation from "../models/Relationship.model.js";

// now map the inverse relation with each other
const relationshipMap = {
  'Parent': 'Child',
  'Child': 'Parent',
  'Spouse': 'Spouse',
  'Sibling': 'Sibling',
  'Grandparent': 'Grandchild',
  'Grandchild': 'Grandparent'
};

const getInverseRelationship = (type) => relationshipMap[type] || 'related';

// create new Relationship req 
export const sendRequest = async(req,res) => {
    const {recipientId,relationshipType} = req.body;
    const requesterId = req.user._id;

    try {
        // check if this relationship or req to do so already exist 
        // checking from both sides 
        const existing = await Relation.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });
        if (existing) {
      return res.status(400).json({ message: 'A relationship or request already exists with this user.' });
    }

    const newRequest = new Relation({
      requester: requesterId,
      recipient: recipientId,
      relationshipType: relationshipType,
    });
     await newRequest.save();
    res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error sending request', error });
    }

};

// Get all the pending req for the logged in user 

export const getPendingRequests = async(req,res) => {
    try {
        const pendingRequests = await Relation.find({ 
      recipient: req.user._id, 
      status: 'pending' 
    }).populate('requester', 'name profilePicture');

    const formattedRequests = pendingRequests.map(req => ({
        ...req.toObject(),
        recipientPerspective: getInverseRelationship(req.relationshipType)
    }));
     res.status(200).json(formattedRequests);
    } catch (error) {
         res.status(500).json({ message: 'Error fetching pending requests', error });
    }
};

// Responds to a pending req (accept or reject)

export const respondToRequest = async (req, res) => {
  const { requestId } = req.params;
  const { response } = req.body; // Expects "approved" or "rejected"

  try {
    const request = await Relation.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    
    // Authorization check: only the recipient can respond
    if (request.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to respond to this request.' });
    }

    request.status = response;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error responding to request', error });
  }
};