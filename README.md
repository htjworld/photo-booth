<div align="center">
  <h1>Photo Booth</h1>
  <a href="https://htjworld.github.io/photo-booth/">🔗 서비스 바로가기</a>
</div>

<br />

> 브라우저에서 바로 쓰는 미니멀 포토부스 — 촬영부터 커스터마이징, 저장까지

## Background

기존 포토부스 웹앱은 기능이 과하고 UI가 복잡해, 필요한 기능만 골라 쓰기가 번거롭습니다.
설치나 회원가입 없이 브라우저에서 바로 사용할 수 있는, 필요한 것만 담은 포토부스 앱을 만들고 싶었습니다.
서버리스로 동작하기 때문에 촬영한 사진은 서버에 저장되지 않으며, 기기에 다운로드할 때만 로컬로 저장됩니다.

## Features

- 레이아웃 선택 — 필름 스트립, 격자, 와이드 등 12가지 구성
- 타이머 — 3 / 5 / 10초 선택
- 프레임 커스터마이징 — Spectrum 그라디언트 또는 단색, 10가지 컬러 팔레트
- 필터 — 원본 / 흑백
- 미러 모드 — 전체 사진 좌우 반전
- 날짜 워터마크 — 촬영일 자동 삽입
- 순서 재배열 — 촬영 후 드래그 앤 드롭으로 사진 순서 변경
- 개별 재촬영 — 마음에 안 드는 컷만 골라서 다시 찍기
- PNG 다운로드 — 고화질 이미지로 저장

## Language

영어(English), 한국어를 지원합니다.

## Preview

| <촬영 화면> | <결과 편집 화면> |
|-----------|-----------|
| ![shooting](./assets/shooting.png) | ![result](./assets/result.png) |

## Tech Stack

**Frontend**

[![Skills](https://skillicons.dev/icons?i=react,vite,tailwind)](https://skillicons.dev)

## Getting Started

**Requirements**
- Node.js 20+

**macOS / Linux / Windows**
```bash
git clone https://github.com/htjworld/photo-booth.git
cd photo-booth
npm install
npm run dev
```

## License

MIT © htjworld
