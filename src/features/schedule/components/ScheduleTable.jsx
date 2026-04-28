import React from "react";
import { useTranslation } from "react-i18next";
import editIcon from "../../../assets/edit.svg";
import { getEventTypeLabel } from "../../wallpaper/constants/eventTypes";

function DeleteIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-current"
      fill="currentColor"
    >
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9Zm4 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z" />
    </svg>
  );
}

const EVENT_TYPE_BADGE_STYLES = {
  flight: "bg-[#DBEAFE] text-[#1D4ED8]",
  off: "bg-[#F3E8FF] text-[#7E22CE]",
  training: "bg-[#FCE7F3] text-[#BE185D]",
  standby: "bg-[#FEF3C7] text-[#B45309]",
};

const getScheduleEventTypeLabel = (schedule, t) =>
  getEventTypeLabel(schedule.eventType ?? "flight", t);

const getAircraftLabel = (schedule, t) => {
  if (schedule.eventType && schedule.eventType !== "flight") {
    return getScheduleEventTypeLabel(schedule, t);
  }

  return (
    schedule.aircraft ||
    schedule.flightNumber ||
    schedule.flightNo ||
    schedule.flight ||
    "-"
  );
};

const getDestinationLabel = (schedule, t) => {
  if (schedule.eventType && schedule.eventType !== "flight") {
    return getScheduleEventTypeLabel(schedule, t);
  }

  return (
    schedule.destination ||
    schedule.arrivalAirport ||
    schedule.destinationName ||
    schedule.city ||
    "-"
  );
};

const formatDisplayTime = (time, layoverTime) => {
  if (!time || time === "-") {
    return "-";
  }

  if (!layoverTime || layoverTime === "-") {
    return time;
  }

  return `${time} / ${layoverTime}`;
};

const getModalDetailRows = (schedule, t) => {
  const rows = [
    {
      label: t("schedule.eventType"),
      value: getScheduleEventTypeLabel(schedule, t),
    },
    {
      label: t("schedule.aircraft"),
      value: getAircraftLabel(schedule, t),
    },
    {
      label: t("schedule.departureTime"),
      value: schedule.departureTime || "-",
    },
    {
      label: t("schedule.arrivalTime"),
      value: schedule.arrivalTime || "-",
    },
    {
      label: t("schedule.destination"),
      value: getDestinationLabel(schedule, t),
    },
  ];

  if (schedule.isLayover) {
    rows.splice(
      4,
      0,
      {
        label: t("schedule.hongKongDepartureDate"),
        value: schedule.hongKongDepartureDate || "-",
      },
      {
        label: t("schedule.hongKongDepartureTime"),
        value: schedule.hongKongDepartureTime || "-",
      },
      {
        label: t("schedule.hongKongArrivalTime"),
        value: schedule.hongKongArrivalTime || "-",
      },
    );
  }

  return rows;
};

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Edit schedule"
      className="inline-flex items-center justify-center rounded-2xl bg-[#1E6DEB] px-4 py-3 text-white shadow-sm transition hover:bg-[#1565C0] active:bg-[#0D47A1]"
    >
      <img
        src={editIcon}
        alt=""
        aria-hidden="true"
        className="h-4 w-4 brightness-0 invert"
      />
    </button>
  );
}

