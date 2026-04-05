import React from "react";

function MonthlyScheduleListScreen({
  monthOptions,
  isGenerating,
  generatingLabel,
  onSelectMonth,
  onStartNew,
}) {
  return (
    <section className="min-w-full flex-none">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              저장된 월별 스케줄
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
              원하는 월을 선택하면 저장된 일정으로 만든 이미지 목업을 바로
              확인할 수 있습니다.
            </p>
          </div>

          {monthOptions.length > 0 ? (
            <div className="space-y-3">
              {monthOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => onSelectMonth(option)}
                  disabled={isGenerating}
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left transition hover:border-[#1565C0] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div>
                    <p className="text-base font-semibold text-gray-900 sm:text-lg">
                      {option.label}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      총 {option.schedules.length}개의 일정
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#1565C0]">
                    {isGenerating && generatingLabel === option.label
                      ? "생성 중..."
                      : "열기"}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              아직 저장된 월별 스케줄이 없습니다.
            </div>
          )}
        </section>

        <div className="flex justify-end pb-6">
          <button
            type="button"
            onClick={onStartNew}
            className="inline-flex items-center justify-center rounded-full bg-[#1E6DEB] px-5 py-3 text-sm font-semibold text-white sm:text-base"
          >
            새 일정 입력
          </button>
        </div>
      </div>
    </section>
  );
}

export default MonthlyScheduleListScreen;
