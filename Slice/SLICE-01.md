# SLICE : 인증 기반 (로그인 / 로그아웃 / 세션 / 라우트 보호)

## 작업 목표
시드로 생성된 관리자 계정으로 로그인·로그아웃할 수 있고, 세션이 활동에 따라 슬라이딩 연장되며, 비로그인 사용자는 보호된 화면에 접근할 수 없는 인증의 "뼈대(walking skeleton)"를 완성한다. 이후 모든 슬라이스(회원가입, 프로젝트, 할일 등)는 이 인증 계층 위에서 동작하므로, 가장 먼저 전 계층(DB→Repository→Service→라우트 보호→UI)을 관통해 검증해두는 것이 목적이다.

- 근거 문서: `PLAN.md` 4장 S1, `SPEC.md` 4.2/4.3장, 9장(보안). (SPEC 7장은 할일/댓글 등 다른 도메인의 권한 매트릭스로 이 슬라이스의 구현 범위와 직접 관련이 없어 근거에서 제외함)

## 전제 조건
- `PLAN.md`상 이 슬라이스는 **선행 슬라이스 없음**(첫 번째 슬라이스). 다만 아래 인프라가 이미 준비되어 있어야 한다.
- 이미 존재함(확인됨): Next.js 16 / React 19 App Router 스캐폴딩, Prisma 7(`prisma-client` generator, SQLite, `app/generated/prisma` 출력 경로), `DATABASE_URL`이 설정된 `.env`, `repositories/`·`services/` 빈 폴더(`.gitkeep`만 존재), shadcn/ui `Button` 컴포넌트, `app/globals.css`의 라이트/다크 CSS 변수 토큰.
- 이 슬라이스에서 새로 추가해야 하는 것(데이터/설정): `User`/`Session` 테이블(현재 `prisma/schema.prisma`에는 모델이 하나도 정의되어 있지 않음), 최초 관리자 계정을 만드는 시드 실행 경로, `ADMIN_USERNAME`/`ADMIN_PASSWORD` 환경변수.
- 이 슬라이스에서 새로 추가해야 하는 것(폴더/인프라): `lib/`, `app/login/`, `app/actions/` 폴더와 루트 `proxy.ts`는 프로젝트에 아직 전혀 존재하지 않으며, 이번 슬라이스가 처음 만든다.
- **선행 결함(착수 전 확인 필요)**: 현재 `components/ui/button.tsx`가 import하는 `class-variance-authority`가 `package.json`·`node_modules` 어디에도 설치되어 있지 않아, 이 슬라이스 착수 전인 지금도 `npx tsc --noEmit`이 이미 실패한다(실측 확인됨). 이 슬라이스의 "완료 기준"이 성립하려면 이 의존성 보수가 선행(또는 이 슬라이스 안에 포함)되어야 한다.
- **참고(구현 시 유의)**: `prisma/schema.prisma`는 신형 `provider = "prisma-client"` generator를 사용하므로, 생성된 Prisma Client는 표준 `@prisma/client` 경로가 아니라 `app/generated/prisma` 하위 경로에서 가져와야 한다.

## 구현 범위
- **데이터 모델**
  - `User`: id, username(unique), passwordHash, displayName, role(admin/member), status(pending/active/disabled), mustChangePassword(boolean), createdAt. (이 슬라이스에서는 시드로 생성되는 admin 계정만 사용하므로 status는 항상 active로 취급되지만, 이후 슬라이스(S2)에서 pending/disabled 상태가 실제로 쓰일 수 있도록 필드 자체는 지금 정의한다.)
  - `Session`: 사용자별 서버 저장 세션 레코드(수신자 userId, 검증용 토큰의 해시값, 만료 시각, 생성 시각). 원문 토큰은 저장하지 않고 해시만 저장한다.
