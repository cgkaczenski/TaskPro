"use client";

import { useEffect, useState } from "react";
import { DeleteProjectModal } from "@/components/modals/delete-project-modal";

export const DeleteProjectProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DeleteProjectModal />
    </>
  );
};
