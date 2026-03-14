import React from "react";
import WallpaperBuilder from "../WallpaperBuilder";

function WallpaperSetupScreen({
  selectedBgColor,
  onBgColorChange,
  thumbnailPreviewUrl,
  onThumbnailSelect,
  isGenerating,
  onPrev,
  onNext,
}) {
  return (
    <section className="min-w-full min-w-0 flex-none px-3">
      <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5">
        <WallpaperBuilder
          mode="setup"
          selectedBgColor={selectedBgColor}
          onBgColorChange={onBgColorChange}
          thumbnailPreviewUrl={thumbnailPreviewUrl}
          onThumbnailSelect={onThumbnailSelect}
        />
        <div className="flex min-w-0 flex-col gap-3 pb-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 sm:w-auto sm:text-base"
          >
            이전
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!thumbnailPreviewUrl || isGenerating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto sm:text-base"
          >
            <span>{isGenerating ? "생성 중..." : "다음"}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default WallpaperSetupScreen;
