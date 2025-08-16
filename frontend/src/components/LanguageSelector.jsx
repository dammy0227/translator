import React from "react";
import './Translator.css'

const LanguageSelector = ({ languages, value, onChange, label }) => {
  return (
<div className="language-selector">
  <label>{label}</label>
  <select value={value} onChange={(e) => onChange(e.target.value)}>
    {languages.map((lang) => (
      <option key={lang.code} value={lang.code}>
        {lang.name}
      </option>
    ))}
  </select>
</div>

  );
};

export default LanguageSelector;
