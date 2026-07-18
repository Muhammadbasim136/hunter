import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/layout/AuthLayout";
import Spinner from "../components/ui/Spinner";
import { useAuth, getErrorMessage } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await login(values);
      const dest = location.state?.from?.pathname || "/";
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't log in. Check your credentials."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Log in" subtitle="Track down leads and get back to work.">
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

        <div className="mb-2">
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="field-input"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <div className="flex justify-end mb-6">
          <Link to="/forgot-password" className="text-xs text-brass hover:text-brass-bright">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting && <Spinner />}
          Log in
        </button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-6">
        No account?{" "}
        <Link to="/signup" className="text-brass hover:text-brass-bright font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
