import React from "react";
import WallpaperBuilder from "../WallpaperBuilder";

function WallpaperResultScreen({
  generatedWallpaperUrl,
  onPrev,
  onDownload,
  onRestart,
}) {
  return (
    <section className="min-w-full min-w-0 flex-none px-3">
      <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5">
        <WallpaperBuilder
          mode="result"
          generatedWallpaperUrl={generatedWallpaperUrl}
          onDownload={onDownload}
          onRestart={onRestart}
        />
        <div className="flex min-w-0 flex-col gap-3 pb-6 sm:flex-row sm:justify-start">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 sm:w-auto sm:text-base"
          >
            이전
          </button>
        </div>
      </div>
    </section>
  );
}

export default WallpaperResultScreen;
