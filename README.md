# Hitchhiker's Guide to Fashion AI

패션 AI 도구 카탈로그 & 커뮤니티 플랫폼

## 개발 환경 세팅 (처음 또는 새 컴퓨터에서 시작할 때)

### 1. 코드 받기

```bash
git clone https://github.com/minogram/hitchhikers-guide.git
cd hitchhikers-guide
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 루트에 생성하고 아래 내용을 채워넣으세요:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=file:./dev.db
```

> `NEXTAUTH_SECRET`은 아무 랜덤 문자열이나 넣으면 됩니다. 예: `openssl rand -base64 32`

### 4. DB 생성 및 스키마 적용

```bash
npx prisma migrate dev
```

### 5. 초기 데이터 입력 (앱 10개 + 계정 + 게시글)

```bash
npx prisma db seed
```

seed 후 생성되는 계정:

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| Admin | admin@falab.kr | pass.admin |
| Manager | manager1@falab.kr | pass.manager1 |
| User | user1@falab.kr | pass.user1 |

### 6. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인

---

## 앱 썸네일 이미지 등록 방법 (Google Drive)

앱이 200개 규모로 늘어날 경우, 이미지를 `public/uploads/`에 파일로 저장하면 git 저장소가 무거워집니다.  
썸네일은 **Google Drive에 업로드하고 URL만 DB에 저장**하는 방식을 권장합니다.

### 절차

**1단계 — 이미지를 Google Drive에 업로드**

1. [drive.google.com](https://drive.google.com) 접속
2. 썸네일 이미지 파일(JPG/PNG)을 드래그하여 업로드
3. 관리 편의를 위해 폴더를 만들어 정리 (예: `hitchhikers-guide/thumbnails/`)

**2단계 — 공유 설정 변경**

1. 업로드한 파일 우클릭 → **공유**
2. "링크가 있는 모든 사용자"로 변경 → **뷰어** 권한 선택
3. **링크 복사** 클릭

복사된 링크 형식:
```
https://drive.google.com/file/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/view?usp=sharing
```

**3단계 — 썸네일 URL 변환**

위 링크에서 `FILE_ID` 부분만 추출하여 아래 형식으로 변환합니다:

```
https://drive.google.com/thumbnail?id=FILE_ID&sz=w400
```

예시:
```
# 원본 공유 링크
https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz12345/view

# 썸네일 URL (이것을 앱 등록 시 사용)
https://drive.google.com/thumbnail?id=1AbCdEfGhIjKlMnOpQrStUvWxYz12345&sz=w400
```

**4단계 — 앱 등록 시 썸네일 URL 입력**

관리자 페이지에서 앱을 등록하거나 수정할 때, **썸네일 URL** 필드에 위에서 만든 URL을 붙여넣습니다.  
직접 파일을 업로드하는 대신 URL로 입력하면 됩니다.

> **주의**: Google Drive 공유 링크는 "링크가 있는 모든 사용자" 설정이 되어 있어야 이미지가 정상 표시됩니다.  
> 조직 내부 공유(falab.kr 계정 전용)로 설정하면 외부에서 이미지가 깨집니다.

---

## 주의사항

- `dev.db` (SQLite DB 파일)는 `.gitignore`에 포함되어 git에 올라가지 않습니다.
- 새 컴퓨터에서 작업할 때마다 4~5번 단계를 반복해야 합니다.
- 이미지는 Google Drive URL 방식을 사용하면 git에 저장할 필요가 없습니다.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
