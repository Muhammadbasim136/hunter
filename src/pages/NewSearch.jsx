import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SearchForm from "../components/search/SearchForm";
import ProgressIndicator from "../components/search/ProgressIndicator";
import { useAppState } from "../context/AppStateContext";
import { getErrorMessage } from "../lib/api";

export default function NewSearch() {
  const { runSearch, searchProgress, setSearchProgress, refreshLeads } = useAppState();
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);

  const handleSubmit = async (values) => {
    setSearching(true);
    try {
      await runSearch(values);
      await refreshLeads();
      toast.success("Search complete");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't complete the search."));
      setSearching(false);
      setSearchProgress(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-ink">New search</h1>
        <p className="text-sm text-ink-muted mt-1">
          Find leads in a city and niche, then reach out from your dashboard.
        </p>
      </div>

      <div className="card p-5 sm:p-6">
        {searching ? (
          <ProgressIndicator
            found={searchProgress?.found ?? 0}
            requested={searchProgress?.requested ?? 0}
          />
        ) : (
          <SearchForm onSubmit={handleSubmit} submitting={searching} />
        )}
      </div>
    </div>
  );
}
