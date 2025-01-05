import React from "react";
import { Modal, Box, Button } from "@mui/material";
import { ApplicationForm } from "../../schemas/application-form.schema";  // Import the ApplicationForm type

interface VerifyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    formData: ApplicationForm;  // Updated formData to match the merged schema
}

const VerifyModal: React.FC<VerifyModalProps> = ({ isOpen, onClose, onSubmit, formData }) => {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                className="modal-container"
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#374151", // Background color updated to #374151
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 24,
                    width: 400,
                }}
            >
                <h2 className="text-center text-xl font-bold text-snorlaxCream">Verify Your Information</h2>

                <div className="form-info">
                    <div className="info-item text-snorlaxBrown">
                        <strong>Full Name</strong>: <span className="text-snorlaxCream">{formData.fullName}</span>
                    </div>
                    <div className="info-item text-snorlaxBrown">
                        <strong>Email</strong>: <span className="text-snorlaxCream">{formData.email}</span>
                    </div>
                    <div className="info-item text-snorlaxBrown">
                        <strong>Phone</strong>: <span className="text-snorlaxCream">{formData.phone}</span>
                    </div>
                    <div className="info-item text-snorlaxBrown">
                        <strong>Location</strong>: <span className="text-snorlaxCream">{formData.location?.city || "N/A"}, {formData.location?.country || "N/A"}</span>
                    </div>
                    {formData.portfolioUrl && (
                        <div className="info-item text-snorlaxBrown">
                            <strong>Portfolio URL</strong>: <span className="text-snorlaxCream">{formData.portfolioUrl}</span>
                        </div>
                    )}
                    <div className="info-item text-snorlaxBrown">
                        <strong>Current Role</strong>: <span className="text-snorlaxCream">{formData.currentRole}</span>
                    </div>
                    <div className="info-item text-snorlaxBrown">
                        <strong>Years of Experience</strong>: <span className="text-snorlaxCream">{formData.yearsOfExperience}</span>
                    </div>
                    <div className="info-item text-snorlaxBrown">
                        <strong>Skills</strong>: <span className="text-snorlaxCream">{formData.skills?.join(", ") || "N/A"}</span>
                    </div>
                    <div className="info-item text-snorlaxBrown">
                        <strong>Company</strong>: <span className="text-snorlaxCream">{formData.company}</span>
                    </div>
                </div>

                <div className="modal-actions flex justify-between w-full mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 font-bold py-2 bg-snorlaxCream text-snorlaxBrown rounded-lg hover:bg-snorlaxBrown hover:text-snorlaxCream transition"
                    >
                        Go Back
                    </button>
                    <button
                        type="submit"
                        onClick={onSubmit}
                        className="px-4 font-bold py-2 bg-snorlaxCream text-snorlaxBrown rounded-lg hover:bg-snorlaxBrown hover:text-snorlaxCream transition"
                    >
                        Submit
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default VerifyModal;
