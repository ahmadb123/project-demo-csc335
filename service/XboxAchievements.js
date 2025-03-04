// src/service/XboxAchievements.js

import React from "react";

const apiUrl = 'http://localhost:8080';

export const getXboxAchievements = async () => {
  const uhs = localStorage.getItem("uhs");
  const XSTS_token = localStorage.getItem("XSTS_token");

  // Fix the condition so that we return early if either is missing
  if (!uhs || !XSTS_token) {
    console.error("User is not authenticated");
    // Return an empty array (or handle it however you like)
    return [];
  }

  try {
    const response = await fetch(`${apiUrl}/api/xbox/profile/achievements`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `XBL3.0 x=${uhs};${XSTS_token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Make sure we return an array to avoid .map() errors.
      return Array.isArray(data) ? data : [];
    } else {
      console.error("Failed to fetch achievements. Status:", response.status);
      return [];
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
