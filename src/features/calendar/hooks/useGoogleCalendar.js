import { useEffect, useRef, useState } from "react";
import {
  deleteGoogleCalendarEvent,
  GOOGLE_CALENDAR_SCOPE,
  googleCalendarClientId,
  insertGoogleCalendarEvent,
  isGoogleCalendarConfigured,
  listGoogleCalendarEvents,
  loadGoogleIdentityScript,
  revokeGoogleCalendarAccess,
  updateGoogleCalendarEvent,
} from "../services/googleCalendarService";

const getMonthKey = (monthDate) =>
  `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

export const useGoogleCalendar = ({ user, language }) => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [tokenResponse, setTokenResponse] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const tokenClientRef = useRef(null);

  useEffect(() => {
    if (!isGoogleCalendarConfigured || typeof window === "undefined") {
      return;
    }

    let isMounted = true;

    loadGoogleIdentityScript()
      .then((google) => {
        if (!isMounted) {
          return;
        }

        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
          client_id: googleCalendarClientId,
          scope: GOOGLE_CALENDAR_SCOPE,
          callback: () => {},
        });
        setIsScriptReady(true);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        console.error("Google Identity Services load error:", error);
        setConnectionError("Google Calendar is unavailable right now.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!tokenResponse?.access_token) {
      setCalendarEvents([]);
      return;
    }

    let isMounted = true;

    const run = async () => {
      setIsLoadingEvents(true);

      try {
        const events = await listGoogleCalendarEvents({
          accessToken: tokenResponse.access_token,
          monthDate: currentMonthDate,
        });

        if (isMounted) {
          setCalendarEvents(events);
          setConnectionError("");
        }
      } catch (error) {
        console.error("Google Calendar fetch error:", error);

        if (isMounted) {
          setConnectionError("Failed to load Google Calendar events.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingEvents(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [currentMonthDate, tokenResponse?.access_token]);

  useEffect(() => {
    if (!user) {
      setTokenResponse(null);
      setCalendarEvents([]);
      setConnectionError("");
    }
  }, [user]);

  const connectCalendar = async () => {
    if (!isGoogleCalendarConfigured) {
      throw new Error("Google Calendar client ID is not configured.");
    }

    if (!tokenClientRef.current) {
      throw new Error("Google Calendar auth is not ready yet.");
    }

    setIsConnecting(true);
    setConnectionError("");

    try {
      const response = await new Promise((resolve, reject) => {
        tokenClientRef.current.callback = (tokenResult) => {
          if (tokenResult?.error) {
            reject(new Error(tokenResult.error));
            return;
          }

          resolve(tokenResult);
        };

        tokenClientRef.current.requestAccessToken({
          prompt: tokenResponse?.access_token ? "" : "consent",
          login_hint: user?.email ?? undefined,
        });
      });

      setTokenResponse(response);
      return response;
    } catch (error) {
      setConnectionError("Google Calendar connection was cancelled.");
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectCalendar = async () => {
    await revokeGoogleCalendarAccess(tokenResponse?.access_token);
    setTokenResponse(null);
    setCalendarEvents([]);
  };

  const syncScheduleToCalendar = async ({ schedule, appScheduleId }) => {
    if (!tokenResponse?.access_token) {
      return null;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const createdEvent = await insertGoogleCalendarEvent({
      accessToken: tokenResponse.access_token,
      schedule,
      language,
      timeZone,
      appScheduleId,
    });

    if (String(schedule.date).slice(0, 7) === getMonthKey(currentMonthDate)) {
      setCalendarEvents((prev) => [...prev, createdEvent]);
    }

    return createdEvent;
  };

  const deleteScheduleFromCalendar = async (googleCalendarEventId) => {
    if (!tokenResponse?.access_token || !googleCalendarEventId) {
      return;
    }

    await deleteGoogleCalendarEvent({
      accessToken: tokenResponse.access_token,
      eventId: googleCalendarEventId,
    });

    setCalendarEvents((prev) =>
      prev.filter((event) => event.id !== googleCalendarEventId),
    );
  };

  const updateScheduleInCalendar = async ({
    schedule,
    googleCalendarEventId,
    appScheduleId,
  }) => {
    if (!tokenResponse?.access_token || !googleCalendarEventId) {
      return null;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const updatedEvent = await updateGoogleCalendarEvent({
      accessToken: tokenResponse.access_token,
      eventId: googleCalendarEventId,
      schedule,
      language,
      timeZone,
      appScheduleId,
    });

    setCalendarEvents((prev) =>
      prev.map((event) =>
        event.id === googleCalendarEventId ? updatedEvent : event,
      ),
    );

    return updatedEvent;
  };

  return {
    isCalendarAvailable: isGoogleCalendarConfigured,
    isCalendarReady: isScriptReady,
    isCalendarConnected: Boolean(tokenResponse?.access_token),
    isConnectingCalendar: isConnecting,
    isLoadingCalendarEvents: isLoadingEvents,
    calendarConnectionError: connectionError,
    currentMonthDate,
    calendarEvents,
    connectCalendar,
    disconnectCalendar,
    syncScheduleToCalendar,
    deleteScheduleFromCalendar,
    updateScheduleInCalendar,
    goToPreviousMonth: () =>
      setCurrentMonthDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
      ),
    goToNextMonth: () =>
      setCurrentMonthDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
      ),
    goToCurrentMonth: () => {
      const now = new Date();
      setCurrentMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    },
  };
};
