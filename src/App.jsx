import React, { useEffect, useState } from "react";
import loadingImage from "./assets/loading.jpg";
import FirebaseConfigNotice from "./components/FirebaseConfigNotice";
import MonthlyScheduleListScreen from "./features/schedule/components/screens/MonthlyScheduleListScreen";
import ScheduleEntryScreen from "./features/schedule/components/screens/ScheduleEntryScreen";
import WallpaperSetupScreen from "./features/wallpaper/components/screens/WallpaperSetupScreen";
import WallpaperResultScreen from "./features/wallpaper/components/screens/WallpaperResultScreen";
import { firebaseConfigError } from "./firebaseConfig";
import { DEFAULT_EVENT_TYPE_COLORS } from "./features/wallpaper/constants/eventTypes";
import {
  subscribeSchedules,
  addSchedule,
  deleteSchedule,
} from "./features/schedule/services/scheduleService";
import { generateWallpaperImage } from "./features/wallpaper/utils/wallpaperGenerator";

const SORT_OPTIONS = {
  DATE_ASC: "date_asc",
  DATE_DESC: "date_desc",
  FLIGHT_DESC: "flight_desc",
  STANDBY_DESC: "standby_desc",
  TRAINING_DESC: "training_desc",
};

const SCREEN_KEYS = {
  MONTH_LIST: "month_list",
  ENTRY: "entry",
  SETUP: "setup",
  RESULT: "result",
  SAVED_RESULT: "saved_result",
};

const DEFAULT_WORKFLOW_KEY = "__default__";
const DEFAULT_BG_COLOR = "#6d28d9";

const compareByDateAsc = (a, b) => a.date.localeCompare(b.date);
const compareByDateDesc = (a, b) => b.date.localeCompare(a.date);
const getMonthKey = (dateText = "") => String(dateText).slice(0, 7);
const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split("-");
  return `${year}-${Number(month)}월 스케줄`;
};

const getSortedSchedules = (schedules, sortOption) => {
  const sortedSchedules = [...schedules];

  switch (sortOption) {
    case SORT_OPTIONS.DATE_DESC:
      return sortedSchedules.sort(compareByDateDesc);
    case SORT_OPTIONS.FLIGHT_DESC:
      return sortedSchedules
        .filter((schedule) => schedule.eventType === "flight")
        .sort(compareByDateDesc);
    case SORT_OPTIONS.STANDBY_DESC:
      return sortedSchedules
        .filter((schedule) => schedule.eventType === "standby")
        .sort(compareByDateDesc);
    case SORT_OPTIONS.TRAINING_DESC:
      return sortedSchedules
        .filter((schedule) => schedule.eventType === "training")
        .sort(compareByDateDesc);
    case SORT_OPTIONS.DATE_ASC:
    default:
      return sortedSchedules.sort(compareByDateAsc);
  }
};

