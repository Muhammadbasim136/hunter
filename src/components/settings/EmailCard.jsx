import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IconMail, IconCheck } from "../ui/Icons";
import Spinner from "../ui/Spinner";
import { useAppState } from "../../context/AppStateContext";
import { getErrorMessage } from "../../lib/api";

export default function EmailCard() {
  const { email, connectEmail } = useAppState();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await connectEmail(values);
      toast.success("Email connected");
      setEditing(false);
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't connect that email."));
    } finally {
      setSubmitting(false);
    }
  };

  const showForm = editing || !email.connected;

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brass/12 border border-brass/40 flex items-center justify-center text-brass shrink-0">
            <IconMail />
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-ink">Email</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Used as a fallback outreach channel
            </p>
          </div>
        </div>

        {email.connected && !editing && (
          <span className="inline-flex items-center gap-1 rounded-full border border-signal-dim bg-signal/10 px-2 py-0.5 text-xs font-mono text-signal-bright shrink-0">
            <IconCheck width="12" height="12" /> Connected
          </span>
        )}
      </div>

      {!showForm ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-mono text-ink truncate">{email.address}</p>
          <button onClick={() => setEditing(true)} className="btn-ghost shrink-0">
            Change
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label className="field-label" htmlFor="email-addr">Email address</label>
            <input
              id="email-addr"
              type="email"
              className="field-input"
              placeholder="you@company.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div className="mb-5">
            <label className="field-label" htmlFor="app-password">App password</label>
            <input
              id="app-password"
              type="password"
              className="field-input"
              placeholder="16-character app password"
              {...register("appPassword", { required: "App password is required" })}
            />
            {errors.appPassword && <p className="field-error">{errors.appPassword.message}</p>}
            <p className="text-xs text-ink-faint mt-1.5">
              Not your account password — generate one from your email provider's security settings.
            </p>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting && <Spinner />}
              Save
            </button>
            {email.connected && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  reset();
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
