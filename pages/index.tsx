import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Content from '../components/Content'
import Forecast from '../components/Forecast'
import History from '../components/History'
import styles from '../styles/Home.module.css'

import sunnyImg from '../assets/sunny.png'
import cloudyImg from '../assets/cloudy.png'
import rainyImg from '../assets/rainy.png'
import snowyImg from '../assets/snowy.png'
import thunderstormImg from '../assets/thunderstorm.png'
import mistImg from '../assets/mist.png'

import arrowDown from '../assets/arrow-down.png'

const Home: NextPage = () => {

  interface IWeather {
    temp_c: number;
    temp_f: number;
    condition: string;
    wind_kph: number;
    humidity: number;
    finalCity: string;
  }

  interface IForecast {
    date: string;
    condition: string;
    maxtemp_c: number;
    mintemp_c: number;
    maxtemp_f: number;
    mintemp_f: number;
  }

  const [city, setCity] = useState<string>("");
  const [finalCity, setFinalCity] = useState<string>("");


  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [cities, setCities] = useState<string[]>([]); // ["London", "New York", "Tokyo" ]


  const [forecast, setForecast] = useState<IForecast[]>([]);

  const [weather, setWeather] = useState<IWeather>({
    temp_c: 0, temp_f: 0, condition: "", wind_kph: 0, humidity: 0, finalCity: ""
  })

  const updateCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  }

  const submitCity = () => {
    setFinalCity(city);
    setCity("");
  }

  useEffect(() => {
    const stored = localStorage.getItem("isCelsius");
    setIsCelsius(stored ? JSON.parse(stored) : isCelsius);
  }, [isCelsius]);


  useEffect(() => {
    const fetchForcast = async () => {
      try {
        if (finalCity === "") return;
        const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${finalCity}&days=5&aqi=no&alerts=no`);
        const result = await res.json()
        setWeather({
          temp_c: result.current.temp_c,
          temp_f: result.current.temp_f,
          condition: result.current.condition.text,
          wind_kph: result.current.wind_kph,
          humidity: result.current.humidity,
          finalCity: finalCity
        })

        setForecast(result.forecast.forecastday.map((item: any) => {
          return ({
            date: item.date,
            condition: item.day.condition.text,
            maxtemp_c: item.day.maxtemp_c,
            mintemp_c: item.day.mintemp_c,
            maxtemp_f: item.day.maxtemp_f,
            mintemp_f: item.day.mintemp_f
          })
        }))
        setIsError(false);

      } catch (error) {
        console.log(error);
        setIsError(true);
      }
    }
    fetchForcast();

  }, [finalCity])


  useEffect(() => {

    const fetchCities = async () => {

      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities");
        const result = await res.json();
        const cities = result.data.map((item: any) => item.city);
        // console.log(cities);
        setCities(cities);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCities();
  }, [])


  const weatherImage = (str: string) => {

    str = str.toLowerCase();
    if (str.includes("sunny") || str.includes("clear")) return sunnyImg;
    if (str.includes("cloudy") || str.includes("overcast")) return cloudyImg;
    if (str.includes("rainy") || str.includes("rain")) return rainyImg;
    if (str.includes("snowy") || str.includes("snow")) return snowyImg;
    if (str.includes("thunderstorm")) return thunderstormImg;
    if (str.includes("mist")) return mistImg;
    return sunnyImg;

  }



  return (
    <div className={styles.container}>
      <div className={styles.home}>
        {/* <Heading/> */}
        <div className={styles.heading}>
          <div className={styles.head1}> WeatherAPI</div>
          <div className={styles.search}>
            <input type="text" className={styles.input} onChange={updateCity} value={city} list="citymap" />
            <datalist id="citymap" >
              {cities.map((item, index) => <option key={index} value={item} />)}
            </datalist>
            <button className={styles.searchBtn} onClick={submitCity}>

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
        </div>

        {isError &&
          <div className={styles.error}>Please enter a valid city
          </div>}
        <Content weather={weather} isCelsius={isCelsius} setIsCelsius={setIsCelsius} weatherImg={weatherImage} />
        <Forecast forecast={forecast} isCelsius={isCelsius} weatherImg={weatherImage} />
        {
          finalCity && (showHistory ?
            <History /> :
            <div className={styles.historyBtn} onClick={() => setShowHistory(true)}>
              <div className={styles.historyText}>History</div>
              <Image src={arrowDown} alt="arrow-down" width={20} height={20} />
            </div>)
        }
      </div>
    </div>
  )
}

export default Home