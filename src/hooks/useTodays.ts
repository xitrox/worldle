import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import {
  bigEnoughCountriesWithImage,
  countriesWithImage,
  Country,
  smallCountryLimit,
} from "../domain/countries";
import { areas } from "../domain/countries.area";
import { CountryCode } from "../domain/countries.position";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";

const forcedCountries: Record<string, CountryCode> = {
  "2022-02-02": "TD",
  "2022-02-03": "PY",
  "2022-03-21": "HM",
  "2022-03-22": "MC",
  "2022-03-23": "PR",
  "2022-03-24": "MX",
  "2022-03-25": "SE",
  "2022-03-26": "VU",
  "2022-03-27": "TF",
  "2022-03-28": "AU",
  "2022-03-29": "DE",
  "2022-03-30": "GA",
  "2022-03-31": "AI",
  "2022-04-01": "NE",
  "2022-04-02": "ET",
  "2022-04-03": "TZ",
  "2022-04-04": "LV",
  "2022-04-05": "CN",
  "2022-04-06": "SO",
  "2022-04-07": "JP",
  "2022-04-08": "BJ",
  "2022-04-09": "PW",
  "2022-04-10": "TW",
  "2022-04-11": "BS",
  "2022-04-12": "GA",
  "2022-04-13": "KZ",
  "2022-04-14": "PH",
  "2022-04-15": "MR",
  "2022-04-16": "AE",
  "2022-04-17": "SI",
  "2022-04-18": "LT",
  "2022-04-19": "PT",
  "2022-04-20": "LA",
  "2022-04-21": "TR",
  "2022-04-22": "CF",
  "2022-04-23": "MC",
  "2022-04-24": "UY",
  "2022-04-25": "CR",
  "2022-04-26": "MM",
  "2022-04-27": "ZW",
  "2022-04-28": "HR",
  "2022-04-29": "NC",
  "2022-04-30": "CO",
  "2022-05-01": "CU",
  "2022-05-02": "ES",
  "2022-05-03": "TM",
  "2022-05-04": "LI",
  "2022-05-05": "MK",
  "2022-05-06": "CY",
  "2022-05-07": "SR",
  "2022-05-08": "JM",
  "2022-05-09": "LR",
  "2022-05-10": "MZ",
  "2022-05-11": "AL",
  "2022-05-12": "UA",
  "2022-05-13": "SL",
  "2022-05-14": "CV",
  "2022-05-15": "BO",
  "2022-05-16": "AF",
  "2022-05-17": "TT",
  "2022-05-18": "FI",
  "2022-05-19": "CZ",
  "2022-05-20": "NP",
  "2022-05-21": "SZ",
  "2022-05-22": "AR",
  "2022-05-23": "PL",
  "2022-05-24": "TO",
  "2022-05-25": "BF",
  "2022-05-26": "EE",
  "2022-05-27": "UG",
  "2022-05-28": "BT",
  "2022-05-29": "FJ",
  "2022-05-30": "ER",
  "2022-05-31": "PY",
  "2022-06-01": "SH",
  "2022-06-02": "US",
  "2022-06-03": "BG",
  "2022-06-04": "DJ",
  "2022-06-05": "GM",
  "2022-06-06": "KH",
  "2022-06-07": "NA",
  "2022-06-08": "UZ",
  "2022-06-09": "BH",
  "2022-06-10": "CG",
  "2022-06-11": "NZ",
  "2022-06-12": "DK",
  "2022-06-13": "BD",
  "2022-06-14": "ML",
  "2022-06-15": "BW",
  "2022-06-16": "NG",
  "2022-06-17": "KY",
  "2022-06-18": "AO",
  "2022-06-19": "MA",
  "2022-06-20": "KE",
  "2022-06-21": "MN",
  "2022-06-22": "PG",
  "2022-06-23": "SN",
  "2022-06-24": "AQ",
  "2022-06-25": "GH",
  "2022-06-26": "IS",
  "2022-06-27": "MD",
  "2022-06-28": "NO",
  "2022-06-29": "SC",
  "2022-06-30": "MD",
  "2022-07-01": "VE",
  "2022-10-25": "TR",
  "2022-10-26": "SD",
  "2022-10-27": "HN",
  "2022-10-28": "ET",
  "2022-10-29": "SV",
  "2022-10-30": "PF",
  "2022-10-31": "NZ",
  "2022-11-01": "MX",
  "2022-11-02": "ME",
  "2022-11-03": "TN",
  "2022-11-04": "CH",
  "2022-11-05": "CF",
  "2022-11-06": "JO",
  "2022-11-07": "IE",
  "2022-11-08": "QA",
  "2022-11-09": "RE",
  "2022-11-10": "RO",
  "2022-11-11": "DK",
  "2022-11-12": "MY",
  "2022-11-13": "BY",
  "2022-11-14": "MZ",
  "2022-11-15": "BG",
  "2022-11-16": "KP",
  "2022-11-17": "ZA",
  "2022-11-18": "LB",
  "2022-11-19": "UG",
  "2022-11-20": "RS",
  "2022-11-21": "SB",
  "2022-11-22": "SC",
  "2022-11-23": "PK",
  "2022-11-24": "BO",
  "2022-11-25": "BN",
  "2022-11-26": "BR",
  "2022-11-27": "AU",
  "2022-11-28": "AT",
  "2022-11-29": "AR",
  "2022-11-30": "TK",
  "2022-12-01": "KR",
  "2022-12-02": "ZM",
  "2022-12-03": "IT",
  "2022-12-04": "NI",
  "2022-12-05": "BZ",
  "2022-12-06": "GE",
  "2022-12-07": "ZW",
  "2022-12-08": "CC",
  "2022-12-09": "NE",
  "2022-12-10": "CA",
  "2022-12-11": "TH",
  "2022-12-12": "GT",
  "2022-12-13": "AE",
  "2022-12-14": "RU",
  "2022-12-15": "GN",
  "2022-12-16": "UZ",
  "2022-12-17": "KI",
  "2022-12-18": "SE",
  "2022-12-19": "GY",
  "2022-12-20": "TJ",
  "2022-12-21": "SL",
  "2022-12-22": "SI",
  "2022-12-23": "RW",
  "2022-12-24": "PA",
  "2022-12-25": "NL",
  "2022-12-26": "CG",
  "2022-12-27": "BH",
  "2022-12-28": "BJ",
  "2022-12-29": "AF",
  "2022-12-30": "AO",
  "2022-12-31": "GR",
  "2023-01-01": "KE",
  "2023-01-02": "TM",
  "2023-01-03": "GQ",
  "2023-01-04": "SK",
  "2023-01-05": "GS",
  "2023-01-06": "SS",
  "2023-01-07": "FI",
  "2023-01-08": "SO",
  "2023-01-09": "CY",
  "2023-01-10": "SY",
  "2023-01-11": "TD",
  "2023-01-12": "PT",
  "2023-01-13": "PH",
  "2023-01-14": "PL",
  "2023-01-15": "NP",
  "2023-01-16": "NR",
  "2023-01-17": "MR",
  "2023-01-18": "MM",
  "2023-01-19": "MA",
  "2023-01-20": "HR",
  "2023-01-21": "TW",
  "2023-01-22": "FR",
  "2023-01-23": "SR",
  "2023-01-24": "GH",
  "2023-01-25": "SA",
  "2023-01-26": "ER",
  "2023-01-27": "PM",
  "2023-01-28": "EC",
  "2023-01-29": "TZ",
  "2023-01-30": "CU",
  "2023-01-31": "UY",
  "2023-02-01": "UA",
  "2023-02-02": "AL",
  "2023-02-03": "EE",
  "2023-02-04": "HN",
  "2023-02-05": "LC",
  "2023-02-06": "NA",
  "2023-02-07": "TR",
  "2023-02-08": "BA",
  "2023-02-09": "CI",
  "2023-02-10": "MX",
  "2023-02-11": "SV",
  "2023-02-12": "IQ",
  "2023-02-13": "NO",
  "2023-02-14": "TN",
  "2023-02-15": "AW",
  "2023-02-16": "NZ",
  "2023-02-17": "US",
  "2023-02-18": "BT",
  "2023-02-19": "ES",
  "2023-02-20": "LR",
  "2023-02-21": "MY",
  "2023-02-22": "RO",
  "2023-02-23": "SN",
  "2023-02-24": "VC",
  "2023-02-25": "AZ",
  "2023-02-26": "BY",
  "2023-02-27": "BD",
  "2023-02-28": "CH",
  "2023-03-01": "AM",
  "2023-03-02": "UG",
  "2023-03-03": "OM",
  "2023-03-04": "HT",
  "2023-03-05": "DJ",
  "2023-03-06": "AS",
  "2023-03-07": "VE",
  "2023-03-08": "NG",
  "2023-03-09": "IS",
  "2023-03-10": "DE",
  "2023-03-11": "CL",
  "2023-03-12": "CD",
  "2023-03-13": "BO",
  "2023-03-14": "BG",
  "2023-03-15": "AU",
  "2023-03-16": "AR",
  "2023-03-17": "AG",
  "2023-03-18": "YE",
  "2023-03-19": "ZA",
  "2023-03-20": "VN",
  "2023-03-21": "ZM",
  "2023-03-22": "AT",
  "2023-03-23": "ZW",
  "2023-03-24": "AE",
  "2023-03-25": "SC",
  "2023-03-26": "RS",
  "2023-03-27": "SB",
  "2023-03-28": "SD",
  "2023-03-29": "QA",
  "2023-03-30": "BE",
  "2023-03-31": "BF",
  "2023-04-01": "KR",
  "2023-04-02": "VG",
  "2023-04-03": "GW",
  "2023-04-04": "UZ",
  "2023-04-05": "GN",
  "2023-04-06": "SE",
  "2023-04-07": "DZ",
  "2023-04-08": "SI",
  "2023-04-09": "DO",
  "2023-04-10": "GU",
  "2023-04-11": "AF",
  "2023-04-12": "NE",
  "2023-04-13": "BN",
  "2023-04-14": "PA",
  "2023-04-15": "GQ",
  "2023-04-16": "BR",
  "2023-04-17": "GY",
  "2023-04-18": "BV",
  "2023-04-19": "RU",
  "2023-04-20": "KW",
  "2023-04-21": "NI",
  "2023-04-22": "MD",
  "2023-04-23": "PH",
  "2023-04-24": "TD",
  "2023-04-25": "BZ",
  "2023-04-26": "CF",
  "2023-04-27": "GB",
  "2023-04-28": "PK",
  "2023-04-29": "MR",
  "2023-04-30": "BH",
  "2023-05-01": "CA",
  "2023-05-02": "DK",
  "2023-05-03": "AO",
  "2023-05-04": "NP",
  "2023-05-05": "GH",
  "2023-05-06": "CN",
  "2023-05-07": "GR",
  "2023-05-08": "BW",
  "2023-05-09": "CK",
  "2023-05-10": "EC",
  "2023-05-11": "PL",
  "2023-05-12": "CU",
  "2023-05-13": "PE",
  "2023-05-14": "CO",
  "2023-05-15": "PT",
  "2023-05-16": "CM",
  "2023-05-17": "SY",
  "2023-05-18": "GI",
  "2023-05-19": "SL",
  "2023-05-20": "IT",
  "2023-05-21": "SK",
  "2023-05-22": "CG",
  "2023-05-23": "KH",
  "2023-05-24": "SO",
  "2023-05-25": "CY",
  "2023-05-26": "LU",
  "2023-05-27": "EE",
  "2023-05-28": "JP",
  "2023-05-29": "SR",
  "2023-05-30": "MA",
  "2023-05-31": "NZ",
  "2023-06-01": "EG",
  "2023-06-02": "HN",
  "2023-06-03": "AD",
  "2023-06-04": "ML",
  "2023-06-05": "RO",
  "2023-06-06": "HR",
  "2023-06-07": "LV",
  "2023-06-08": "CH",
  "2023-06-09": "GT",
  "2023-06-10": "HU",
  "2023-06-11": "BB",
  "2023-06-12": "SA",
  "2023-06-13": "IE",
  "2023-06-14": "BT",
  "2023-06-15": "SN",
  "2023-06-16": "LA",
  "2023-06-17": "DJ",
  "2023-06-18": "TH",
  "2023-06-19": "MS",
  "2023-06-20": "ID",
  "2023-06-21": "LS",
  "2023-06-22": "SV",
  "2023-06-23": "AM",
  "2023-06-24": "DE",
  "2023-06-25": "JO",
  "2023-06-26": "RW",
  "2023-06-27": "TW",
  "2023-06-28": "CL",
  "2023-06-29": "IL",
  "2023-06-30": "SM",
  "2023-07-01": "JM",
  "2023-07-02": "ER",
  "2023-07-03": "AL",
  "2023-07-04": "TJ",
  "2023-07-05": "ME",
  "2023-07-06": "NG",
  "2023-07-07": "IN",
  "2023-07-08": "CV",
  "2023-07-09": "YE",
  "2023-07-10": "NL",
  "2023-07-11": "TN",
  "2023-07-12": "IQ",
  "2023-07-13": "NO",
  "2023-07-14": "UA",
  "2023-07-15": "ES",
  "2023-07-16": "IS",
  "2023-07-17": "PN",
  "2023-07-18": "UG",
  "2023-07-19": "KG",
  "2023-07-20": "AR",
  "2023-07-21": "MG",
  "2023-07-22": "IR",
  "2023-07-23": "ET",
  "2023-07-24": "TM",
  "2023-07-25": "RS",
  "2023-07-26": "FI",
  "2023-07-27": "BM",
  "2023-07-28": "OM",
  "2023-07-29": "KE",
  "2023-07-30": "BY",
  "2023-07-31": "NA",
  "2023-08-01": "US",
  "2023-08-02": "NI",
  "2023-08-03": "LT",
  "2023-08-04": "FO",
  "2023-08-05": "BZ",
  "2023-08-06": "AT",
  "2023-08-07": "TR",
  "2023-08-08": "SE",
  "2023-08-09": "PA",
  "2023-08-10": "GW",
  "2023-08-11": "UY",
  "2023-08-12": "KI",
  "2023-08-13": "UZ",
  "2023-08-14": "HT",
  "2023-08-15": "ZW",
  "2023-08-16": "KP",
  "2023-08-17": "TD",
  "2023-08-18": "GR",
  "2023-08-19": "TZ",
  "2023-08-20": "MD",
  "2023-08-21": "QA",
  "2023-08-22": "MR",
  "2023-08-23": "PT",
  "2023-08-24": "VE",
  "2023-08-25": "AZ",
  "2023-08-26": "DK",
  "2023-08-27": "HK",
  "2023-08-28": "MW",
  "2023-08-29": "IT",
  "2023-08-30": "BE",
  "2023-08-31": "VN",
  "2023-09-01": "SD",
  "2023-09-02": "CU",
  "2023-09-03": "NE",
  "2023-09-04": "CN",
  "2023-09-05": "MX",
  "2023-09-06": "AU",
  "2023-09-07": "KH",
  "2023-09-08": "FR",
  "2023-09-09": "RU",
  "2023-09-10": "HN",
  "2023-09-11": "VI",
  "2023-09-12": "NP",
  "2023-09-13": "CY",
  "2023-09-14": "SB",
  "2023-09-15": "GE",
  "2023-09-16": "ZA",
  "2023-09-17": "JP",
  "2023-09-18": "ZM",
  "2023-09-19": "PH",
  "2023-09-20": "BI",
  "2023-09-21": "WF",
  "2023-09-22": "HR",
  "2023-09-23": "GA",
  "2023-09-24": "PE",
  "2023-09-25": "ML",
  "2023-09-26": "AF",
  "2023-09-27": "AO",
  "2023-09-28": "GT",
  "2023-09-29": "CX",
  "2023-09-30": "BA",
  "2023-10-01": "BW",
  "2023-10-02": "SR",
  "2023-10-03": "JO",
  "2023-10-04": "BO",
  "2023-10-05": "SK",
  "2023-10-06": "KR",
  "2023-10-07": "BB",
  "2023-10-08": "NZ",
  "2023-10-09": "HU",
  "2023-10-10": "SV",
  "2023-10-11": "BN",
  "2023-10-12": "AL",
  "2023-10-13": "DJ",
  "2023-10-14": "KW",
  "2023-10-15": "GN",
  "2023-10-16": "MT",
  "2023-10-17": "TH",
  "2023-10-18": "CA",
  "2023-10-19": "AE",
  "2023-10-20": "GQ",
  "2023-10-21": "GB",
  "2023-10-22": "DO",
  "2023-10-23": "CD",
  "2023-10-24": "BD",
};