function ScheduleTable({ schedules, onDelete, onEdit }) {
  const { t } = useTranslation();
  const [selectedSchedule, setSelectedSchedule] = React.useState(null);

  React.useEffect(() => {
    if (!selectedSchedule || typeof document === "undefined") {
      return undefined;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [selectedSchedule]);

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      {schedules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
          <p className="mb-2 text-base font-medium sm:text-lg">
            {t("schedule.emptyTitle")}
          </p>
          <p className="text-sm sm:text-base">
            {t("schedule.emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="min-h-[200px]">
          <p className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
            {t("schedule.listTitle")}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-x-0 border-spacing-y-[6px] text-sm md:text-base">
              <thead className="hidden sm:table-header-group">
                <tr className="bg-[#1565C0] text-white">
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    {t("schedule.date")}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    {t("schedule.category")}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    {t("schedule.departure")}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    {t("schedule.arrival")}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    {t("schedule.details")}
                  </th>
                  <th className="px-3 py-2 text-center font-semibold sm:px-4 sm:py-3 md:px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {schedules.map((schedule) => {
                  const eventType = schedule.eventType ?? "flight";
                  const aircraftLabel = getAircraftLabel(schedule, t);
                  const destinationLabel = getDestinationLabel(schedule, t);
                  const departureDisplay = formatDisplayTime(
                    schedule.departureTime,
                    schedule.hongKongDepartureTime,
                  );
                  const arrivalDisplay = formatDisplayTime(
                    schedule.arrivalTime,
                    schedule.hongKongArrivalTime,
                  );
                  const badgeStyle =
                    EVENT_TYPE_BADGE_STYLES[eventType] ??
                    EVENT_TYPE_BADGE_STYLES.flight;

                  return (
                    <React.Fragment key={schedule.id}>
                      <tr className="border-b border-gray-200 sm:hidden">
                        <td className="p-0" colSpan={6}>
                          <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
                            <div className="space-y-3 p-4">
                              <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 text-xs text-gray-900">
                                <button
                                  type="button"
                                  onClick={() => setSelectedSchedule(schedule)}
                                  className="text-left"
                                >
                                  <p className="font-light">{t("schedule.date")}</p>
                                  <p className="text-sm font-light text-[#1565C0] underline underline-offset-2">
                                    {schedule.date}
                                  </p>
                                </button>
                                <span
                                  className={`inline-flex min-w-[72px] items-center justify-center whitespace-nowrap rounded-full px-3 py-1 font-medium leading-none ${badgeStyle}`}
                                >
                                  {getScheduleEventTypeLabel(schedule, t)}
                                </span>
                              </div>
                              <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3 text-center">
                                <p className="text-xs font-medium text-gray-500">
                                  {t("schedule.category")}
                                </p>
                                <p className="mt-1 whitespace-nowrap text-base font-semibold leading-none text-gray-900">
                                  {getScheduleEventTypeLabel(schedule, t)}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 border-t border-gray-100 p-3">
                              <EditButton onClick={() => onEdit(schedule)} />
                              <button
                                type="button"
                                onClick={() => onDelete(schedule)}
                                aria-label="Delete schedule"
                                className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-white shadow-sm transition hover:bg-red-700 active:bg-red-800"
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>

                      <tr className="hidden h-[68px] border-b border-gray-200 bg-white text-sm transition-colors hover:bg-gray-50 sm:table-row md:text-base">
                        <td className="px-3 py-2 sm:px-4 md:px-6">
                          <button
                            type="button"
                            onClick={() => setSelectedSchedule(schedule)}
                            className="text-left text-[#1565C0] underline underline-offset-2"
                          >
                            {schedule.date}
                          </button>
                        </td>
                        <td className="px-3 py-2 sm:px-4 md:px-6">
                          <span
                            className={`inline-flex min-w-[112px] items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium leading-none sm:text-sm ${badgeStyle}`}
                          >
                            {getScheduleEventTypeLabel(schedule, t)}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 md:px-6">
                          {departureDisplay}
                        </td>
                        <td className="px-3 py-2 sm:px-4 md:px-6">
                          {arrivalDisplay}
                        </td>
                        <td className="px-3 py-2 sm:px-4 md:px-6">
                          <div className="flex flex-col gap-2">
                            <span className="inline-flex min-w-[120px] items-center justify-center whitespace-nowrap rounded-full bg-[#E0F2FE] px-3 py-1 text-xs font-medium leading-none text-[#0369A1] sm:text-sm">
                              {aircraftLabel}
                            </span>
                            <span className="inline-flex min-w-[120px] items-center justify-center whitespace-nowrap rounded-full bg-[#CCFBF1] px-3 py-1 text-xs font-medium leading-none text-[#0F766E] sm:text-sm">
                              {destinationLabel}
                            </span>
                          </div>
                        </td>
                        <td className="h-full p-0 text-center">
                          <div className="flex h-full min-h-[68px] min-w-[150px] items-center justify-center gap-2 p-2">
                            <EditButton onClick={() => onEdit(schedule)} />
                            <button
                              type="button"
                              onClick={() => onDelete(schedule)}
                              aria-label="Delete schedule"
                              className="inline-flex h-full items-center justify-center rounded-2xl bg-red-600 px-4 text-white shadow-sm transition hover:bg-red-700 active:bg-red-800"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 text-right text-xs text-gray-600 sm:mt-6 sm:pt-6 sm:text-sm">
            <p>{t("schedule.totalSchedules", { count: schedules.length })}</p>
          </div>
        </div>
      )}
      </section>

      {selectedSchedule ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <button
            type="button"
            aria-label="Close schedule details"
            className="absolute inset-0"
            onClick={() => setSelectedSchedule(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{t("schedule.date")}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {selectedSchedule.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSchedule(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-lg text-gray-500 transition hover:bg-gray-50"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {getModalDetailRows(selectedSchedule, t).map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 rounded-2xl bg-[#F8FAFC] px-4 py-3"
                >
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  <p className="text-right text-sm font-semibold text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ScheduleTable;
