<p align="center">
  <img src="docs/banner.png" alt="TabNova 배너" width="100%" />
</p>

<h1 align="center">TabNova</h1>

<p align="center">
  빠른 전환, 검색, 드래그 정렬에 초점을 둔 Chrome 세로형 탭 매니저입니다.
</p>

<p align="center">
  <a href="#설치"><img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827"></a>
  <a href="#설치"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white"></a>
  <a href="#설치"><img alt="Chrome Extension" src="https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white"></a>
</p>

<p align="center">
  <code>npm install && npm run build</code>
</p>

TabNova는 기본 가로 탭 바 대신 Chrome 사이드패널 안에서 탭을 검색, 정렬, 전환, 닫기까지 처리할 수 있도록 만든 확장입니다.

## 한눈에 보기

- 현재 창의 탭 상태를 실시간으로 반영하는 세로형 탭 목록
- 드래그 앤 드롭 재정렬, 빠른 닫기, 즉시 전환 지원
- 검색, 북마크, 방문 기록, 설정을 한 사이드패널 흐름에 통합

## 왜 TabNova인가

- 브라우징 세션이 길어질수록 기본 가로 탭 바는 한계가 분명해집니다
- 사이드패널은 탭 상태를 더 읽기 쉽게 만들고 조작 비용을 줄여줍니다
- 검색과 단축키를 보조 기능이 아니라 탐색 흐름의 일부로 다룹니다

## 핵심 기능

- 세로형 사이드패널 탭 뷰
- 실시간 탭 필터링
- 드래그 앤 드롭 재정렬
- 원클릭 전환과 hover 기반 빠른 닫기
- 북마크 / 방문 기록 뷰
- 테마, 강조색, 언어 설정
- `Alt+B` / `Option+B` 단축키 지원

## 설치

### 요구사항

- Node.js 18+
- 개발자 모드를 사용할 수 있는 Chrome

### 빌드

```bash
npm install
npm run build
```

`chrome://extensions`에서 **압축해제된 확장 프로그램 로드**로 `dist/` 폴더를 선택하면 됩니다.

## 사용법

- 툴바 아이콘 또는 `Alt+B`로 사이드패널을 엽니다
- 제목이나 URL로 탭을 필터링합니다
- 드래그로 탭 순서를 바꿉니다
- 검색창에서 새 웹 검색을 바로 엽니다
- 탭, 북마크, 방문 기록을 패널 안에서 오갑니다

## 개발

```bash
npm run dev
npm run type-check
npm run build
```

## 기여

PR 전에는 다음을 확인해 주세요.

```bash
npm run type-check
npm run build
```

이슈에는 아래 정보를 포함해 주세요.

- Chrome 버전과 OS
- 재현 단계
- 기대 동작과 실제 동작
- 탭 / 북마크 / 방문 기록 / 설정 중 어느 영역에서 발생했는지

권장 커밋 프리픽스: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## 라이선스

ISC