const noRepeatStartDate = DateTime.fromFormat("2022-05-01", "yyyy-MM-dd");

export function getDayString(shiftDayCount?: number) {
  return DateTime.now()
    .plus({ days: shiftDayCount ?? 0 })
    .toFormat("yyyy-MM-dd");
}

export function useTodays(dayString: string): [
  {
    country?: Country;
    guesses: Guess[];
  },
  (guess: Guess) => void,
  number,
  number
] {
  const [todays, setTodays] = useState<{
    country?: Country;
    guesses: Guess[];
  }>({ guesses: [] });

  const addGuess = useCallback(
    (newGuess: Guess) => {
      if (todays == null) {
        return;
      }

      const newGuesses = [...todays.guesses, newGuess];

      setTodays((prev) => ({ country: prev.country, guesses: newGuesses }));
      saveGuesses(dayString, newGuesses);
    },
    [dayString, todays]
  );

  useEffect(() => {
    const guesses = loadAllGuesses()[dayString] ?? [];
    const country = getCountry(dayString);

    setTodays({ country, guesses });
  }, [dayString]);

  const randomAngle = useMemo(
    () => seedrandom.alea(dayString)() * 360,
    [dayString]
  );

  const imageScale = useMemo(() => {
    const normalizedAngle = 45 - (randomAngle % 90);
    const radianAngle = (normalizedAngle * Math.PI) / 180;
    return 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  }, [randomAngle]);

  return [todays, addGuess, randomAngle, imageScale];
}

