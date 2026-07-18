import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/layout/AuthLayout";
import Spinner from "../components/ui/Spinner";
import { useAuth, getErrorMessage } from "../context/AuthContext";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await resetPassword({ email: values.email, code: values.code, password: values.password });
      toast.success("Password updated. Log in with your new password.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't reset your password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Use the 6-digit code from your email.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
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

        <div className="mb-4">
          <label className="field-label" htmlFor="code">Reset code</label>
          <input
            id="code"
            inputMode="numeric"
            maxLength={6}
            className="field-input font-mono text-center tracking-[0.35em]"
            placeholder="000000"
            {...register("code", {
              required: "Code is required",
              pattern: { value: /^\d{6}$/, message: "Enter the 6-digit code" },
            })}
          />
          {errors.code && <p className="field-error">{errors.code.message}</p>}
        </div>

        <div className="mb-4">
          <label className="field-label" htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="field-input"
            placeholder="At least 8 characters"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Use at least 8 characters" },
            })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <div className="mb-6">
          <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="field-input"
            placeholder="Repeat password"
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) => value === password || "Passwords don't match",
            })}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting && <Spinner />}
          Update password
        </button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        Need a code?{" "}
        <Link to="/forgot-password" className="text-brass hover:text-brass-bright font-medium">
          Request one
        </Link>
      </p>
    </AuthLayout>
  );
}
