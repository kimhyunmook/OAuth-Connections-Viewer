# OAuth Connections Viewer

OAuth Connections Viewer는 Google, Naver, Kakao 다양한 플랫폼의 OAuth 연결 내역(이름, 이미지)을 한 눈에 확일할 수 있는 크롬 확장 프로그램입니다. 내가 어떤 OAuth로 일일이 찾아 볼 필요 없이 한 눈에 볼수 있도록 제작하였습니다. 개인정보나 아이디를 수집 하고 있지 않고 개인 저장소에 저장해서 사용이 가능합니다. 
#### 아직 google extendtion 에 배포 되진 않았습니다. 직접 설치 후 개발자 환경에서 사용해주세요 

## 업데이트 예정
- 검색 기능.
- OAuth 목록 새로고침.
    - 현재는 저장소를 삭제 후 다시 재로드를 해줘야합니다.
- 현재 페이지에 어떤 OAuth로 가입 되어 있는지 확인.

<div style="display:flex;align-items:center;justify-content:center"> 
    <a href="https://github.com/kimhyunmook/OAuth-Connections-Viewer/releases">
        <img src="https://img.shields.io/badge/download-blue">
    </a>
</div>

## 주요 기능

- **Google, Naver, Kakao** 계정의 연결된 외부 서비스 목록을 한 번에 확인
- 다크모드 지원 및 테마 토글
- 스토리지 데이터 삭제 버튼 제공
- 로딩 UI 및 로그인 감지 안내

---

## 설치 방법

1.  <a href="https://github.com/kimhyunmook/OAuth-Connections-Viewer/releases"><img src="https://img.shields.io/badge/download-blue"></a> ZIP 파일을 다운로드합니다.
2.  크롬 브라우저에서 <a href="https://chrome://extensions">`chrome://extensions`</a>로 이동합니다.
3.  우측 상단의 **개발자 모드**를 활성화합니다.
4.  "압축해제된 확장 프로그램을 로드" 버튼을 클릭하고, 프로젝트 폴더를 선택합니다.
5.  확장 프로그램이 추가되면, 브라우저 우측 상단에서 아이콘을 클릭해 실행할 수 있습니다.

---

## 사용법

1. 확장 프로그램 아이콘을 클릭하면 팝업이 열립니다.
2. 원하는 플랫폼(Google, Naver, Kakao) 버튼을 클릭하면 연결된 서비스 목록을 확인할 수 있습니다.
3. "스토리지 데이터 삭제" 버튼을 클릭하면 저장된 연결 정보가 모두 삭제됩니다.
4. 다크모드/라이트모드는 우측 상단의 🌙/☀️ 버튼으로 전환할 수 있습니다.
5. 연결 정보가 없거나, 로그인이 필요한 경우 안내 메시지 또는 알림이 표시됩니다.

---

## 개인정보처리방침 안내

- **<a href="https://kimhyunmook.github.io/oauth-policy/">개인정보 처리 방침 보러가기</a>**

---

## 개발 및 기여

- 이 프로젝트는 TypeScript, Webpack, Chrome Extension Manifest V3를 기반으로 개발되었습니다.
- 코드 수정 후 `npm install` → `npm run build`로 번들링하세요.
- PR 및 이슈 환영합니다!

### 주요 폴더 구조

```
myOauth/
├── src/
│   ├── assets/         # 아이콘 및 이미지
│   ├── config/         # 플랫폼별 설정
│   ├── helpers/        # 주요 로직 및 유틸
│   ├── styles/         # CSS 파일
│   ├── popup.html      # 팝업 UI
│   └── popup.ts        # 팝업 스크립트
├── manifest.json       # 크롬 확장 프로그램 설정
├── README.md           # 설명 파일
└── ...
```

---

## 스크린샷

### 기본

<img width="430" height="439" alt="Image" src="https://github.com/user-attachments/assets/d9c74e1c-bec3-415e-bf64-cce66de97a5f" />

### OAuth 목록 불러오기

<img width="442" height="617" alt="Image" src="https://github.com/user-attachments/assets/4ea510b6-f4e3-43fb-ba3d-a5afd1c83edb" />

### 로그인이 필요 alert

<img width="460" height="433" alt="Image" src="https://github.com/user-attachments/assets/4fb23a0d-4d95-482e-bb3a-2b76acfeefc9" />

### 스토리지(저장소) 데이터 삭제

<img width="462" height="430" alt="Image" src="https://github.com/user-attachments/assets/7ab982e1-1f98-4288-9387-7e5260ba1642" />

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

## 문의
- gusanr4200@naver.com 으로 문의 주세요.
