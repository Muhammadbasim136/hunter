import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Spinner from "../components/ui/Spinner";
import { IconCheck } from "../components/ui/Icons";
import { useAuth, getErrorMessage } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await forgotPassword(values);
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't send the reset link."));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your inbox">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-11 h-11 rounded-full bg-signal/15 border border-signal-dim flex items-center justify-center text-signal mb-4">
            <IconCheck />
          </div>
          <p className="text-sm text-ink-muted mb-6 leading-relaxed">
            If an account exists for that email, a 6-digit reset code is on its way.
          </p>
          <Link to="/reset-password" className="btn-secondary w-full">
            Enter reset code
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a 6-digit code to set a new one.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="field-input"
            placeholder="you@company.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting && <Spinner />}
          Send reset code
        </button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        <Link to="/login" className="text-brass hover:text-brass-bright font-medium">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
