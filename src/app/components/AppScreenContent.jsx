import React from "react";
import { useTranslation } from "react-i18next";
import CalendarDashboard from "../../features/calendar/components/CalendarDashboard";
import MonthlyScheduleListScreen from "../../features/schedule/components/screens/MonthlyScheduleListScreen";
import ScheduleEntryScreen from "../../features/schedule/components/screens/ScheduleEntryScreen";
import WallpaperSetupScreen from "../../features/wallpaper/components/screens/WallpaperSetupScreen";
import WallpaperResultScreen from "../../features/wallpaper/components/screens/WallpaperResultScreen";

function AppScreenContent({
  currentScreen,
  screenKeys,
  monthOptions,
  allSchedules,
  calendarProps,
  workflowSchedules,
  sortOption,
  onSortOptionChange,
  onScreenChange,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onExportSchedules,
  onSelectMonth,
  onDeleteMonth,
  onStartNew,
  isGenerating,
  generatingMonthLabel,
  deletingMonthKey,
  selectedBgColor,
  onBgColorChange,
  eventTypeColors,
  onEventTypeColorChange,
  thumbnailFileName,
  thumbnailDimensions,
  thumbnailPreviewUrl,
  onThumbnailSelect,
  onGenerateNext,
  onGoToMonthList,
  generatedWallpaperUrl,
  onDownload,
  activeMonthLabel,
}) {
  const { t } = useTranslation();

  if (currentScreen === screenKeys.MONTH_LIST) {
    return (
      <MonthlyScheduleListScreen
        monthOptions={monthOptions}
        calendarWidget={
          <CalendarDashboard
            schedules={allSchedules}
            googleEvents={calendarProps.calendarEvents}
            currentMonthDate={calendarProps.currentMonthDate}
            isCalendarAvailable={calendarProps.isCalendarAvailable}
            isCalendarReady={calendarProps.isCalendarReady}
            isCalendarConnected={calendarProps.isCalendarConnected}
            isConnectingCalendar={calendarProps.isConnectingCalendar}
            isLoadingCalendarEvents={calendarProps.isLoadingCalendarEvents}
            calendarConnectionError={calendarProps.calendarConnectionError}
            onConnectCalendar={calendarProps.connectCalendar}
            onDisconnectCalendar={calendarProps.disconnectCalendar}
            onPrevMonth={calendarProps.goToPreviousMonth}
            onNextMonth={calendarProps.goToNextMonth}
            onToday={calendarProps.goToCurrentMonth}
          />
        }
        isGenerating={isGenerating}
        generatingLabel={generatingMonthLabel}
        deletingMonthKey={deletingMonthKey}
        onSelectMonth={onSelectMonth}
        onDeleteMonth={onDeleteMonth}
        onStartNew={onStartNew}
      />
    );
  }

  if (currentScreen === screenKeys.ENTRY) {
    return (
        <ScheduleEntryScreen
          schedules={workflowSchedules}
          sortOption={sortOption}
          onChangeSortOption={onSortOptionChange}
          onAddSchedule={onAddSchedule}
          onUpdateSchedule={onUpdateSchedule}
          onDeleteSchedule={onDeleteSchedule}
          onExportSchedules={onExportSchedules}
        onPrev={onGoToMonthList}
        onNext={() => onScreenChange(screenKeys.SETUP)}
      />
    );
  }

  if (currentScreen === screenKeys.SETUP) {
    return (
      <WallpaperSetupScreen
        selectedBgColor={selectedBgColor}
        onBgColorChange={onBgColorChange}
        eventTypeColors={eventTypeColors}
        onEventTypeColorChange={onEventTypeColorChange}
        thumbnailFileName={thumbnailFileName}
        thumbnailDimensions={thumbnailDimensions}
        thumbnailPreviewUrl={thumbnailPreviewUrl}
        onThumbnailSelect={onThumbnailSelect}
        isGenerating={isGenerating}
        onPrev={() => onScreenChange(screenKeys.ENTRY)}
        onNext={onGenerateNext}
      />
    );
  }

  if (currentScreen === screenKeys.SAVED_RESULT) {
    return (
      <WallpaperResultScreen
        generatedWallpaperUrl={generatedWallpaperUrl}
        onPrev={onGoToMonthList}
        onGoStepOne={() => onScreenChange(screenKeys.ENTRY)}
        onGoStepTwo={() => onScreenChange(screenKeys.SETUP)}
        onDownload={onDownload}
        title={activeMonthLabel || undefined}
        subtitle={t("wallpaper.savedResultSubtitle")}
        stepLabel=""
        showPrevButton
        showHomeButton={false}
      />
    );
  }

  return (
    <WallpaperResultScreen
      generatedWallpaperUrl={generatedWallpaperUrl}
      onPrev={() => onScreenChange(screenKeys.SETUP)}
      onGoHome={onGoToMonthList}
      onGoStepOne={() => onScreenChange(screenKeys.ENTRY)}
      onGoStepTwo={() => onScreenChange(screenKeys.SETUP)}
      onDownload={onDownload}
    />
  );
}

export default AppScreenContent;
