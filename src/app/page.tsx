import LogoutButton from "@@/components/LogoutButton";
import { auth } from "@@/lib/auth";
import { redirect } from "next/navigation";

export default async function App() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-lg">Signed in as {session.user?.email}</p>
        <p className="text-lg">Name: {session.user?.name}</p>
        <p className="text-lg">Provider: {session.user?.provider}</p>
        <LogoutButton />
      </div>
    </main>
  );
}
