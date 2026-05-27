"use client";

import { useState, useCallback } from "react";

const REWARDS_CLAIM_ENDPOINT = "/api/v1/rewards/claim";
const CLAIM_SUCCESS_MESSAGE = "Reward claimed successfully";
const CHECK_ERROR_MESSAGE = "An unexpected error occurred while checking the milestone";
const CLAIM_ERROR_MESSAGE = "An unexpected error occurred while claiming the reward";

interface RewardsSuccessPayload {
  success: true;
  data: { message: string };
}

interface RewardsErrorPayload {
  success: false;
  status?: number;
  error: string;
}

class RewardsApiError extends Error {}

export interface UseRewardsResult {
  isMilestoneReached: boolean;
  modalVisible: boolean;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  checkMilestone: (clientId: string) => Promise<void>;
  claimReward: (clientId: string) => Promise<void>;
  dismissModal: () => void;
}

export function useRewards(): UseRewardsResult {
  const [isMilestoneReached, setIsMilestoneReached] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const checkMilestone = useCallback(async (clientId: string) => {
    if (!clientId || clientId.trim() === "") {
      setError("Client ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(REWARDS_CLAIM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });

      const payload = (await response.json()) as
        | RewardsSuccessPayload
        | RewardsErrorPayload;

      if (payload.success === true) {
        setIsMilestoneReached(true);
        setModalVisible(true);
      } else {
        if (response.status === 400) {
          setIsMilestoneReached(false);
        } else {
          throw new RewardsApiError(
            (payload as RewardsErrorPayload).error || CHECK_ERROR_MESSAGE
          );
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof RewardsApiError ? err.message : CHECK_ERROR_MESSAGE;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const claimReward = useCallback(async (clientId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(REWARDS_CLAIM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });

      const payload = (await response.json()) as
        | RewardsSuccessPayload
        | RewardsErrorPayload;

      if (payload.success === true) {
        setModalVisible(false);
        setIsMilestoneReached(false);
        setSuccessMessage(CLAIM_SUCCESS_MESSAGE);
      } else {
        throw new RewardsApiError(
          (payload as RewardsErrorPayload).error || CLAIM_ERROR_MESSAGE
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof RewardsApiError ? err.message : CLAIM_ERROR_MESSAGE;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    isMilestoneReached,
    modalVisible,
    loading,
    error,
    successMessage,
    checkMilestone,
    claimReward,
    dismissModal,
  };
}
