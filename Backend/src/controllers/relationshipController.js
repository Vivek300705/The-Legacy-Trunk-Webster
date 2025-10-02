import Relation from "../models/Relationship.model.js";

// Relationship inverse mapping
const relationshipMap = {
  Parent: "Child",
  Child: "Parent",
  Spouse: "Spouse",
  Sibling: "Sibling",
  Grandparent: "Grandchild",
  Grandchild: "Grandparent",
};

const getInverseRelationship = (type) => relationshipMap[type] || "related";

/* ---------------------------
   Send Relationship Request
---------------------------- */
export const sendRequest = async (req, res) => {
  const { recipientId, relationshipType } = req.body;
  const requesterId = req.user._id;

  try {
    // Check if relationship already exists in either direction
    const existing = await Relation.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existing) {
      return res
        .status(400)
        .json({
          message: "A relationship or request already exists with this user.",
        });
    }

    const newRequest = new Relation({
      requester: requesterId,
      recipient: recipientId,
      relationshipType,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: "Error sending request", error });
  }
};

/* ---------------------------
   Get Pending Requests
---------------------------- */
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingRequests = await Relation.find({
      recipient: userId,
      status: "pending",
    })
      .populate("requester", "name email profilePicture")
      .sort({ createdAt: -1 });

    // Add perspective (optional, for front-end display)
    const formattedRequests = pendingRequests.map((request) => ({
      ...request.toObject(),
      recipientPerspective: getInverseRelationship(request.relationshipType),
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({
      message: "Error fetching pending requests",
      error: error.message,
    });
  }
};

/* ---------------------------
   Respond to Relationship Request
---------------------------- */
export const respondToRequest = async (req, res) => {
  const { requestId } = req.params;
  const { response } = req.body; // "approved" or "rejected"

  try {
    const request = await Relation.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Authorization check
    if (request.recipient.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to respond to this request.",
        });
    }

    request.status = response;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error responding to request", error });
  }
};

/* ---------------------------
   Get Approved User Relationships
---------------------------- */
export const getUserRelationships = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all approved relationships involving the user
    const relationships = await Relation.find({
      $or: [
        { requester: userId, status: "approved" },
        { recipient: userId, status: "approved" },
      ],
    })
      .populate("requester", "name email profilePicture")
      .populate("recipient", "name email profilePicture");

    const organized = {
      parents: [],
      children: [],
      spouse: [],
      siblings: [],
      grandparents: [],
      grandchildren: [],
    };

    relationships.forEach((rel) => {
      const isRequester = rel.requester._id.toString() === userId.toString();
      const relatedPerson = isRequester ? rel.recipient : rel.requester;
      const relationType = rel.relationshipType;

      if (isRequester) {
        // Perspective of requester
        switch (relationType) {
          case "Parent":
            organized.parents.push(relatedPerson);
            break;
          case "Child":
            organized.children.push(relatedPerson);
            break;
          case "Spouse":
            organized.spouse.push(relatedPerson);
            break;
          case "Sibling":
            organized.siblings.push(relatedPerson);
            break;
          case "Grandparent":
            organized.grandparents.push(relatedPerson);
            break;
          case "Grandchild":
            organized.grandchildren.push(relatedPerson);
            break;
        }
      } else {
        // Perspective of recipient (reverse relation)
        switch (relationType) {
          case "Parent":
            organized.children.push(relatedPerson);
            break;
          case "Child":
            organized.parents.push(relatedPerson);
            break;
          case "Spouse":
            organized.spouse.push(relatedPerson);
            break;
          case "Sibling":
            organized.siblings.push(relatedPerson);
            break;
          case "Grandparent":
            organized.grandchildren.push(relatedPerson);
            break;
          case "Grandchild":
            organized.grandparents.push(relatedPerson);
            break;
        }
      }
    });

    res.status(200).json(organized);
  } catch (error) {
    console.error("Error fetching user relationships:", error);
    res.status(500).json({
      message: "Error fetching relationships",
      error: error.message,
    });
  }
};
