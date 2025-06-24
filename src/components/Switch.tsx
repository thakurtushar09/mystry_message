"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const Switch = () => {
  const { data: session, status } = useSession();
  const [isChecked, setIsChecked] = useState(true);
  const [loading, setLoading] = useState(true);
  console.log(session);
  

  useEffect(() => {
    if (status === "authenticated") {
      const initial = session?.user?.isAcceptingMessages;
      if (typeof initial === "boolean") {
        setIsChecked(initial);
      } else {
        toast.error("Invalid session data for toggle.");
      }
      setLoading(false);
    } else if (status === "unauthenticated") {
      toast.error("You must be logged in to change preferences.");
      setLoading(false);
    }
  }, [session, status]);

  const handleToggle = async () => {
    if (loading) return;

    const newValue = !isChecked;
    setIsChecked(newValue); // Optimistic update
    setLoading(true);

    try {
      const res = await axios.post("/api/accept-messages", {
        acceptMessage: newValue,
      });

      const data = res.data;

      if (!data.success) {
        setIsChecked(!newValue); // Revert
        toast.error(data.message || "Failed to update preference.");
      } else {
        toast.success("Message preference updated!");
      }
    } catch (error: any) {
      setIsChecked(!newValue);
      toast.error(error.response?.data?.message || "Update failed.");
      console.error("POST /api/accept-message failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToggleWrapper>
      <Label>
        <HiddenCheckbox
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          disabled={loading || status !== "authenticated"}
        />
        <StyledSlider checked={isChecked} />
      </Label>
    </ToggleWrapper>
  );
};

export default Switch;

// ======================
// ✅ Styled Components
// ======================

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
`;

const HiddenCheckbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledSlider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ checked }) => (checked ? "#4ade80" : "#d1d5db")};
  transition: 0.3s ease;
  border-radius: 999px;

  &::before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: ${({ checked }) => (checked ? "26px" : "4px")};
    bottom: 4px;
    background-color: white;
    transition: 0.3s ease;
    border-radius: 50%;
  }
`;
