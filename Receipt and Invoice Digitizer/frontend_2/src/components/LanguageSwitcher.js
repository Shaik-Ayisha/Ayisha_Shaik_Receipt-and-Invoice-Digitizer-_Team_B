import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-gray-200">

      {/* Globe Icon */}
      <Globe size={18} className="text-blue-600" />

      {/* Language Dropdown */}
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent outline-none text-sm font-medium cursor-pointer"
      >
        <option value="en">🇬🇧 English</option>
        <option value="hi">🇮🇳 Hindi</option>
        <option value="te">🇮🇳 Telugu</option>
        <option value="ta">🇮🇳 Tamil</option>
        <option value="kn">🇮🇳 Kannada</option>
      </select>

    </div>
  );
}

export default LanguageSwitcher;