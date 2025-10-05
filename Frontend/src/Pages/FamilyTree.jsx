import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Add,
  Edit,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  ArrowBack,
} from "@mui/icons-material";
import { getFamilyCircle } from "../api/services";

const FamilyTree = () => {
  const { circleId } = useParams();
  const navigate = useNavigate();
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchFamilyData();
  }, [circleId]);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const data = await getFamilyCircle(circleId);
      setFamilyData(data);
    } catch (err) {
      console.error("Error fetching family data:", err);
      setError("Failed to load family tree");
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Sample tree structure - you'll need to adapt this based on your data
  const buildTreeStructure = () => {
    if (!familyData) return null;

    // For now, we'll create a simple structure
    // You'll need to enhance this based on your relationship data
    return {
      id: familyData.admin._id,
      name: familyData.admin.name,
      photo: familyData.admin.profilePicture || "/default-avatar.jpg",
      role: "Admin",
      children:
        familyData.member?.map((member) => ({
          id: member._id,
          name: member.name,
          photo: member.profilePicture || "/default-avatar.jpg",
          role: "Member",
          children: [],
        })) || [],
    };
  };

  const renderTreeNode = (node, level = 0) => {
    if (!node) return null;

    const isSelected = selectedMember?.id === node.id;

    return (
      <Box
        key={node.id}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          minWidth: 200,
          mb: 4,
        }}
      >
        {/* Connection line to parent */}
        {level > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: -40,
              width: 2,
              height: 40,
              backgroundColor: "primary.main",
              opacity: 0.3,
            }}
          />
        )}

        {/* Member Card */}
        <Card
          sx={{
            width: 180,
            cursor: "pointer",
            transition: "all 0.3s",
            border: isSelected ? 2 : 0,
            borderColor: "primary.main",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
          onClick={() => setSelectedMember(node)}
        >
          <CardContent sx={{ textAlign: "center", p: 2 }}>
            <Avatar
              src={node.photo}
              alt={node.name}
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 1,
                border: 3,
                borderColor: level === 0 ? "primary.main" : "grey.300",
              }}
            />
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {node.name}
            </Typography>
            <Chip
              label={node.role}
              size="small"
              color={level === 0 ? "primary" : "default"}
              sx={{ fontSize: "0.7rem" }}
            />
          </CardContent>
        </Card>

        {/* Children */}
        {node.children && node.children.length > 0 && (
          <Box sx={{ mt: 4, position: "relative" }}>
            {/* Horizontal connecting line */}
            {node.children.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  left: "10%",
                  right: "10%",
                  height: 2,
                  backgroundColor: "primary.main",
                  opacity: 0.3,
                }}
              />
            )}

            <Box
              sx={{
                display: "flex",
                gap: 4,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {node.children.map((child) => renderTreeNode(child, level + 1))}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const treeData = buildTreeStructure();

  return (
    <Box
      sx={{ minHeight: "100vh", backgroundColor: "background.default", py: 4 }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate(`/family-circle/${circleId}`)}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Family Tree
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {familyData?.name}
              </Typography>
            </Box>
          </Box>

          {/* Zoom Controls */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Zoom">
              <IconButton onClick={handleResetZoom}>
                <CenterFocusStrong />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Tree Container */}
        <Paper
          sx={{
            p: 4,
            minHeight: 600,
            overflow: "auto",
            backgroundColor: "background.paper",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.3s ease",
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            {treeData && renderTreeNode(treeData)}
          </Box>
        </Paper>

        {/* Selected Member Info */}
        {selectedMember && (
          <Paper sx={{ mt: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected Member
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar
                src={selectedMember.photo}
                alt={selectedMember.name}
                sx={{ width: 60, height: 60 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {selectedMember.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMember.role}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                sx={{ ml: "auto" }}
                onClick={() => navigate(`/profile/${selectedMember.id}`)}
              >
                View Profile
              </Button>
            </Box>
          </Paper>
        )}

        {/* Instructions */}
        <Alert severity="info" sx={{ mt: 3 }}>
          Click on a family member to view their details. Use zoom controls to
          adjust the view.
        </Alert>
      </Container>
    </Box>
  );
};

export default FamilyTree;
