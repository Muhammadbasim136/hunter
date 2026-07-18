import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/layout/AuthLayout";
import Spinner from "../components/ui/Spinner";
import { useAuth, getErrorMessage } from "../context/AuthContext";

export default function Signup() {
  const { signup, verifySignup, resendSignupCode } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("details");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const detailsForm = useForm();
  const codeForm = useForm({ defaultValues: { code: "" } });
  const password = detailsForm.watch("password");

  const onDetails = async (values) => {
    setSubmitting(true);
    try {
      const data = await signup(values);
      setEmail(data.email || values.email);
      setStep("code");
      toast.success("Verification code sent to your email.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't start signup."));
    } finally {
      setSubmitting(false);
    }
  };

  const onCode = async (values) => {
    setSubmitting(true);
    try {
      const data = await verifySignup({ email, code: values.code });
      if (data.token) {
        toast.success("Admin verified. Welcome back.");
        navigate("/", { replace: true });
      } else {
        toast.success("Email verified. Admin approval is pending.");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't verify that code."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendSignupCode({ email });
      toast.success("New code sent.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't resend the code."));
    } finally {
      setResending(false);
    }
  };

  if (step === "code") {
    return (
      <AuthLayout title="Verify email" subtitle={`Enter the 6-digit code sent to ${email}.`}>
        <form onSubmit={codeForm.handleSubmit(onCode)} noValidate>
          <div className="mb-5">
            <label className="field-label" htmlFor="code">Verification code</label>
            <input
              id="code"
              inputMode="numeric"
              maxLength={6}
              className="field-input font-mono text-center tracking-[0.35em]"
              placeholder="000000"
              {...codeForm.register("code", {
                required: "Code is required",
                pattern: { value: /^\d{6}$/, message: "Enter the 6-digit code" },
              })}
            />
            {codeForm.formState.errors.code && <p className="field-error">{codeForm.formState.errors.code.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Spinner />}
            Verify email
          </button>
        </form>

        <div className="flex items-center justify-between gap-3 mt-5 text-sm">
          <button type="button" onClick={() => setStep("details")} className="text-ink-muted hover:text-ink">
            Change email
          </button>
          <button type="button" onClick={handleResend} disabled={resending} className="text-brass hover:text-brass-bright disabled:opacity-50">
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create an account" subtitle="Verify your email first, then admin approves access.">
      <form onSubmit={detailsForm.handleSubmit(onDetails)} noValidate>
        <div className="mb-4">
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="field-input"
            placeholder="you@company.com"
            {...detailsForm.register("email", { required: "Email is required" })}
          />
          {detailsForm.formState.errors.email && <p className="field-error">{detailsForm.formState.errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="field-input"
            placeholder="At least 8 characters"
            {...detailsForm.register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Use at least 8 characters" },
            })}
          />
          {detailsForm.formState.errors.password && <p className="field-error">{detailsForm.formState.errors.password.message}</p>}
        </div>

        <div className="mb-6">
          <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="field-input"
            placeholder="Repeat password"
            {...detailsForm.register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) => value === password || "Passwords don't match",
            })}
          />
          {detailsForm.formState.errors.confirmPassword && <p className="field-error">{detailsForm.formState.errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting && <Spinner />}
          Send verification code
        </button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-brass hover:text-brass-bright font-medium">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
