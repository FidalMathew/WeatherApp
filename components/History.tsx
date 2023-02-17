import React, { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
// import 

function History(props: any) {

    interface IForecast {
        date: string;
        condition: string;
        maxtemp_c: number;
        mintemp_c: number;
        maxtemp_f: number;
        mintemp_f: number;
    }

    const [history, setHistory] = useState<IForecast[]>([])
    const [historydays, setHistorydays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])


    const fetchHistory = async (dt: string) => {
        console.log("DASda", props.finalCity);
        if (props.finalCity === "") return;
        try {
            const res = await fetch(`https://api.weatherapi.com/v1/history.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${props.finalCity}&dt=${dt}`);
            const result = await res.json();
            let val = {
                date: result.forecast.forecastday[0].date.toString(),
                condition: result.forecast.forecastday[0].day.condition.text,
                maxtemp_c: result.forecast.forecastday[0].day.maxtemp_c,
                mintemp_c: result.forecast.forecastday[0].day.mintemp_c,
                maxtemp_f: result.forecast.forecastday[0].day.maxtemp_f,
                mintemp_f: result.forecast.forecastday[0].day.mintemp_f
            }
            // console.log(val);
            console.log("DASda", val);
            setHistory([...history, val])
        } catch (error) {
            console.log(error);
        }
    }

    historydays.map((item, index) => {
        let dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - item);
        let date = dateObj.toISOString().slice(0, 10);
        // console.log(date);

        fetchHistory(date.toString())
        return (
            <div key={index}>
                <h1>{date}</h1>
            </div>
        )
    })

    return (
        <div>
            <h1> History </h1>
            <div>
                {history.map((item, index) => {
                    return <div key={index} className={styles.forecastCard}>
                        <div className={styles.dayName}> {item.date} </div>
                        {/* <Image src={props.weatherImg(item.condition)} alt={item.condition} /> */}
                        <div > {item.condition}</div>
                        <div className={styles.condition}>

                            {
                                props.isCelsius ?
                                    <div> {item.maxtemp_c}°/ {item.mintemp_c}° </div>
                                    : <div> {item.maxtemp_f}°/ {item.mintemp_f}° </div>
                            }

                        </div>
                    </div>
                })}

            </div>
        </div>
    )
}

export default History