const n=`---
title: 첫 TIL - 환경 세팅과 목표
description: Vite + React로 TIL 블로그를 만들고 GitHub Pages로 배포
date: 2025-10-27
tags: [til, react, vite, github-pages]
---

# 오늘 한 일

- Vite + React 프로젝트에 라우팅과 마크다운 렌더링 추가
- GitHub Pages 배포 설정 준비

## 메모

\`\`\`bash
npm run build
\`\`\`

배포는 아래 스크립트를 사용합니다.

## 실행 방법

\`\`\`bash
npm install
npm run dev
\`\`\`

브라우저에서 로컬 주소(터미널에 표시된 URL)로 접속합니다. 기본적으로 \`http://localhost:5173/\` 입니다.

## 빌드/미리보기

\`\`\`bash
npm run build
npm run preview
\`\`\`

미리보기 서버 주소(기본 \`http://localhost:4173/\`)로 접속해 프로덕션 번들을 확인합니다.

## 배포 (GitHub Pages)

사전 준비: GitHub 리포지토리 생성 후 로컬과 연결합니다.

\`\`\`bash
git init
git add .
git commit -m "init: til-blog"
git branch -M main
git remote add origin <YOUR_REPO_URL>
\`\`\`

배포:

\`\`\`bash
npm run deploy
\`\`\`

- \`package.json\`의 \`predeploy\`가 먼저 \`npm run build\`를 실행하고, \`deploy\`가 \`dist\`를 \`gh-pages\` 브랜치로 푸시합니다.
- GitHub 리포지토리 Settings → Pages에서 Source를 \`gh-pages\` / \`(root)\`로 설정합니다.
- 사이트 주소: \`https://<YOUR_USERNAME>.github.io/til-blog/\`
- 리포지토리명이 바뀐다면 \`vite.config.ts\`의 \`base\`도 해당 리포지토리명으로 수정해야 합니다.
`;export{n as default};
