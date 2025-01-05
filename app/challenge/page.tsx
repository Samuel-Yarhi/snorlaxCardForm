"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import 'react-phone-number-input/style.css';
import './cardStyles.css';
import BackSide from "./backSide";
import FrontSide from "./frontSide";
import { ApplicationForm, ApplicationFormSchema } from "@/schemas/application-form.schema";
import VerifyModal from "./VerifyModal";  // Import the VerifyModal component

const ChallengePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state for opening/closing
  const methods = useForm<ApplicationForm>({
    resolver: zodResolver(ApplicationFormSchema),
    mode: "all",
  });

  const { handleSubmit, getValues, trigger } = methods;

  // Check if local storage has a flipped card, default to false
  const [isFlipped, setIsFlipped] = useState(false);

  // Load isFlipped state from local storage on component mount
  useEffect(() => {
    const storedIsFlipped = localStorage.getItem("isFlipped");
    if (storedIsFlipped) {
      setIsFlipped(JSON.parse(storedIsFlipped));
    }
  }, []);

  // Handle form submission
  const onSubmit = (data: ApplicationForm) => {
    localStorage.clear();  // Clear local storage
    methods.reset();  // Reset form data
  };

  // Open the modal with the current form data
  const handleOpenModal = async () => {
    const isValid = await trigger();
    isValid && setIsModalOpen(true)
  }

  // Close the modal
  const handleCloseModal = () => setIsModalOpen(false);

  // Handle the submit action from the modal
  const handleModalSubmit = () => {
    const data = getValues();  // Get form data using getValues
    console.log("Form Data from Modal: ", data);
    handleSubmit(onSubmit)();  // Trigger form submission
    handleCloseModal();  // Close the modal after submit
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex items-center justify-center p-4">
      <div className="card-container">
        <div className={`card ${isFlipped ? 'flipped' : ''}`}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FrontSide isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
              <BackSide isFlipped={isFlipped} setIsFlipped={setIsFlipped} onVerify={handleOpenModal} />
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Verify Modal - Render the modal here */}
      <VerifyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        formData={getValues()}
      />
    </main>
  );
};

export default ChallengePage;
