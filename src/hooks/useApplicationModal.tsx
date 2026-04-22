import { useState } from "react";
import type { Job } from "../features/dashboard/types";

interface UseApplicationModalReturn {
  isApplicationModalOpen: boolean;
  selectedJobForApplication: Job | null;
  openApplicationModal: (job: Job) => void;
  closeApplicationModal: () => void;
}

export const useApplicationModal = (): UseApplicationModalReturn => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] =
    useState<Job | null>(null);

  const openApplicationModal = (job: Job) => {
    setSelectedJobForApplication(job);
    setIsApplicationModalOpen(true);
  };

  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setSelectedJobForApplication(null);
  };

  return {
    isApplicationModalOpen,
    selectedJobForApplication,
    openApplicationModal,
    closeApplicationModal,
  };
};
