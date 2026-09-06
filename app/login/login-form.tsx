"use client";

import { useActionState, useState } from "react";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loginAction } from "@/app/actions/auth.actions";

const fieldWrapperClass =
  "flex h-[52px] items-center gap-3 rounded-xl border border-login-outline-variant/40 px-4 shadow-sm focus-within:border-login-primary focus-within:ring-2 focus-within:ring-login-primary/20";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <p className="text-[12px] leading-[18px] text-login-error">{state.error}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="username"
          className="text-[13px] leading-[18px] font-semibold text-login-on-surface-variant"
        >
          아이디
        </label>
        <div className={fieldWrapperClass}>
          <User className="size-5 shrink-0 text-login-on-surface-variant" />
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="w-full bg-transparent text-[16px] leading-6 text-login-on-surface outline-none placeholder:text-login-on-surface-variant/60"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-[13px] leading-[18px] font-semibold text-login-on-surface-variant"
        >
          비밀번호
        </label>
        <div className={fieldWrapperClass}>
          <Lock className="size-5 shrink-0 text-login-on-surface-variant" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full bg-transparent text-[16px] leading-6 text-login-on-surface outline-none placeholder:text-login-on-surface-variant/60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            className="shrink-0 text-login-on-surface-variant"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className={cn(
          "h-[52px] w-full rounded-xl bg-login-primary text-[15px] leading-[22px] font-semibold text-white",
          "hover:bg-login-primary-container active:scale-[0.99]"
        )}
      >
        로그인
      </Button>

      <p className="text-center text-[13px] leading-[18px] text-login-on-surface-variant">
        아직 계정이 없으신가요?{" "}
        <span className="font-semibold text-login-primary">회원가입</span>
      </p>
    </form>
  );
}
