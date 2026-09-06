import { Plus_Jakarta_Sans } from "next/font/google";
import { LoginForm } from "./login-form";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function LoginPage() {
  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-login-surface p-6 ${plusJakartaSans.className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#dae2fd_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute -right-36 -top-36 size-96 rounded-full bg-login-primary-container/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -left-36 size-96 rounded-full bg-login-primary-container/50 blur-3xl" />

      <div className="relative z-10 w-full max-w-[500px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-login-surface-container-lowest shadow-md ring-1 ring-login-outline-variant/30">
            <span className="text-2xl font-bold text-login-primary">TM</span>
          </div>
          <h1 className="text-[28px] leading-9 font-bold text-login-on-surface">로그인</h1>
          <p className="mt-1 text-[16px] leading-6 text-login-on-surface-variant">
            계정 정보를 입력해 주세요
          </p>
        </div>

        <div className="rounded-2xl border border-login-outline-variant/20 bg-login-surface-container-lowest p-8 shadow-md">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
