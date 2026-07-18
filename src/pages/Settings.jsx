import EmailCard from "../components/settings/EmailCard";
import { useAppState } from "../context/AppStateContext";

export default function Settings() {
  const { email } = useAppState();
  const isFirstRun = !email.connected;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-ink-muted mt-1">
          {isFirstRun ? "Connect email if you want to send email outreach." : "Manage email outreach."}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <EmailCard />
      </div>
    </div>
  );
}