- **최초 관리자 시드**: `ADMIN_USERNAME`/`ADMIN_PASSWORD` 환경변수를 읽어 관리자 계정 1개를 생성하는 시드 실행 경로(SPEC 4.2). 이미 관리자가 존재하면 재실행해도 중복 생성되지 않아야 한다.
- **로그인**: 아이디/비밀번호 입력 폼 → 자격 증명 검증 → 세션 생성(DB 레코드 + HttpOnly 쿠키 발급) → 보호된 화면으로 이동. 자격 증명이 틀리면 화면에 오류 메시지 표시.
- **세션 만료/슬라이딩 연장**: 세션 기본 유지 시간 24시간, 인증된 요청이 있을 때마다 만료 시각을 24시간 뒤로 연장(SPEC 4.3).
- **로그아웃**: 현재 세션을 즉시 무효화(DB 레코드 삭제 또는 만료 처리 + 쿠키 삭제)하고 로그인 화면으로 이동.
- **라우트 보호(이중 구조, PLAN 공유 기술 결정 #4)**:
  - Proxy(`proxy.ts`, Next.js 16 컨벤션)에서 쿠키 존재 여부만으로 낙관적 리다이렉트: 비로그인 상태로 보호된 경로 접근 시 `/login`으로 이동.
  - 서버 전용 세션 검증 함수(권위 있는 검증)를 두어, 보호된 Server Component/Server Action이 실제로 이 함수를 통해 세션 유효성을 재확인하도록 한다. 이 함수는 이후 모든 슬라이스의 인가 체크가 재사용하는 공통 지점이 된다.
  - **검증 실패 시 동작**: Proxy는 쿠키 존재 여부만 확인하므로 만료·무효화된 세션은 걸러내지 못한다. 위 서버 전용 검증 함수가 세션을 만료/무효로 판정하면, 보호된 Server Component/Server Action은 반드시 `/login`으로 리다이렉트해야 한다 — 실질적인 권위 있는 차단 지점은 Proxy가 아니라 이 함수다.
- **최소한의 보호된 화면**: 현재 `app/page.tsx`(Next.js 기본 템플릿)를 로그인한 사용자만 접근 가능한 최소 placeholder 화면으로 교체(로그인 사용자 이름 표시 + 로그아웃 버튼만 포함). 이 화면은 이후 S6에서 실제 할일 목록 화면으로 대체될 자리다.
- **로그인 화면**: `/login` 경로에 로그인 폼 페이지. 이미 로그인된 상태에서 `/login`에 접근하는 경우의 동작은 이 슬라이스 범위 밖(리다이렉트 처리는 선택 사항, 필수 아님).

## 구현 제외 범위
- 회원가입 화면, 가입 승인 대기 플로우 (S2에서 구현)
- 본인 비밀번호 변경, 관리자의 임시 비밀번호 강제 초기화, `mustChangePassword` 강제 이동 (S3에서 구현)
- 회원 비활성화/재활성화, 회원 목록 화면 (S12에서 구현)
- 로그인 실패 횟수 제한(계정 잠금), "로그인 상태 유지(remember me)" 등 SPEC에 없는 부가 기능
- 다크모드, 모바일 반응형 레이아웃 등 UI 마감 품질(S13에서 전역적으로 다룸) — 최소 기능 동작만 확인되면 충분
- 프로젝트/할일/댓글/알림 등 다른 도메인 기능 전부 (이후 슬라이스)
- 이 시점에는 관리자 계정만 로그인 대상이며, 일반 회원 로그인은 회원가입 경로(S2)가 생긴 뒤에 의미를 가진다.

## 변경 파일 범위

| 파일 | 역할 |
|---|---|
| `prisma/schema.prisma` | `User`, `Session` 모델 추가 (기존 generator/datasource 설정은 유지) |
| `prisma/migrations/**` (자동 생성) | `prisma migrate dev` 실행 시 생성되는 마이그레이션 히스토리 |
| `prisma/seed.ts` (신규) | `ADMIN_USERNAME`/`ADMIN_PASSWORD` 기반 최초 관리자 계정 시드 (재실행 안전) |
| `.env` | `ADMIN_USERNAME`, `ADMIN_PASSWORD` 값 추가 (로컬 개발용) |
| `.env.example` (신규) | 필요한 환경변수 목록 문서화 (`DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`) |
| `prisma7.config.ts` | `migrations.seed`에 시드 실행 명령 등록 (Prisma 7 공식 seed 연동 지점 — `@prisma/config`의 `MigrationsConfigShape.seed` 필드로 실측 확인됨) |
| `package.json` | ① 비밀번호 해싱 라이브러리, 시드 실행 스크립트 등 신규 의존성 추가 ② 스키마 검증 라이브러리(zod)를 직접 의존성으로 명시(현재 `node_modules`에 다른 패키지의 부수효과로 우연히 존재할 뿐 미선언 상태) ③ 기존 결손 의존성 보수 — `components/ui/button.tsx`가 사용 중인 `class-variance-authority`가 미설치 상태(실측: `tsc` 즉시 실패)이므로 추가, 필요 시 `lucide-react`(`components.json`의 `iconLibrary: lucide` 대응)도 추가 |
| `lib/prisma.ts` (신규) | Prisma Client 싱글턴 (개발 모드 hot-reload 시 커넥션 중복 생성 방지) |
| `repositories/user.repository.ts` (신규) | User 테이블 접근(아이디로 조회, 생성 등) 캡슐화 |
| `repositories/session.repository.ts` (신규) | Session 테이블 접근(생성/조회/연장/삭제) 캡슐화 |
| `services/auth.service.ts` (신규) | 로그인/로그아웃 비즈니스 로직, 세션 검증(권위 있는 인증 확인 지점), 슬라이딩 연장 로직 |
| `app/actions/auth.actions.ts` (신규) | 로그인/로그아웃 Server Action (Service 계층을 호출하는 얇은 진입점) |
| `proxy.ts` (신규, 프로젝트 루트) | Next.js 16 Proxy 컨벤션: 비로그인 사용자의 보호 경로 접근 시 `/login`으로 낙관적 리다이렉트 |
| `app/login/page.tsx` (신규) | 로그인 페이지 |
| `app/login/login-form.tsx` (신규) | 로그인 폼 클라이언트 컴포넌트 (입력값 상태 + 서버 액션 호출 + 오류 표시) |
| `app/page.tsx` | 기존 Next.js 기본 템플릿 내용을 제거하고, 로그인한 사용자만 보이는 최소 placeholder 화면(사용자 이름 + 로그아웃 버튼)으로 교체 |
| `components/ui/*` (신규, shadcn 추가) | 로그인 폼 구성에 필요한 컴포넌트(Input, Label, Card 등) 추가 |
| `lib/utils.ts` (조건부 신규) | shadcn CLI로 컴포넌트를 추가할 때 CLI 버전에 따라 자동 생성될 수 있음. 기존 `components/ui/button.tsx`는 `cn`을 `"cn"` npm 패키지에서 직접 import하고 있어, 새로 생성되는 컴포넌트가 `@/lib/utils`의 `cn`을 쓰게 될 경우 두 방식이 혼재되지 않도록 일관성 확인 필요 |

## 기술적 선택
- **기존 의존성 정합성 보수(선행 필요)**: `class-variance-authority`(기존 `components/ui/button.tsx`가 사용하나 미설치 — 실측 확인)와 `components.json`의 `iconLibrary: lucide` 설정에 대응하는 `lucide-react`를 `package.json`에 명시적으로 추가한다. 입력 검증에 사용할 `zod`도 현재 `node_modules`에 다른 패키지의 부수효과로 우연히 존재할 뿐이므로 직접 의존성으로 명시한다.
- **비밀번호 해싱**: 순수 JS 구현 해싱 라이브러리 사용(네이티브 바이너리 컴파일 의존이 없는 것). Windows 개발 환경에서 빌드 이슈를 피하기 위함(PLAN 공유 기술 결정 #1).
- **세션 토큰**: Node.js 내장 `crypto` 모듈로 무작위 불투명 토큰을 생성하고, 쿠키에는 원문 토큰만 저장, DB에는 그 해시값만 저장(원문 유출 시에도 DB 조회로 세션을 위조할 수 없도록). 별도의 세션 서명 라이브러리(JWT 등)는 사용하지 않는다 — DB가 이미 세션 유효성의 단일 진실 공급원(source of truth)이므로 stateless 서명 방식은 불필요(PLAN 공유 기술 결정 #2).
- **쿠키 옵션**: HttpOnly, SameSite=Lax, Path=/. `Secure` 속성은 프로덕션(HTTPS) 환경에서만 강제하고 로컬 개발(HTTP) 환경에서는 예외 처리한다.
- **라우트 보호 컨벤션**: Next.js 16의 `proxy.ts`(구 `middleware.ts`, deprecated) 사용. `matcher`로 정적 자산과 `/login`을 제외한 전 경로에 적용.
- **데이터 변경 방식**: React Server Actions(`'use server'`) + `useActionState`로 로그인 폼 제출과 오류 상태 처리(PLAN 공유 기술 결정 #5).
- **아키텍처 계층**: Repository(Prisma 접근) → Service(로그인/로그아웃/세션검증 로직, 권위 있는 인증 확인 지점) → Server Action/Server Component(얇은 진입점) → UI. 이후 모든 슬라이스가 이 인증 Service의 "현재 로그인 사용자 조회" 함수를 재사용한다(PLAN 공유 기술 결정 #6).
- **입력 검증**: 로그인 폼 입력(빈 값 등)을 서버 측에서 스키마 검증 라이브러리로 최종 검증(PLAN 공유 기술 결정 #9).
- **UI 컴포넌트**: 기존 shadcn/ui(`new-york`) 스타일 유지, 로그인 폼에 필요한 컴포넌트만 최소로 추가.

## 디자인 참조

참조 파일: `Slice/DESIGN.md`(디자인 시스템 명세), `Slice/code.html`(동작하는 HTML/Tailwind 목업), `Slice/screen.png`(렌더링 스크린샷).

> **주의**: 첨부된 세 파일은 모두 **회원가입("계정 만들기") 화면**을 담고 있으며, 로그인 화면 목업이 아니다(하단 "로그인" 링크도 `href="#login"`으로 실제 연결되지 않은 placeholder). 따라서 이 슬라이스에서는 화면 구성을 그대로 가져오지 않고, **디자인 시스템(색상/타이포그래피/컴포넌트 스타일)만 재사용**하여 로그인 화면(아이디/비밀번호/로그인 버튼)을 새로 구성한다. 실제 화면 목업/스크린샷은 이후 SLICE-02(회원가입)에서 그대로 활용한다.

### 재사용할 디자인 토큰
- **컬러**: `DESIGN.md`의 YAML 프런트매터와 `code.html`의 Tailwind 설정이 실제 구현 기준(Material 3 스타일 네이밍)이다. 본문의 "Colors" 서술(`#3D5AFE` 등)은 프런트매터/코드와 값이 다르므로 **`code.html`에 실제로 쓰인 토큰을 우선**한다.
  - `primary: #183ce6` (기본 버튼/포커스 보더), `primary-container: #3d5afe` (버튼 hover)
  - `surface: #faf8ff`, `surface-container-lowest: #ffffff`(카드 배경), `on-surface: #131b2e`(본문 텍스트), `on-surface-variant: #444656`
  - `outline-variant: #c5c5d9`(기본 인풋 보더), `error: #ba1a1a`(로그인 실패 등 오류 표시에 사용)
- **타이포그래피**: `Plus Jakarta Sans` 전용. 타이틀은 `headline-lg`(28px/700), 라벨은 `label-md`(13px/600), 본문/플레이스홀더는 `body-lg`(16px/400).
- **형태/간격**: 인풋 높이 52px·라운드 `xl`(0.75rem)·보더 1px `outline-variant`, 포커스 시 `primary` 보더 + 링(box-shadow) 효과. 카드는 `rounded-2xl`, 흰 배경, subtle shadow + `outline-variant/20` 보더, 내부 패딩 32px(`p-8`), 필드 간 간격 `gap-5`(20px). 배경은 은은한 도트 패턴 + 좌상/우하 블러 그라데이션 블롭.
- **버튼**: 기본 CTA는 전체 너비, 높이 52px, `bg-primary` + hover 시 `bg-primary-container`, 텍스트는 `label-lg` 흰색, 아이콘(화살표) 동반, `active:scale-[0.99]`.
- **아이콘**: Material Symbols Outlined(아이디 필드 `person`, 비밀번호 필드 `lock`, 비밀번호 표시/숨김 토글 `visibility`/`visibility_off`).

### 로그인 화면 구성 매핑(신규 구성 필요)
- 상단 로고 + 타이틀/서브카피 영역은 동일한 레이아웃 패턴 유지, 문구만 로그인에 맞게 교체(예: "로그인" / "계정 정보를 입력해 주세요").
- 카드 내부: 아이디 입력(`person` 아이콘) + 비밀번호 입력(`lock` 아이콘, 표시/숨김 토글) 2개 필드만 사용. 비밀번호 확인 필드, 비밀번호 강도 바, 약관 동의 체크박스는 회원가입 전용이므로 **제외**.
- 로그인 실패 시 오류 메시지: `code.html`에는 오류 상태 예시가 없으므로, 인풋 보더/포커스링에 쓰인 `error` 토큰(`#ba1a1a`)과 `body-sm` 타이포를 사용해 필드 하단 또는 폼 상단에 오류 메시지 영역을 새로 구성한다.
- 하단 링크는 "아직 계정이 없으신가요? 회원가입"으로 문구를 바꾸되, S2(회원가입)가 아직 없으므로 이 슬라이스에서는 링크 대상이 없을 수 있다 — 비활성 텍스트로 두거나 S2 완료 후 연결.
- 제출 버튼 라벨만 "로그인"으로 교체, 나머지 스타일(크기/색/아이콘)은 동일하게 재사용.

## 완료 기준
- [ ] `prisma/schema.prisma`에 `User`, `Session` 모델이 정의되어 있고, 마이그레이션이 정상적으로 적용되어 DB에 해당 테이블이 생성된다.
- [ ] 관리자 시드를 실행하면 `ADMIN_USERNAME`/`ADMIN_PASSWORD` 값으로 관리자 계정이 정확히 1개 생성된다.
- [ ] 시드를 다시 실행해도 관리자 계정이 중복 생성되지 않는다(계정 수가 여전히 1개).
- [ ] 개발 서버 구동 후, 브라우저에서 로그인하지 않은 상태로 `/` 에 접속하면 `/login`으로 리다이렉트된다.
- [ ] 브라우저에서 잘못된 아이디 또는 비밀번호로 로그인을 시도하면 로그인에 실패하고, 화면에 오류 메시지가 표시되며, `/` 로 이동하지 않는다.
- [ ] 브라우저에서 시드된 관리자 계정(올바른 아이디/비밀번호)으로 로그인하면 `/` 로 이동하고, 로그인한 사용자의 이름(또는 아이디)이 화면에 표시된다.
- [ ] 로그인 성공 시 발급되는 쿠키가 `HttpOnly` 속성을 가진다(브라우저 개발자 도구의 Application/쿠키 탭으로 확인).
- [ ] 로그인 상태에서 "로그아웃" 버튼을 클릭하면 `/login`으로 이동하고, 이후 다시 `/`에 접속하면 재차 `/login`으로 리다이렉트된다(세션이 즉시 무효화됨을 확인).
- [ ] 로그아웃 직후 DB의 해당 세션 레코드가 삭제되었거나 더 이상 유효하지 않은 상태로 표시된다(Prisma 조회로 확인).
- [ ] 로그인 상태에서 보호된 화면에 접근(활동)할 때마다 DB의 세션 만료 시각(`expiresAt`)이 갱신(연장)되는지, 연속된 두 요청의 값을 비교하여 확인한다.
- [ ] DB에서 특정 세션의 만료 시각을 과거로 직접 변경한 뒤 해당 세션 쿠키로 보호된 화면에 접근하면, 인증 실패로 처리되어 `/login`으로 리다이렉트된다(만료/무효 세션 처리 확인).
- [ ] 브라우저에서 로그인 화면을 확인했을 때, 디자인 참조에 명시된 주요 토큰(primary 버튼 색상 `#183ce6`, `Plus Jakarta Sans` 폰트, 카드형 레이아웃, 52px 높이의 입력 필드 등)이 적용되어 있다.
- [ ] `npx tsc --noEmit` 및 `npm run lint`가 오류 없이 통과한다(선행 결함이었던 `class-variance-authority` 누락도 이 시점엔 해소되어 있어야 한다).
