import mongoose from "mongoose";

const RelationSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relationshipType: {
      type: String,
      enum: [
        "Parent",
        "Child",
        "Spouse",
        "Sibling",
        "Grandparent",
        "Grandchild",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // ✅ ADD THIS
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    adminApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminApprovedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Relation = mongoose.model('Relation',RelationSchema);

export default Relation;