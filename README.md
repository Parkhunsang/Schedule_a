# HAN BI SCHEDULE

월별 비행 스케줄을 입력하고, 커스텀 월페이퍼로 가공해 다운로드할 수 있는 React 기반 웹 애플리케이션입니다.  
반복적으로 확인해야 하는 비행 일정을 단순 표 형태로 끝내지 않고, 실제로 휴대폰 배경화면으로 바로 사용할 수 있는 결과물까지 연결하는 흐름에 초점을 맞췄습니다.

## Overview

이 프로젝트는 일정 관리와 시각적 결과물을 하나의 흐름으로 묶는 개인 맞춤형 일정 생성 도구입니다.

- 월별 비행 스케줄 입력 및 관리
- Firebase Firestore 기반 일정 저장
- 배경색, 이벤트 색상, 썸네일 이미지 커스터마이징
- 캔버스 기반 월페이퍼 생성 및 다운로드
- Excel 내보내기 지원
- 한국어 / 영어 전환 지원

## Why This Project

기존 일정 앱은 데이터를 저장하고 조회하는 데는 강하지만, 사용자가 매일 가장 자주 보는 화면인 휴대폰 배경화면까지 연결되지는 않는 경우가 많습니다.  
이 프로젝트는 일정 데이터를 단순 보관하는 수준을 넘어서, 사용자가 실제로 활용할 수 있는 비주얼 결과물로 변환하는 경험을 목표로 만들었습니다.

## Core Features

### 1. Monthly schedule workflow

- 월별 스케줄을 입력하고 저장할 수 있습니다.
- 등록된 일정은 정렬, 삭제, 재열람이 가능합니다.
- 저장된 월을 다시 열어 이전 결과를 이어서 확인할 수 있습니다.

### 2. Wallpaper customization

- 배경색 팔레트 선택
- 이벤트 타입별 색상 조정
- 사용자 이미지 업로드 및 미리보기
- 생성 전 설정값 확인

### 3. Canvas-based wallpaper generation

- 일정 데이터를 기반으로 캘린더형 월페이퍼를 생성합니다.
- 이미지와 일정 카드가 조합된 결과물을 PNG로 다운로드할 수 있습니다.

### 4. Data persistence

- Firebase Firestore를 이용해 일정 데이터를 저장하고 구독합니다.
- 배포 환경에서도 환경변수만 올바르게 설정하면 동일하게 동작합니다.

### 5. Export and accessibility

- 일정 데이터를 Excel 파일로 내보낼 수 있습니다.
- 한/영 언어 전환을 지원합니다.

## Tech Stack

- `React 19`
- `Vite`
- `Firebase / Firestore`
- `Zustand`
- `i18next`
- `Tailwind CSS`
- `xlsx`
- `HTML Canvas API`

## Architecture Highlights

이 프로젝트는 기능 중심 구조를 기준으로 분리되어 있습니다.

- `src/app`
  화면 전환, 전역 상태, i18n, 공통 로직
- `src/features/schedule`
  일정 입력, 목록, 저장/삭제, Excel 내보내기
- `src/features/wallpaper`
  월페이퍼 설정, 썸네일 처리, 캔버스 렌더링
- `src/services`
  외부 서비스 연동 로직

핵심 화면 흐름은 다음과 같습니다.

1. 저장된 월 선택 또는 새 일정 시작
2. 일정 입력 및 정렬
3. 배경/이벤트 색상/이미지 설정
4. 월페이퍼 생성
5. 결과 다운로드

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 설정합니다.

```env
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
```

### 3. Run the app

```bash
npm run dev
```

개발 서버 기본 포트는 `3000`입니다.

## Build

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

## Deployment

현재 프로젝트는 `Cloudflare Pages` 기준으로 배포할 수 있습니다.

- Build command: `npm run build`
- Output directory: `dist`

배포 환경에서도 아래 환경변수를 반드시 등록해야 합니다.

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Cloudflare Pages 경로:

`Settings > Variables and Secrets`

## What I Focused On

이 프로젝트에서 특히 신경 쓴 부분은 아래와 같습니다.

- 단순 CRUD가 아니라 "입력 -> 가공 -> 결과물 생성"까지 이어지는 사용자 흐름 설계
- 데이터 관리와 시각 생성 로직의 역할 분리
- 로컬 개발 환경과 배포 환경에서 동일하게 동작하도록 환경변수 구조 정리
- 실제 사용성을 고려한 결과물 중심 UI 구성

## Future Improvements

- README에 실제 화면 스크린샷 추가
- 생성 결과 예시 이미지 추가
- 일정 수정 기능 고도화
- 생성 템플릿 다양화
- 모바일 사용성 추가 개선

## License

ISC