function getCountry(dayString: string) {
  const currentDayDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
  let pickingDate = DateTime.fromFormat("2022-03-21", "yyyy-MM-dd");
  let smallCountryCooldown = 0;
  let pickedCountry: Country | null = null;

  const lastPickDates: Record<string, DateTime> = {};

  do {
    smallCountryCooldown--;

    const pickingDateString = pickingDate.toFormat("yyyy-MM-dd");

    const forcedCountryCode = forcedCountries[dayString];
    const forcedCountry =
      forcedCountryCode != null
        ? countriesWithImage.find(
            (country) => country.code === forcedCountryCode
          )
        : undefined;

    const countrySelection =
      smallCountryCooldown < 0
        ? countriesWithImage
        : bigEnoughCountriesWithImage;

    if (forcedCountry != null) {
      pickedCountry = forcedCountry;
    } else {
      let countryIndex = Math.floor(
        seedrandom.alea(pickingDateString)() * countrySelection.length
      );
      pickedCountry = countrySelection[countryIndex];

      if (pickingDate >= noRepeatStartDate) {
        while (isARepeat(pickedCountry, lastPickDates, pickingDate)) {
          countryIndex = (countryIndex + 1) % countrySelection.length;
          pickedCountry = countrySelection[countryIndex];
        }
      }
    }

    if (areas[pickedCountry.code] < smallCountryLimit) {
      smallCountryCooldown = 7;
    }

    lastPickDates[pickedCountry.code] = pickingDate;
    pickingDate = pickingDate.plus({ day: 1 });
  } while (pickingDate <= currentDayDate);

  // Random Country selection based on now instead of date
  const countrySelection =
    smallCountryCooldown < 0 ? countriesWithImage : bigEnoughCountriesWithImage;
  const date = Date.now().toString();
  const countryIndex = Math.floor(
    seedrandom.alea(date)() * countrySelection.length
  );
  pickedCountry = countrySelection[countryIndex];

  return pickedCountry;
}

function isARepeat(
  pickedCountry: Country | null,
  lastPickDates: Record<string, DateTime>,
  pickingDate: DateTime
) {
  if (pickedCountry == null || lastPickDates[pickedCountry.code] == null) {
    return false;
  }
  const daysSinceLastPick = pickingDate.diff(
    lastPickDates[pickedCountry.code],
    "day"
  ).days;

  return daysSinceLastPick < 100;
}
