import { requireUser } from "@/services/auth.service";
import { logoutAction } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const user = await requireUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-lg">
        환영합니다, <span className="font-semibold">{user.displayName}</span>님
      </p>
      <form action={logoutAction}>
        <Button type="submit" variant="outline">
          로그아웃
        </Button>
      </form>
    </main>
  );
}
