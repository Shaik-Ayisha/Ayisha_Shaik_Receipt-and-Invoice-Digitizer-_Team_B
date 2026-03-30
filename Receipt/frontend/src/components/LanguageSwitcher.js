import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select onChange={(e) => changeLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="te">Telugu</option>
      <option value="ta">Tamil</option>
      <option value="kn">Kannada</option>
    </select>
  );
}

export default LanguageSwitcher;