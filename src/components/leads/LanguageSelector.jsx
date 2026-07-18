import SegmentedControl from "../ui/SegmentedControl";

// Backend language codes for the three supported message languages.
export const LANGUAGE_OPTIONS = [
  { value: "roman_urdu", label: "Roman Urdu" },
  { value: "english", label: "English" },
  { value: "roman_urdu_english_mix", label: "Urdu + English" },
];

export default function LanguageSelector({ value, onChange, size }) {
  return <SegmentedControl options={LANGUAGE_OPTIONS} value={value} onChange={onChange} size={size} />;
}
