import React from "react";

const BG_PALETTE = [
  "#0f172a",
  "#1d4ed8",
  "#4f46e5",
  "#9333ea",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#f43f5e",
  "#0f766e",
  "#22c55e",
  "#eab308",
  "#111827",
];

function SetupPanel({
  selectedBgColor,
  onBgColorChange,
  thumbnailPreviewUrl,
  onThumbnailSelect,
}) {
  const handleCustomColorChange = (e) => {
    onBgColorChange(e.target.value);
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    onThumbnailSelect(file);
  };

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-5">
      <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
        <p className="mb-3 text-sm font-medium text-gray-700 sm:text-base">
          Step 1. 배경 색상을 선택하세요.
        </p>
        <div className="grid grid-cols-4 gap-3 xs:grid-cols-5 sm:flex sm:flex-wrap">
          {BG_PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onBgColorChange(color)}
              aria-label={`background color ${color}`}
              className={`h-10 w-10 rounded-full border-2 transition ${
                selectedBgColor === color
                  ? "scale-105 border-gray-900"
                  : "border-white/40"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <label
            htmlFor="custom-bg-color"
            className="text-sm text-gray-700 sm:min-w-[120px]"
          >
            직접 선택
          </label>
          <input
            id="custom-bg-color"
            type="color"
            value={selectedBgColor}
            onChange={handleCustomColorChange}
            className="h-10 w-14 cursor-pointer rounded-md border border-gray-300 bg-white p-1"
            aria-label="Choose custom color"
          />
        </div>

        <div className="mt-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-sm text-gray-700">선택한 색상</span>
          <span
            className="inline-flex w-fit max-w-full break-all rounded-full px-3 py-1 text-xs text-white"
            style={{ backgroundColor: selectedBgColor }}
          >
            {selectedBgColor}
          </span>
        </div>
      </div>

      <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
        <p className="mb-3 text-sm font-medium text-gray-700 sm:text-base">
          Step 2. 이미지를 선택하세요.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailFileChange}
          className="block w-full min-w-0 text-sm file:mb-3 file:mr-0 file:block file:w-full file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-200 sm:file:mb-0 sm:file:mr-4 sm:file:inline-block sm:file:w-auto"
        />
        <p className="mt-2 break-words text-xs leading-5 text-gray-500">
          갤러리에서 사진을 선택하세요. 정사각형 또는 세로 비율 이미지를
          권장합니다.
        </p>
        {thumbnailPreviewUrl && (
          <div className="mt-4 min-w-0">
            <p className="mb-2 text-sm text-gray-700">미리보기</p>
            <img
              src={thumbnailPreviewUrl}
              alt="thumbnail preview"
              className="aspect-square w-full max-w-[220px] rounded-lg border border-gray-200 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ResultPanel({ generatedWallpaperUrl, onDownload, onRestart }) {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-5">
      <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
        <p className="mb-3 text-sm font-medium text-gray-700 sm:text-base">
          Step 3. 결과
        </p>

        {generatedWallpaperUrl ? (
          <div className="min-w-0 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#eef8ff_0%,#d7edf9_100%)] p-3 sm:p-4">
            <div className="mx-auto w-full min-w-0 max-w-[340px] rounded-[1.8rem] bg-slate-950 p-2 shadow-[0_22px_60px_rgba(15,23,42,0.28)] sm:max-w-[380px] sm:rounded-[2.2rem]">
              <div className="mx-auto mb-2 h-6 w-24 rounded-full bg-slate-900" />
              <img
                src={generatedWallpaperUrl}
                alt="generated wallpaper"
                className="block w-full rounded-[1.4rem] border border-white/30"
              />
            </div>

            <div className="mt-4 rounded-[1.2rem] bg-white/65 p-4 backdrop-blur">
              <p className="font-semibold text-slate-800">Preview</p>
              <p className="mt-1 break-words text-sm leading-6 text-slate-600">
                큰 사진 헤더와 일정 카드가 들어간 월페이퍼 결과를 여기서 확인할
                수 있습니다.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
            결과가 아직 없습니다. 화면 2에서 이미지를 선택하고 다음을 눌러주세요.
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onDownload}
          disabled={!generatedWallpaperUrl}
          className="inline-flex w-full items-center justify-center rounded-full bg-purple-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
        >
          이미지 다운로드
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 sm:w-auto"
        >
          다시 만들기
        </button>
      </div>
    </div>
  );
}

function WallpaperBuilder({ mode, ...props }) {
  return (
    <section className="w-full min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm sm:p-4">
      <h2 className="mb-4 break-words text-xl font-bold text-gray-900 sm:text-2xl">
        iPhone Wallpaper Builder
      </h2>
      {mode === "setup" ? <SetupPanel {...props} /> : <ResultPanel {...props} />}
    </section>
  );
}

export default WallpaperBuilder;
