import React, { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import sunnyImg from '../assets/sunny.png'
import Image from 'next/image';

interface IWeather {
    temp_c: number;
    temp_f: number;
    condition: string;
    wind_kph: number;
    humidity: number;
}

function Content(props: any) {


    // console.log(props.weather)
    const changeTemp = () => {
        props.setIsCelsius(!props.isCelsius);
        localStorage.setItem('isCelsius', JSON.stringify(!props.isCelsius));
    }

    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div>
            <div className={styles.weatherDetails}>
                <Image src={props.weatherImg(props.weather.condition)} alt={props.weather.condition} />
                <div>
                    {
                        props.isCelsius ? <div className={styles.head1}> {props.weather.temp_c} °C<button className={styles.tempButton} onClick={changeTemp}>|°F</button>  </div>
                            : <div className={styles.head1}> {props.weather.temp_f} °F <button className={styles.tempButton} onClick={changeTemp}>|°C</button>  </div>
                    }
                    <div className={styles.city}> {capitalizeFirstLetter(props.weather.finalCity)} </div>

                </div>
                <div className={styles.values}>
                    <div>Condition: {props.weather.condition}</div>
                    <div>Humidity: {props.weather.humidity}%</div>
                    <div>Wind Speed: {props.weather.wind_kph}kph</div>
                </div>
            </div>

        </div>
    )
}

export default Content