import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome back",
      dashboard: "Dashboard",
      dashboardDesc: "Centralized management for digitizing receipts and invoices",
      home: "Home",
      documents: "Documents",
      history: "History",
      settings: "Settings",
      logout: "Logout",
      admin: "Admin",

      totalDocuments: "Total Documents",
      receiptsUploaded: "Receipts Uploaded",
      invoicesUploaded: "Invoices Uploaded",
      pendingOCR: "Pending OCR",

      uploadReceipt: "Upload Receipt",
      uploadInvoice: "Upload Invoice",
      dragDropReceipt: "Drag & drop or click to upload receipt",
      dragDropInvoice: "Drag & drop or click to upload invoice",

      recentDocuments: "Recent Documents",
      fileName: "File Name",
      type: "Type",
      date: "Date",
      status: "Status",
      noDocuments: "No documents yet",

      expenseAnalysis: "Expense Analysis",

      howItWorks: "How It Works",
      uploadDocuments: "Upload Documents",
      automaticProcessing: "Automatic Processing",
      extractData: "Extract Data",
      exportAnalyze: "Export & Analyze",

      login: "Login",
      signup: "Sign Up",
      email: "Email Address",
      password: "Password",
      fullName: "Full Name",
      continue: "Continue",
      createAccount: "Create Account",
      newUser: "New user?",
      backTo: "Back to",
      signIn: "Sign In",
      receiptInvoice: "Receipt & Invoice",
      digitizer: "Digitizer",
      firstTimeMessage: "First time here? Please register or sign up to continue.",
      registeredSuccessfully: "Registered successfully"
    }
  },

  hi: {
    translation: {
      welcome: "वापसी पर स्वागत है",
      dashboard: "डैशबोर्ड",
      dashboardDesc: "रसीद और चालान को डिजिटल रूप में प्रबंधित करें",
      home: "होम",
      documents: "दस्तावेज़",
      history: "इतिहास",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      admin: "एडमिन",

      totalDocuments: "कुल दस्तावेज़",
      receiptsUploaded: "अपलोड की गई रसीदें",
      invoicesUploaded: "अपलोड किए गए चालान",
      pendingOCR: "लंबित OCR",

      uploadReceipt: "रसीद अपलोड करें",
      uploadInvoice: "चालान अपलोड करें",
      dragDropReceipt: "रसीद अपलोड करने के लिए ड्रैग या क्लिक करें",
      dragDropInvoice: "चालान अपलोड करने के लिए ड्रैग या क्लिक करें",

      recentDocuments: "हाल के दस्तावेज़",
      fileName: "फ़ाइल नाम",
      type: "प्रकार",
      date: "तारीख",
      status: "स्थिति",
      noDocuments: "कोई दस्तावेज़ नहीं",

      expenseAnalysis: "खर्च विश्लेषण",

      login: "लॉगिन",
      signup: "साइन अप",
      email: "ईमेल पता",
      password: "पासवर्ड",
      fullName: "पूरा नाम",
      continue: "जारी रखें",
      createAccount: "खाता बनाएं",
      newUser: "नया उपयोगकर्ता?",
      backTo: "वापस जाएं",
      signIn: "साइन इन",
      receiptInvoice: "रसीद और चालान",
      digitizer: "डिजिटाइज़र",
      firstTimeMessage: "पहली बार यहाँ? कृपया पंजीकरण करें।",
      registeredSuccessfully: "सफलतापूर्वक पंजीकृत"
    }
  },

  te: {
    translation: {
      welcome: "మళ్లీ స్వాగతం",
      dashboard: "డాష్‌బోర్డ్",
      dashboardDesc: "రసీదులు మరియు ఇన్వాయిస్లను డిజిటల్‌గా నిర్వహించండి",
      home: "హోమ్",
      documents: "పత్రాలు",
      history: "చరిత్ర",
      settings: "సెట్టింగ్స్",
      logout: "లాగ్ అవుట్",
      admin: "అడ్మిన్",

      totalDocuments: "మొత్తం పత్రాలు",
      receiptsUploaded: "అప్‌లోడ్ చేసిన రసీదులు",
      invoicesUploaded: "అప్‌లోడ్ చేసిన ఇన్వాయిస్లు",
      pendingOCR: "పెండింగ్ OCR",

      uploadReceipt: "రసీదు అప్‌లోడ్",
      uploadInvoice: "ఇన్వాయిస్ అప్‌లోడ్",
      dragDropReceipt: "రసీదును డ్రాగ్ చేసి లేదా క్లిక్ చేసి అప్‌లోడ్ చేయండి",
      dragDropInvoice: "ఇన్వాయిస్ను డ్రాగ్ చేసి లేదా క్లిక్ చేసి అప్‌లోడ్ చేయండి",

      recentDocuments: "ఇటీవలి పత్రాలు",
      fileName: "ఫైల్ పేరు",
      type: "రకం",
      date: "తేదీ",
      status: "స్థితి",
      noDocuments: "పత్రాలు లేవు",

      expenseAnalysis: "ఖర్చుల విశ్లేషణ",

      login: "లాగిన్",
      signup: "సైన్ అప్",
      email: "ఇమెయిల్ చిరునామా",
      password: "పాస్‌వర్డ్",
      fullName: "పూర్తి పేరు",
      continue: "కొనసాగించు",
      createAccount: "ఖాతా సృష్టించండి",
      newUser: "కొత్త వినియోగదారునా?",
      backTo: "తిరిగి వెళ్ళు",
      signIn: "సైన్ ఇన్",
      receiptInvoice: "రసీదు & ఇన్వాయిస్",
      digitizer: "డిజిటైజర్",
      firstTimeMessage: "మొదటిసారి వచ్చారా? దయచేసి నమోదు చేయండి.",
      registeredSuccessfully: "విజయవంతంగా నమోదు అయ్యారు"
    }
  },

  ta: {
    translation: {
      welcome: "மீண்டும் வரவேற்கிறோம்",
      dashboard: "டாஷ்போர்டு",
      dashboardDesc: "ரசீதுகள் மற்றும் இன்வாய்ஸ்களை டிஜிட்டல் முறையில் நிர்வகிக்கவும்",
      home: "முகப்பு",
      documents: "ஆவணங்கள்",
      history: "வரலாறு",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",
      admin: "நிர்வாகி",

      totalDocuments: "மொத்த ஆவணங்கள்",
      receiptsUploaded: "பதிவேற்றப்பட்ட ரசீதுகள்",
      invoicesUploaded: "பதிவேற்றப்பட்ட இன்வாய்ஸ்கள்",
      pendingOCR: "நிலுவையில் உள்ள OCR",

      uploadReceipt: "ரசீது பதிவேற்று",
      uploadInvoice: "இன்வாய்ஸ் பதிவேற்று",
      dragDropReceipt: "ரசீதை இழுத்து விடவும் அல்லது கிளிக் செய்து பதிவேற்றவும்",
      dragDropInvoice: "இன்வாய்ஸை இழுத்து விடவும் அல்லது கிளிக் செய்து பதிவேற்றவும்",

      recentDocuments: "சமீபத்திய ஆவணங்கள்",
      fileName: "கோப்பு பெயர்",
      type: "வகை",
      date: "தேதி",
      status: "நிலை",
      noDocuments: "ஆவணங்கள் இல்லை",

      expenseAnalysis: "செலவு பகுப்பாய்வு",

      login: "உள்நுழை",
      signup: "பதிவு செய்",
      email: "மின்னஞ்சல் முகவரி",
      password: "கடவுச்சொல்",
      fullName: "முழு பெயர்",
      continue: "தொடரவும்",
      createAccount: "கணக்கு உருவாக்கு",
      newUser: "புதிய பயனரா?",
      backTo: "திரும்ப செல்லவும்",
      signIn: "உள்நுழை",
      receiptInvoice: "ரசீது & இன்வாய்ஸ்",
      digitizer: "டிஜிட்டைசர்",
      firstTimeMessage: "முதன்முறையா? தயவுசெய்து பதிவு செய்யவும்.",
      registeredSuccessfully: "வெற்றிகரமாக பதிவு செய்யப்பட்டது"
    }
  },

  kn: {
    translation: {
      welcome: "ಮತ್ತೆ ಸ್ವಾಗತ",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      dashboardDesc: "ರಸೀದಿ ಮತ್ತು ಇನ್ವಾಯ್ಸ್‌ಗಳನ್ನು ಡಿಜಿಟಲ್ ರೀತಿಯಲ್ಲಿ ನಿರ್ವಹಿಸಿ",
      home: "ಮುಖಪುಟ",
      documents: "ದಾಖಲೆಗಳು",
      history: "ಇತಿಹಾಸ",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      logout: "ಲಾಗ್ ಔಟ್",
      admin: "ನಿರ್ವಾಹಕ",

      totalDocuments: "ಒಟ್ಟು ದಾಖಲೆಗಳು",
      receiptsUploaded: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ರಸೀದಿಗಳು",
      invoicesUploaded: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಇನ್ವಾಯ್ಸ್‌ಗಳು",
      pendingOCR: "ಬಾಕಿ ಇರುವ OCR",

      uploadReceipt: "ರಸೀದಿ ಅಪ್‌ಲೋಡ್",
      uploadInvoice: "ಇನ್ವಾಯ್ಸ್ ಅಪ್‌ಲೋಡ್",
      dragDropReceipt: "ರಸೀದಿಯನ್ನು ಡ್ರಾಗ್ ಮಾಡಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      dragDropInvoice: "ಇನ್ವಾಯ್ಸ್ ಅನ್ನು ಡ್ರಾಗ್ ಮಾಡಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",

      recentDocuments: "ಇತ್ತೀಚಿನ ದಾಖಲೆಗಳು",
      fileName: "ಫೈಲ್ ಹೆಸರು",
      type: "ಪ್ರಕಾರ",
      date: "ದಿನಾಂಕ",
      status: "ಸ್ಥಿತಿ",
      noDocuments: "ದಾಖಲೆಗಳಿಲ್ಲ",

      expenseAnalysis: "ವೆಚ್ಚ ವಿಶ್ಲೇಷಣೆ",

      login: "ಲಾಗಿನ್",
      signup: "ಸೈನ್ ಅಪ್",
      email: "ಇಮೇಲ್ ವಿಳಾಸ",
      password: "ಪಾಸ್ವರ್ಡ್",
      fullName: "ಪೂರ್ಣ ಹೆಸರು",
      continue: "ಮುಂದುವರಿಸಿ",
      createAccount: "ಖಾತೆ ರಚಿಸಿ",
      newUser: "ಹೊಸ ಬಳಕೆದಾರ?",
      backTo: "ಹಿಂತಿರುಗಿ",
      signIn: "ಸೈನ್ ಇನ್",
      receiptInvoice: "ರಸೀದಿ ಮತ್ತು ಇನ್ವಾಯ್ಸ್",
      digitizer: "ಡಿಜಿಟೈಸರ್",
      firstTimeMessage: "ಮೊದಲ ಬಾರಿ ಇಲ್ಲಿ? ದಯವಿಟ್ಟು ನೋಂದಣಿ ಮಾಡಿ.",
      registeredSuccessfully: "ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;