// client/src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/**
 * UI strings used in Header.jsx
 * - brandName: main wordmark (translate or keep English — your call)
 * - ticker: small status chip under the wordmark
 * - promo/CTA + tabs labels
 */
const en = {
  brandName: "THE TIMELY VOICE",
  ticker: "ISRAEL AT WAR — DAY 710",

  promoJoin: "JOIN OUR COMMUNITY",
  promoSub: "Support TTV and remove all ads",
  ctaDaily: "GET THE DAILY UPDATES",
  ctaSignIn: "SIGN IN",

  tabsTop: "TOP NEWS",
  tabsIndia: "INDIA",
  tabsWorld: "WORLD",
  tabsFinance: "FINANCE",
  tabsHealth: "HEALTH & LIFESTYLE",
  tabsTech: "TECH",
  tabsEntertainment: "ENTERTAINMENT",
};

const hi = {
  brandName: "द टाइमली वॉइस",
  ticker: "इज़राइल युद्ध में — दिन 710",

  promoJoin: "हमारे समुदाय से जुड़ें",
  promoSub: "TTV का समर्थन करें और विज्ञापन हटाएँ",
  ctaDaily: "दैनिक संस्करण प्राप्त करें",
  ctaSignIn: "साइन इन",

  tabsTop: "मुख्य समाचार",
  tabsIndia: "भारत",
  tabsWorld: "विश्व",
  tabsFinance: "वित्त",
  tabsHealth: "स्वास्थ्य व जीवनशैली",
  tabsTech: "प्रौद्योगिकी",
  tabsEntertainment: "मनोरंजन",
};

const bn = {
  brandName: "দ্য টাইমলি ভয়েস",
  ticker: "ইসরায়েল যুদ্ধে — দিন ৭১০",

  promoJoin: "আমাদের কমিউনিটিতে যোগ দিন",
  promoSub: "TTV সমর্থন করুন এবং বিজ্ঞাপন সরান",
  ctaDaily: "দৈনিক সংস্করণ নিন",
  ctaSignIn: "সাইন ইন",

  tabsTop: "শীর্ষ খবর",
  tabsIndia: "ভারত",
  tabsWorld: "বিশ্ব",
  tabsFinance: "অর্থনীতি",
  tabsHealth: "স্বাস্থ্য ও জীবনধারা",
  tabsTech: "প্রযুক্তি",
  tabsEntertainment: "বিনোদন",
};

const mr = {
  brandName: "द टाइमली व्हॉइस",
  ticker: "इस्रायल युद्धात — दिवस ७१०",

  promoJoin: "आमच्या समुदायात सामील व्हा",
  promoSub: "TTV ला समर्थन द्या आणि जाहिराती काढा",
  ctaDaily: "दैनिक आवृत्ती मिळवा",
  ctaSignIn: "साइन इन",

  tabsTop: "मुख्य बातम्या",
  tabsIndia: "भारत",
  tabsWorld: "जग",
  tabsFinance: "अर्थ",
  tabsHealth: "आरोग्य व जीवनशैली",
  tabsTech: "तंत्रज्ञान",
  tabsEntertainment: "मनोरंजन",
};

const te = {
  brandName: "ది టైమ్లీ వాయిస్",
  ticker: "ఇజ్రాయెల్ యుద్ధంలో — రోజు 710",

  promoJoin: "మా సమూహంలో చేరండి",
  promoSub: "TTVకి మద్దతు ఇవ్వండి మరియు ప్రకటనలను తొలగించండి",
  ctaDaily: "దైనందిన ఎడిషన్ పొందండి",
  ctaSignIn: "సైన్ ఇన్",

  tabsTop: "ప్రధాన వార్తలు",
  tabsIndia: "భారత్",
  tabsWorld: "ప్రపంచం",
  tabsFinance: "ఆర్థికం",
  tabsHealth: "ఆరోగ്യം & జీవనశైలి",
  tabsTech: "టెక్",
  tabsEntertainment: "వినోదం",
};

const ta = {
  brandName: "தி டைம்லி வோய்ஸ்",
  ticker: "இஸ்ரேல் போரில் — நாள் 710",

  promoJoin: "எங்கள் சமூகத்தில் சேரவும்",
  promoSub: "TTV-ஐ ஆதரித்து விளம்பரங்களை நீக்குங்கள்",
  ctaDaily: "தினசரி பதிப்பை பெறுக",
  ctaSignIn: "சைன் இன்",

  tabsTop: "முக்கிய செய்திகள்",
  tabsIndia: "இந்தியா",
  tabsWorld: "உலகம்",
  tabsFinance: "நிதி",
  tabsHealth: "ஆரோக்கியம் & வாழ்க்கைமுறை",
  tabsTech: "தொழில்நுட்பம்",
  tabsEntertainment: "பொழுதுபோக்கு",
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      mr: { translation: mr },
      te: { translation: te },
      ta: { translation: ta },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
