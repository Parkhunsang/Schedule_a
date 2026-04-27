import React from "react";
import { useTranslation } from "react-i18next";
import {
  buildCalendarEntriesByDate,
  buildMonthGrid,
  formatCalendarMonthLabel,
} from "../utils/calendarUtils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"];

function CalendarDashboard({
  schedules,
  googleEvents,
  currentMonthDate,
  isCalendarAvailable,
  isCalendarReady,
  isCalendarConnected,
  isConnectingCalendar,
  isLoadingCalendarEvents,
  calendarConnectionError,
  onConnectCalendar,
  onDisconnectCalendar,
  onPrevMonth,
  onNextMonth,
  onToday,
}) {
  const { i18n } = useTranslation();
  const language = i18n.language === "ko" ? "ko" : "en";
  const weekdayLabels =
    language === "ko" ? WEEKDAY_LABELS_KO : WEEKDAY_LABELS;
  const monthLabel = formatCalendarMonthLabel(currentMonthDate, language);
  const monthGrid = buildMonthGrid(currentMonthDate);
  const entriesByDate = buildCalendarEntriesByDate({
    schedules,
    googleEvents,
    monthDate: currentMonthDate,
    language,
  });

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6fafe_100%)] p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1565C0]">
              {language === "ko" ? "캘린더" : "Calendar"}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {monthLabel}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isCalendarConnected
                ? language === "ko"
                  ? "앱 일정과 Google Calendar 일정을 한 화면에서 함께 확인할 수 있어요."
                  : "View your app schedules and Google Calendar events together."
                : language === "ko"
                  ? "앱 일정이 먼저 보이고, Google Calendar를 연결하면 외부 일정도 함께 보여줍니다."
                  : "Your saved app schedules show here first. Connect Google Calendar to include external events too."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToday}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {language === "ko" ? "오늘" : "Today"}
            </button>
            <button
              type="button"
              onClick={onPrevMonth}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={onNextMonth}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              {">"}
            </button>
            {isCalendarAvailable ? (
              isCalendarConnected ? (
                <button
                  type="button"
                  onClick={onDisconnectCalendar}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  {language === "ko"
                    ? "Google Calendar 연결 해제"
                    : "Disconnect Google Calendar"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onConnectCalendar}
                  disabled={!isCalendarReady || isConnectingCalendar}
                  className="rounded-full bg-[#1E6DEB] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isConnectingCalendar
                    ? language === "ko"
                      ? "연결 중..."
                      : "Connecting..."
                    : language === "ko"
                      ? "Google Calendar 연결"
                      : "Connect Google Calendar"}
                </button>
              )
            ) : (
              <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                {language === "ko"
                  ? "Google Calendar 클라이언트 ID 설정 필요"
                  : "Set a Google Calendar client ID to enable sync"}
              </span>
            )}
          </div>
        </div>

        {calendarConnectionError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {calendarConnectionError}
          </div>
        ) : null}

        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:p-4">
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="bg-slate-50 px-2 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:px-3"
              >
                {label}
              </div>
            ))}

            {monthGrid.map((cell) => {
              const entries = entriesByDate.get(cell.dateText) ?? [];

              return (
                <div
                  key={cell.dateText}
                  className={`min-h-[124px] bg-white p-2 sm:min-h-[140px] sm:p-3 ${
                    cell.isCurrentMonth ? "text-slate-900" : "text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                        cell.isToday
                          ? "bg-[#1565C0] text-white"
                          : cell.isCurrentMonth
                            ? "text-slate-700"
                            : "text-slate-300"
                      }`}
                    >
                      {cell.dayOfMonth}
                    </span>
                    {entries.length > 0 ? (
                      <span className="text-[11px] font-semibold text-slate-400">
                        {entries.length}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {entries.slice(0, 3).map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-lg px-2 py-1 text-[11px] font-medium leading-4 sm:text-xs ${entry.colorClass}`}
                      >
                        {entry.title}
                      </div>
                    ))}
                    {entries.length > 3 ? (
                      <div className="px-1 text-[11px] font-semibold text-slate-400">
                        +{entries.length - 3}
                      </div>
                    ) : null}
                    {entries.length === 0 && cell.isCurrentMonth ? (
                      <div className="pt-2 text-[11px] text-slate-300">
                        {language === "ko" ? "일정 없음" : "No events"}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-sky-100 px-2.5 py-1 font-medium text-sky-800">
              {language === "ko" ? "앱 비행 일정" : "App flight"}
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-800">
              {language === "ko" ? "Google Calendar 일정" : "Google events"}
            </span>
            {isLoadingCalendarEvents ? (
              <span>
                {language === "ko"
                  ? "Google 일정 불러오는 중..."
                  : "Loading Google events..."}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CalendarDashboard;
