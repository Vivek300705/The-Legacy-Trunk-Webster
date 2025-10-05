import Relation from "../models/Relationship.model.js";
import User from "../models/User.model.js";
import Family from "../models/FamilyCircle.model.js";

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
      return res.status(400).json({
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
    console.error("Error sending request:", error);
    res
      .status(500)
      .json({ message: "Error sending request", error: error.message });
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
  const { action } = req.body; // "approved" or "rejected"

  try {
    const request = await Relation.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Authorization check
    if (request.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to respond to this request.",
      });
    }

    request.status = action;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    console.error("Error responding to request:", error);
    res
      .status(500)
      .json({ message: "Error responding to request", error: error.message });
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

/* ---------------------------
   Get Pending Relationships for Admin
---------------------------- */
export const getPendingRelationshipsForAdmin = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("Admin pending request - User ID:", userId);

    const user = await User.findById(userId).populate("familyCircle");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.familyCircle) {
      return res
        .status(400)
        .json({ message: "You are not in a family circle" });
    }

    const family = await Family.findById(user.familyCircle).populate("member");

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    console.log("Family admin:", family.admin.toString());
    console.log("Current user:", userId.toString());

    if (family.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only admin can view pending relationships" });
    }

    const allMemberIds = [family.admin, ...family.member.map((m) => m._id)];

    console.log("All member IDs:", allMemberIds);

    const pendingRelationships = await Relation.find({
      status: "approved", // Both users approved
      approvedByAdmin: false, // But admin hasn't approved yet
      $or: [
        { requester: { $in: allMemberIds } },
        { recipient: { $in: allMemberIds } },
      ],
    })
      .populate("requester", "name email profilePicture")
      .populate("recipient", "name email profilePicture")
      .sort({ createdAt: -1 });

    console.log("Found pending relationships:", pendingRelationships.length);

    res.status(200).json(pendingRelationships);
  } catch (error) {
    console.error("Error fetching pending relationships:", error);
    res.status(500).json({
      message: "Error fetching pending relationships",
      error: error.message,
    });
  }
};

/* ---------------------------
   Admin Approve/Reject Relationship
---------------------------- */
export const adminApproveRelationship = async (req, res) => {
  const { requestId } = req.params;
  const { approved } = req.body; // true or false

  try {
    const userId = req.user._id;

    console.log("Admin approval request:", { requestId, approved, userId });

    const user = await User.findById(userId).populate("familyCircle");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.familyCircle) {
      return res
        .status(400)
        .json({ message: "You are not in a family circle" });
    }

    // Check if user is admin
    const family = await Family.findById(user.familyCircle).populate("member");

    if (!family) {
      return res.status(404).json({ message: "Family circle not found" });
    }

    if (family.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only admin can approve relationships" });
    }

    const relationship = await Relation.findById(requestId)
      .populate("requester", "name email profilePicture")
      .populate("recipient", "name email profilePicture");

    if (!relationship) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    console.log("Found relationship:", relationship);

    // Check if both users are in the same family circle
    const allMemberIds = [
      family.admin.toString(),
      ...family.member.map((m) => m._id.toString()),
    ];

    const requesterInCircle = allMemberIds.includes(
      relationship.requester._id.toString()
    );
    const recipientInCircle = allMemberIds.includes(
      relationship.recipient._id.toString()
    );

    if (!requesterInCircle || !recipientInCircle) {
      return res.status(403).json({
        message: "Both users must be in your family circle",
      });
    }

    if (approved) {
      relationship.approvedByAdmin = true;
      relationship.adminApprovedBy = userId;
      relationship.adminApprovedAt = new Date();
      relationship.status = "approved";
      await relationship.save();

      console.log("Relationship approved successfully");

      res.status(200).json({
        message: "Relationship approved successfully",
        relationship,
      });
    } else {
      // Reject and delete
      await Relation.findByIdAndDelete(requestId);

      console.log("Relationship rejected and deleted");

      res.status(200).json({
        message: "Relationship rejected and removed",
      });
    }
  } catch (error) {
    console.error("Error approving relationship:", error);
    res.status(500).json({
      message: "Error processing approval",
      error: error.message,
    });
  }
};
