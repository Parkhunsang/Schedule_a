import React, { useEffect, useState } from "react";
import loadingImage from "./assets/loading.jpg";
import AppScreenContent from "./components/AppScreenContent";
import FirebaseConfigNotice from "./components/FirebaseConfigNotice";
import { firebaseConfigError } from "./firebaseConfig";
import { useMonthlyScheduleWorkflow } from "./hooks/useMonthlyScheduleWorkflow";
import { useThumbnailWorkflow } from "./hooks/useThumbnailWorkflow";
import { useWorkflowStore } from "./store/useWorkflowStore";
import {
  addSchedule,
  deleteSchedule,
  subscribeSchedules,
} from "./features/schedule/services/scheduleService";
import { generateWallpaperImage } from "./features/wallpaper/utils/wallpaperGenerator";
import {
  DEFAULT_WORKFLOW_KEY,
  SCREEN_KEYS,
  shouldShowStepper,
} from "./utils/scheduleViewUtils";

const STEP_MAP = {
  [SCREEN_KEYS.ENTRY]: 1,
  [SCREEN_KEYS.SETUP]: 2,
  [SCREEN_KEYS.RESULT]: 3,
};

function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingWallpaper, setIsGeneratingWallpaper] = useState(false);
  const currentScreen = useWorkflowStore((state) => state.currentScreen);
  const sortOption = useWorkflowStore((state) => state.sortOption);
  const selectedBgColor = useWorkflowStore((state) => state.selectedBgColor);
  const eventTypeColors = useWorkflowStore((state) => state.eventTypeColors);
  const generatedWallpaperUrl = useWorkflowStore(
    (state) => state.generatedWallpaperUrl,
  );
  const setCurrentScreen = useWorkflowStore((state) => state.setCurrentScreen);
  const setSortOption = useWorkflowStore((state) => state.setSortOption);
  const setSelectedBgColor = useWorkflowStore(
    (state) => state.setSelectedBgColor,
  );
  const setEventTypeColors = useWorkflowStore((state) => state.setEventTypeColors);
  const setGeneratedWallpaperUrl = useWorkflowStore(
    (state) => state.setGeneratedWallpaperUrl,
  );
  const resetWorkflowVisuals = useWorkflowStore((state) => state.resetWorkflowVisuals);

  const workflow = useMonthlyScheduleWorkflow({
    schedules,
    sortOption,
    deleteSchedule,
    screenKeys: SCREEN_KEYS,
  });

  const workflowKey = workflow.activeMonthKey ?? DEFAULT_WORKFLOW_KEY;

  const {
    thumbnailFileName,
    thumbnailDimensions,
    thumbnailPreviewUrl,
    thumbnailCache,
    handleThumbnailSelect,
    resetDefaultWorkflowThumbnail,
  } = useThumbnailWorkflow({
    workflowKey,
    defaultWorkflowKey: DEFAULT_WORKFLOW_KEY,
  });

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

  const handleAddSchedule = async (newSchedule) => {
    try {
      const createdAt = new Date().toISOString();
      const createdDoc = await addSchedule({
        ...newSchedule,
        createdAt,
      });

      setSchedules((prev) => {
        if (prev.some((schedule) => schedule.id === createdDoc.id)) {
          return prev;
        }

        return [
          ...prev,
          {
            id: createdDoc.id,
            ...newSchedule,
            createdAt,
          },
        ];
      });
    } catch (error) {
      console.error("일정 추가 오류:", error);
      alert("일정 추가에 실패했습니다. Firebase 설정을 확인해주세요.");
      throw error;
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
    } catch (error) {
      console.error("일정 삭제 오류:", error);
      alert("일정 삭제에 실패했습니다.");
    }
  };

  const handleEventTypeColorChange = (eventType, nextColor) => {
    setEventTypeColors((prev) => ({
      ...prev,
      [eventType]: nextColor,
    }));
  };

  const handleGenerateWallpaper = async ({
    targetSchedules,
    referenceDate,
    imageUrl,
    requireThumbnail = false,
  }) => {
    if (requireThumbnail && !imageUrl) {
      alert("이미지를 먼저 선택해주세요.");
      return false;
    }

    setIsGeneratingWallpaper(true);

    try {
      const wallpaperUrl = await generateWallpaperImage({
        backgroundColor: selectedBgColor,
        eventTypeColors,
        thumbnailImageUrl: imageUrl ?? "",
        schedules: targetSchedules,
        referenceDate,
      });

      setGeneratedWallpaperUrl(wallpaperUrl);
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
    const referenceDate = workflow.workflowSchedules[0]?.date
      ? new Date(workflow.workflowSchedules[0].date)
      : new Date();

    const generated = await handleGenerateWallpaper({
      targetSchedules: workflow.workflowSchedules,
      referenceDate,
      imageUrl: thumbnailPreviewUrl,
      requireThumbnail: true,
    });

    if (generated) {
      setCurrentScreen(
        workflow.activeMonthKey ? SCREEN_KEYS.SAVED_RESULT : SCREEN_KEYS.RESULT,
      );
    }
  };

  const handleOpenSavedMonth = async (monthOption) => {
    workflow.setActiveMonthKey(monthOption.key);
    workflow.setActiveMonthLabel(monthOption.label);
    workflow.setGeneratingMonthLabel(monthOption.label);

    const cachedThumbnail = thumbnailCache[monthOption.key];
    const generated = await handleGenerateWallpaper({
      targetSchedules: monthOption.schedules,
      referenceDate: new Date(`${monthOption.key}-01`),
      imageUrl: cachedThumbnail?.previewUrl ?? "",
      requireThumbnail: false,
    });

    if (generated) {
      setCurrentScreen(SCREEN_KEYS.SAVED_RESULT);
    }

    workflow.setGeneratingMonthLabel("");
  };

  const handleStartNew = () => {
    workflow.setActiveMonthKey(null);
    workflow.setActiveMonthLabel("");
    workflow.setGeneratingMonthLabel("");
    workflow.setNewWorkflowStartedAt(new Date().toISOString());
    resetWorkflowVisuals();
    resetDefaultWorkflowThumbnail();
    setCurrentScreen(SCREEN_KEYS.ENTRY);
  };

  const handleDownloadWallpaper = () => {
    if (!generatedWallpaperUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = generatedWallpaperUrl;
    link.download = `schedule_wallpaper_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
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
              {shouldShowStepper(currentScreen) ? (
                <div className="mx-auto mb-5 flex w-full max-w-3xl items-center justify-between text-sm text-gray-500">
                  <span>Step {STEP_MAP[currentScreen]} / 3</span>
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

              <AppScreenContent
                currentScreen={currentScreen}
                screenKeys={SCREEN_KEYS}
                monthOptions={workflow.monthOptions}
                workflowSchedules={workflow.workflowSchedules}
                sortOption={sortOption}
                onSortOptionChange={setSortOption}
                onScreenChange={setCurrentScreen}
                onAddSchedule={handleAddSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onSelectMonth={handleOpenSavedMonth}
                onDeleteMonth={workflow.handleDeleteMonth}
                onStartNew={handleStartNew}
                isGenerating={isGeneratingWallpaper}
                generatingMonthLabel={workflow.generatingMonthLabel}
                deletingMonthKey={workflow.deletingMonthKey}
                selectedBgColor={selectedBgColor}
                onBgColorChange={setSelectedBgColor}
                eventTypeColors={eventTypeColors}
                onEventTypeColorChange={handleEventTypeColorChange}
                thumbnailFileName={thumbnailFileName}
                thumbnailDimensions={thumbnailDimensions}
                thumbnailPreviewUrl={thumbnailPreviewUrl}
                onThumbnailSelect={handleThumbnailSelect}
                onGenerateNext={handleSetupNext}
                onGoToMonthList={() => setCurrentScreen(SCREEN_KEYS.MONTH_LIST)}
                generatedWallpaperUrl={generatedWallpaperUrl}
                onDownload={handleDownloadWallpaper}
                activeMonthLabel={workflow.activeMonthLabel}
              />
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
