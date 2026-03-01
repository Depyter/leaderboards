import { Leaderboard } from "@/components/leaderboard";
import { NotificationProvider } from "@/components/notification";

export default function Page() {
  return (
    <NotificationProvider>
      <Leaderboard />
    </NotificationProvider>
  );
}
