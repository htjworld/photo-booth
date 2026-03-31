<div align="center">
  <h1>photo-booth</h1>
  <a href="https://htjworld.github.io/photo-booth/">🔗 서비스 바로가기</a>
</div>

<br />

> 웹캠으로 찍은 사진과 손편지를 한 장의 포토카드로 저장하는 서버리스 앱

## Background

이벤트나 특별한 날, 사진만 건네는 것보다 마음을 담은 무언가를 함께 주고 싶을 때가 있습니다.
그렇다고 별도 앱을 설치하거나 인쇄소를 거치기엔 번거롭습니다.

브라우저에서 바로 사진을 찍고, 짧은 편지를 써서, 하나의 포토카드로 완성할 수 있도록 만들었습니다.
서버리스로 동작하기 때문에 촬영한 사진과 편지 내용은 서버에 저장되지 않습니다.

## Features

- 편지 + 포토카드 일체형 — 편지지 위에 포토스트립이 올려진 형태로 한 장에 완성
- 1~4장 촬영 — 장수 선택 후 타이머(3 / 5 / 10초) 자동 촬영
- 개별 재촬영 — 마음에 안 드는 컷만 골라서 다시 찍기
- 순서 재배열 — 촬영 후 드래그 앤 드롭으로 사진 순서 변경
- 컬러 / 흑백 필터
- 고화질 PNG 저장 — 사진 원본 해상도를 유지해 저장
- 한국어 / English 지원

## Preview

| &lt;편지 작성 화면&gt; | &lt;촬영 화면&gt; | &lt;포토카드 결과 화면&gt; |
|-----------|-----------|-----------|
| ![letter](./assets/letter.png) | ![shooting](./assets/shooting.png) | ![result](./assets/result.png) |

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
