import React from "react";
import './Translator.css'

const TranslationResult = ({ text}) => {
  if (!text) return null;

  return (
<div className="translator-result">
  <h3>Translated Text</h3>
  <p>{text}</p>
</div>

  );
};

export default TranslationResult;
