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

function WallpaperBuilder({
  wallpaperStep,
  selectedBgColor,
  onBgColorChange,
  onNextStep,
}) {
  return (
    <section className="rounded-2xl p-4 bg-gray-50 border border-gray-200 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
        아이폰 배경화면 만들기
      </h2>

      {wallpaperStep === 1 ? (
        <div>
          <p className="mb-3 text-sm sm:text-base text-gray-700">
            1단계: 배경색을 고르세요
          </p>
          <div className="flex flex-wrap gap-3">
            {BG_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onBgColorChange(color)}
                aria-label={`배경색 ${color}`}
                className={`w-10 h-10 rounded-full border-2 transition ${
                  selectedBgColor === color
                    ? "border-gray-900 scale-110"
                    : "border-white/40"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-700">선택됨:</span>
            <span
              className="px-3 py-1 rounded-full text-xs text-white"
              style={{ backgroundColor: selectedBgColor }}
            >
              {selectedBgColor}
            </span>
          </div>

          <button
            type="button"
            onClick={onNextStep}
            className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-purple-500 text-white text-sm font-semibold"
          >
            다음: 썸네일 이미지 선택하기
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-700">
          다음 단계(썸네일 이미지 선택)는 2단계에서 구현 예정입니다.
        </p>
      )}
    </section>
  );
}

export default WallpaperBuilder;
