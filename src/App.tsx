import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Game } from "./components/Game";
import React, { useEffect, useMemo, useState } from "react";
import { Infos } from "./components/panels/Infos";
import { useTranslation } from "react-i18next";
import { InfosCo } from "./components/panels/InfosCo";
import { InfosFr } from "./components/panels/InfosFr";
import { InfosHu } from "./components/panels/InfosHu";
import { InfosNl } from "./components/panels/InfosNl";
import { InfosPl } from "./components/panels/InfosPl";
import { InfosDe } from "./components/panels/InfosDe";
import { Settings } from "./components/panels/Settings";
import { useSettings } from "./hooks/useSettings";
import { Worldle } from "./components/Worldle";
import { Stats } from "./components/panels/Stats";
import { Twemoji } from "@teuteuf/react-emoji-render";
import { getDayString, useTodays } from "./hooks/useTodays";
import { InfosJa } from "./components/panels/InfosJa";

const supportLink: Record<string, string> = {
  UA: "https://donate.redcrossredcrescent.org/ua/donate/~my-donation?_cv=1",
};

export default function App() {
  const { t, i18n } = useTranslation();

  const dayString = useMemo(getDayString, []);
  const [{ country }] = useTodays(dayString);

  const [infoOpen, setInfoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const [settingsData, updateSettings] = useSettings();

  useEffect(() => {
    if (settingsData.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settingsData.theme]);

  let InfosComponent;
  switch (i18n.resolvedLanguage) {
    case "co":
      InfosComponent = InfosCo;
      break;
    case "fr":
      InfosComponent = InfosFr;
      break;
    case "hu":
      InfosComponent = InfosHu;
      break;
    case "nl":
      InfosComponent = InfosNl;
      break;
    case "pl":
      InfosComponent = InfosPl;
      break;
    case "de":
      InfosComponent = InfosDe;
      break;
    case "ja":
      InfosComponent = InfosJa;
      break;
    default:
      InfosComponent = Infos;
  }

  return (
    <>
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        theme={settingsData.theme}
        autoClose={2000}
        bodyClassName="font-bold text-center"
        toastClassName="flex justify-center m-2 max-w-full"
        style={{ width: 500, maxWidth: "100%" }}
      />
      <InfosComponent
        isOpen={infoOpen}
        close={() => setInfoOpen(false)}
        settingsData={settingsData}
      />
      <Settings
        isOpen={settingsOpen}
        close={() => setSettingsOpen(false)}
        settingsData={settingsData}
        updateSettings={updateSettings}
      />
      <Stats
        isOpen={statsOpen}
        close={() => setStatsOpen(false)}
        distanceUnit={settingsData.distanceUnit}
      />
      <div className="flex justify-center flex-auto dark:bg-slate-900 dark:text-slate-50">
        <div className="w-full max-w-lg flex flex-col">
          <header className="border-b-2 px-3 border-gray-200 flex">
            <h1 className="text-4xl font-bold uppercase tracking-wide text-center my-1 flex-auto">
              Wor<span className="text-green-600">l</span>dle TRA
              <span className="text-red-600">I</span>NER
            </h1>
          </header>
          <Game settingsData={settingsData} updateSettings={updateSettings} />
        </div>
      </div>
    </>
  );
}
