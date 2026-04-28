import React, { useState, useEffect } from "react";
import { partsAPI } from "../../services/api";
import UpdatePartModal from "../../components/shop/UpdatePartModal";

const ManageParts = () => {
  const [parts, setParts] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await partsAPI.getAll();
        setParts(response.data);
      } catch (error) {
        console.error("Error fetching parts:", error);
      }
    };

    fetchParts();
  }, []);

  const handleDelete = async (partId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this part?"
    );
    if (confirmDelete) {
      try {
        const response = await partsAPI.delete(partId);
        if (response.status === 200) {
          setParts(parts.filter((part) => part._id !== partId));
          alert("Part deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting part:", error);
        alert("Failed to delete part.");
      }
    }
  };

  const handleUpdate = (part) => {
    setSelectedPart(part);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (partId, updateData) => {
    try {
      const response = await partsAPI.update(partId, updateData);
      if (response.status === 200) {
        setParts(parts.map(part => 
          part._id === partId ? response.data : part
        ));
        alert("Part updated successfully!");
      }
    } catch (error) {
      console.error("Error updating part:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedPart(null);
  };

  return (
    <div className="manage-parts">
      <h2>Admin Panel - Manage Parts</h2>
      <div className="parts-list">
        {parts.length > 0 ? (
          parts.map((part) => (
            <div key={part._id} className="parts-card">
              <img src={part.image} alt={part.name} />
              <h3>{part.name}</h3>
              <p>Category: {part.category}</p>
              <p>Price: LKR {part.price}</p>
              <div className="parts-actions">
                <button
                  className="update-btn"
                  onClick={() => handleUpdate(part)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(part._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No parts available.</p>
        )}
      </div>

      {/* Update Part Modal */}
      <UpdatePartModal
        show={showUpdateModal}
        handleClose={handleCloseModal}
        part={selectedPart}
        onUpdate={handleUpdateSubmit}
      />
    </div>
  );
};

export default ManageParts;
