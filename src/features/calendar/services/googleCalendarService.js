import {
  buildGoogleCalendarEventPayload,
  getMonthBounds,
} from "../utils/calendarUtils";

const GOOGLE_CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const GOOGLE_GIS_SCRIPT_ID = "google-identity-services";
const GOOGLE_GIS_SRC = "https://accounts.google.com/gsi/client";

export const googleCalendarClientId =
  import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID || "";

export const isGoogleCalendarConfigured = Boolean(googleCalendarClientId);

export const loadGoogleIdentityScript = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not available."));
      return;
    }

    if (window.google?.accounts?.oauth2) {
      resolve(window.google);
      return;
    }

    const existingScript = document.getElementById(GOOGLE_GIS_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Identity Services.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_GIS_SCRIPT_ID;
    script.src = GOOGLE_GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(script);
  });

const authorizedFetch = async (url, accessToken, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Google Calendar request failed (${response.status}): ${errorText}`,
    );
  }

  return response.status === 204 ? null : response.json();
};

export const listGoogleCalendarEvents = async ({
  accessToken,
  monthDate,
}) => {
  const { start, end } = getMonthBounds(monthDate);
  const params = new URLSearchParams({
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
  });

  const data = await authorizedFetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
    accessToken,
  );

  return data.items ?? [];
};

export const insertGoogleCalendarEvent = async ({
  accessToken,
  schedule,
  language,
  timeZone,
  appScheduleId,
}) =>
  authorizedFetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    accessToken,
    {
      method: "POST",
      body: JSON.stringify(
        buildGoogleCalendarEventPayload(
          schedule,
          language,
          timeZone,
          appScheduleId,
        ),
      ),
    },
  );

export const updateGoogleCalendarEvent = async ({
  accessToken,
  eventId,
  schedule,
  language,
  timeZone,
  appScheduleId,
}) =>
  authorizedFetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
    accessToken,
    {
      method: "PUT",
      body: JSON.stringify(
        buildGoogleCalendarEventPayload(
          schedule,
          language,
          timeZone,
          appScheduleId,
        ),
      ),
    },
  );

export const deleteGoogleCalendarEvent = async ({
  accessToken,
  eventId,
}) =>
  authorizedFetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
    accessToken,
    {
      method: "DELETE",
    },
  );

export const revokeGoogleCalendarAccess = async (accessToken) => {
  if (!accessToken || !window.google?.accounts?.oauth2?.revoke) {
    return;
  }

  await new Promise((resolve) => {
    window.google.accounts.oauth2.revoke(accessToken, () => resolve());
  });
};

export {
  GOOGLE_CALENDAR_SCOPE,
};