function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(SCREEN_KEYS.MONTH_LIST);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.DATE_ASC);
  const [selectedBgColor, setSelectedBgColor] = useState(DEFAULT_BG_COLOR);
  const [eventTypeColors, setEventTypeColors] = useState(
    DEFAULT_EVENT_TYPE_COLORS,
  );
  const [thumbnailFileName, setThumbnailFileName] = useState("");
  const [thumbnailDimensions, setThumbnailDimensions] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");
  const [thumbnailCache, setThumbnailCache] = useState({});
  const [generatedWallpaperUrl, setGeneratedWallpaperUrl] = useState("");
  const [isGeneratingWallpaper, setIsGeneratingWallpaper] = useState(false);
  const [activeMonthKey, setActiveMonthKey] = useState(null);
  const [activeMonthLabel, setActiveMonthLabel] = useState("");
  const [generatingMonthLabel, setGeneratingMonthLabel] = useState("");
  const [deletingMonthKey, setDeletingMonthKey] = useState("");
  const [newWorkflowStartedAt, setNewWorkflowStartedAt] = useState(null);

  const workflowKey = activeMonthKey ?? DEFAULT_WORKFLOW_KEY;
  const baseWorkflowSchedules = activeMonthKey
    ? schedules.filter((schedule) => getMonthKey(schedule.date) === activeMonthKey)
    : newWorkflowStartedAt
      ? schedules.filter((schedule) => {
          if (!schedule.createdAt) {
            return false;
          }

          return schedule.createdAt >= newWorkflowStartedAt;
        })
      : [];
  const workflowSchedules = getSortedSchedules(baseWorkflowSchedules, sortOption);

  useEffect(() => {
    const loadingStartTime = Date.now();
    let loadingTimer;

    const finishLoading = () => {
      const elapsed = Date.now() - loadingStartTime;
      const remaining = Math.max(0, 100 - elapsed);

      loadingTimer = setTimeout(() => {
        setLoading(false);
      }, remaining);
    };

    const unsubscribe = subscribeSchedules(
      (schedulesData) => {
        setSchedules(schedulesData);
        finishLoading();
      },
      (error) => {
        console.error("Firestore 연동 오류:", error);
        finishLoading();
      },
    );

    return () => {
      unsubscribe();
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
    };
  }, []);

  useEffect(() => {
    const cachedThumbnail = thumbnailCache[workflowKey];

    setThumbnailFileName(cachedThumbnail?.fileName ?? "");
    setThumbnailDimensions(cachedThumbnail?.dimensions ?? null);
    setThumbnailPreviewUrl(cachedThumbnail?.previewUrl ?? "");
  }, [thumbnailCache, workflowKey]);

  const updateThumbnailCache = (nextThumbnailState) => {
    setThumbnailCache((prev) => ({
      ...prev,
      [workflowKey]: nextThumbnailState,
    }));
  };

  const handleAddSchedule = async (newSchedule) => {
    try {
      await addSchedule(newSchedule);
    } catch (error) {
      console.error("비행편 추가 오류:", error);
      alert("비행편 추가에 실패했습니다. Firebase 설정을 확인해주세요.");
      throw error;
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
    } catch (error) {
      console.error("비행편 삭제 오류:", error);
      alert("비행편 삭제에 실패했습니다.");
    }
  };

  const handleDeleteMonth = async (monthOption) => {
    const shouldDelete = window.confirm(
      `${monthOption.label}의 일정 ${monthOption.schedules.length}개를 모두 삭제할까요?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingMonthKey(monthOption.key);

    try {
      await Promise.all(
        monthOption.schedules.map((schedule) => deleteSchedule(schedule.id)),
      );

      if (activeMonthKey === monthOption.key) {
        setActiveMonthKey(null);
        setActiveMonthLabel("");
        setGeneratedWallpaperUrl("");
        setCurrentScreen(SCREEN_KEYS.MONTH_LIST);
      }
    } catch (error) {
      console.error("월별 스케줄 삭제 오류:", error);
      alert("월별 스케줄 삭제에 실패했습니다.");
    } finally {
      setDeletingMonthKey("");
    }
  };

  const handleBgColorChange = (nextColor) => {
    setSelectedBgColor(nextColor);
    setGeneratedWallpaperUrl("");
  };

  const handleEventTypeColorChange = (eventType, nextColor) => {
    setEventTypeColors((prev) => ({
      ...prev,
      [eventType]: nextColor,
    }));
    setGeneratedWallpaperUrl("");
  };

  const handleThumbnailSelect = (file) => {
    if (!file) {
      setGeneratedWallpaperUrl("");
      updateThumbnailCache({
        fileName: "",
        dimensions: null,
        previewUrl: "",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const previewUrl = typeof reader.result === "string" ? reader.result : "";
      const image = new Image();

      image.onload = () => {
        setGeneratedWallpaperUrl("");
        updateThumbnailCache({
          fileName: file.name,
          dimensions: {
            width: image.naturalWidth,
            height: image.naturalHeight,
          },
          previewUrl,
        });
      };

      image.onerror = () => {
        setGeneratedWallpaperUrl("");
        updateThumbnailCache({
          fileName: file.name,
          dimensions: null,
          previewUrl,
        });
      };

      image.src = previewUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleGenerateWallpaper = async () => {
    if (!thumbnailPreviewUrl) {
      alert("이미지를 먼저 선택해주세요.");
      return false;
    }

    setIsGeneratingWallpaper(true);

    try {
      const referenceDate = workflowSchedules[0]?.date
        ? new Date(workflowSchedules[0].date)
        : new Date();

      const imageUrl = await generateWallpaperImage({
        backgroundColor: selectedBgColor,
        eventTypeColors,
        thumbnailImageUrl: thumbnailPreviewUrl,
        schedules: workflowSchedules,
        referenceDate,
      });

      setGeneratedWallpaperUrl(imageUrl);
      return true;
    } catch (error) {
      console.error("배경화면 생성 오류:", error);
      alert("배경화면 생성에 실패했습니다.");
      return false;
    } finally {
      setIsGeneratingWallpaper(false);
    }
  };

  const handleSetupNext = async () => {
    const generated = await handleGenerateWallpaper();
    if (generated) {
      setCurrentScreen(
        activeMonthKey ? SCREEN_KEYS.SAVED_RESULT : SCREEN_KEYS.RESULT,
      );
    }
  };

  const handleOpenSavedMonth = async (monthOption) => {
    setActiveMonthKey(monthOption.key);
    setActiveMonthLabel(monthOption.label);
    setGeneratingMonthLabel(monthOption.label);
    setIsGeneratingWallpaper(true);

    try {
      const cachedThumbnail = thumbnailCache[monthOption.key];
      const imageUrl = await generateWallpaperImage({
        backgroundColor: selectedBgColor,
        eventTypeColors,
        thumbnailImageUrl: cachedThumbnail?.previewUrl ?? "",
        schedules: monthOption.schedules,
        referenceDate: new Date(`${monthOption.key}-01`),
      });

      setGeneratedWallpaperUrl(imageUrl);
      setCurrentScreen(SCREEN_KEYS.SAVED_RESULT);
    } catch (error) {
      console.error("저장된 월별 이미지 생성 오류:", error);
      alert("선택한 월의 이미지를 불러오지 못했습니다.");
    } finally {
      setIsGeneratingWallpaper(false);
      setGeneratingMonthLabel("");
    }
  };

  const handleStartNew = () => {
    setActiveMonthKey(null);
    setActiveMonthLabel("");
    setGeneratingMonthLabel("");
    setGeneratedWallpaperUrl("");
    setSelectedBgColor(DEFAULT_BG_COLOR);
    setEventTypeColors(DEFAULT_EVENT_TYPE_COLORS);
    setThumbnailFileName("");
    setThumbnailDimensions(null);
    setThumbnailPreviewUrl("");
    setThumbnailCache((prev) => ({
      ...prev,
      [DEFAULT_WORKFLOW_KEY]: {
        fileName: "",
        dimensions: null,
        previewUrl: "",
      },
    }));
    setNewWorkflowStartedAt(new Date().toISOString());
    setCurrentScreen(SCREEN_KEYS.ENTRY);
  };

  const handleDownloadWallpaper = () => {
    if (!generatedWallpaperUrl) return;

    const link = document.createElement("a");
    link.href = generatedWallpaperUrl;
    link.download = `schedule_wallpaper_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const monthOptions = Array.from(
    schedules.reduce((map, schedule) => {
      const monthKey = getMonthKey(schedule.date);
      if (!monthKey) return map;
      if (!map.has(monthKey)) {
        map.set(monthKey, []);
      }
      map.get(monthKey).push(schedule);
      return map;
    }, new Map()),
  )
    .map(([key, monthSchedules]) => ({
      key,
      label: formatMonthLabel(key),
      schedules: [...monthSchedules].sort(compareByDateAsc),
    }))
    .sort((a, b) => b.key.localeCompare(a.key));

  const shouldShowStepper =
    currentScreen === SCREEN_KEYS.ENTRY ||
    currentScreen === SCREEN_KEYS.SETUP ||
    currentScreen === SCREEN_KEYS.RESULT;

  const renderCurrentScreen = () => {
    if (currentScreen === SCREEN_KEYS.MONTH_LIST) {
      return (
        <MonthlyScheduleListScreen
          monthOptions={monthOptions}
          isGenerating={isGeneratingWallpaper}
          generatingLabel={generatingMonthLabel}
          deletingMonthKey={deletingMonthKey}
          onSelectMonth={handleOpenSavedMonth}
          onDeleteMonth={handleDeleteMonth}
          onStartNew={handleStartNew}
        />
      );
    }

    if (currentScreen === SCREEN_KEYS.ENTRY) {
      return (
        <ScheduleEntryScreen
          schedules={workflowSchedules}
          sortOption={sortOption}
          onChangeSortOption={setSortOption}
          onAddSchedule={handleAddSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onPrev={() => setCurrentScreen(SCREEN_KEYS.MONTH_LIST)}
          onNext={() => setCurrentScreen(SCREEN_KEYS.SETUP)}
        />
      );
    }

    if (currentScreen === SCREEN_KEYS.SETUP) {
      return (
        <WallpaperSetupScreen
          selectedBgColor={selectedBgColor}
          onBgColorChange={handleBgColorChange}
          eventTypeColors={eventTypeColors}
          onEventTypeColorChange={handleEventTypeColorChange}
          thumbnailFileName={thumbnailFileName}
          thumbnailDimensions={thumbnailDimensions}
          thumbnailPreviewUrl={thumbnailPreviewUrl}
          onThumbnailSelect={handleThumbnailSelect}
          isGenerating={isGeneratingWallpaper}
          onPrev={() => setCurrentScreen(SCREEN_KEYS.ENTRY)}
          onNext={handleSetupNext}
        />
      );
    }

    if (currentScreen === SCREEN_KEYS.SAVED_RESULT) {
      return (
        <WallpaperResultScreen
          generatedWallpaperUrl={generatedWallpaperUrl}
          onPrev={() => setCurrentScreen(SCREEN_KEYS.MONTH_LIST)}
          onGoStepOne={() => setCurrentScreen(SCREEN_KEYS.ENTRY)}
          onGoStepTwo={() => setCurrentScreen(SCREEN_KEYS.SETUP)}
          onDownload={handleDownloadWallpaper}
          title={activeMonthLabel || "저장된 스케줄 결과"}
          subtitle="저장된 월별 일정으로 만든 이미지 목업입니다."
          stepLabel=""
          showPrevButton
          showHomeButton={false}
        />
      );
    }

    return (
      <WallpaperResultScreen
        generatedWallpaperUrl={generatedWallpaperUrl}
        onPrev={() => setCurrentScreen(SCREEN_KEYS.SETUP)}
        onGoHome={() => setCurrentScreen(SCREEN_KEYS.MONTH_LIST)}
        onGoStepOne={() => setCurrentScreen(SCREEN_KEYS.ENTRY)}
        onGoStepTwo={() => setCurrentScreen(SCREEN_KEYS.SETUP)}
        onDownload={handleDownloadWallpaper}
      />
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="mb-3 w-full bg-[#1565C0] text-white shadow-lg">
        <div className="flex h-12 w-full max-w-3xl items-center px-3">
          <h1 className="text-xl font-bold sm:text-2xl">HAN BI SCHEDULE</h1>
        </div>
      </header>

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-3xl px-3">
          {firebaseConfigError ? (
            <FirebaseConfigNotice />
          ) : loading ? (
            <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 py-12">
              <img
                src={loadingImage}
                alt="로딩 이미지"
                className="h-36 w-36 rounded-xl object-cover shadow-md sm:h-44 sm:w-44"
              />
              <p className="text-lg font-semibold text-gray-700">
                Firebase에서 데이터를 불러오는 중...
              </p>
            </div>
          ) : (
            <>
              {shouldShowStepper ? (
                <div className="mx-auto mb-5 flex w-full max-w-3xl items-center justify-between text-sm text-gray-500">
                  <span>
                    Step{" "}
                    {{
                      [SCREEN_KEYS.ENTRY]: 1,
                      [SCREEN_KEYS.SETUP]: 2,
                      [SCREEN_KEYS.RESULT]: 3,
                    }[currentScreen]}{" "}
                    / 3
                  </span>
                  <div className="flex items-center gap-2" aria-hidden="true">
                    {[SCREEN_KEYS.ENTRY, SCREEN_KEYS.SETUP, SCREEN_KEYS.RESULT].map(
                      (step) => (
                        <span
                          key={step}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            step === currentScreen
                              ? "bg-[#1565C0]"
                              : "bg-gray-300"
                          }`}
                        />
                      ),
                    )}
                  </div>
                </div>
              ) : null}
              {renderCurrentScreen()}
            </>
          )}
        </div>
      </main>

      <footer className="mt-auto w-full border-t border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-3xl px-3 py-4 text-center sm:py-6">
          <p className="text-xs opacity-75 sm:text-sm">
            2026 Schedule App - For Han Bi Yun
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
