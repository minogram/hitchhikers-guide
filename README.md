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

## 주의사항

- `dev.db` (SQLite DB 파일)는 `.gitignore`에 포함되어 git에 올라가지 않습니다.
- 새 컴퓨터에서 작업할 때마다 4~5번 단계를 반복해야 합니다.
- 업로드한 이미지(`public/uploads/`)도 git에 포함되지 않으므로 필요하면 직접 복사해야 합니다.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
