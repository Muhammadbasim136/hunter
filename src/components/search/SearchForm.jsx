import { useForm } from "react-hook-form";
import Spinner from "../ui/Spinner";
import { IconCrosshair } from "../ui/Icons";

export default function SearchForm({ onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { quantity: 25 } });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="field-label" htmlFor="city">City</label>
          <input
            id="city"
            className="field-input"
            placeholder="Karachi"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && <p className="field-error">{errors.city.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="country">Country</label>
          <input
            id="country"
            className="field-input"
            placeholder="Pakistan"
            {...register("country", { required: "Country is required" })}
          />
          {errors.country && <p className="field-error">{errors.country.message}</p>}
        </div>
      </div>

      <div className="mb-4">
        <label className="field-label" htmlFor="niche">Niche / category</label>
        <input
          id="niche"
          className="field-input"
          placeholder="Boutique gyms"
          {...register("niche", { required: "Niche is required" })}
        />
        {errors.niche && <p className="field-error">{errors.niche.message}</p>}
      </div>

      <div className="mb-6">
        <label className="field-label" htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={500}
          className="field-input font-mono"
          {...register("quantity", {
            required: "Quantity is required",
            min: { value: 1, message: "Enter at least 1" },
            max: { value: 500, message: "500 max per search" },
          })}
        />
        {errors.quantity && <p className="field-error">{errors.quantity.message}</p>}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? <Spinner /> : <IconCrosshair width="15" height="15" />}
        Start search
      </button>
    </form>
  );
}
