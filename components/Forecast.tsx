import styles from '../styles/Home.module.css'

function Forecast(props: any) {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return (
    <div className={styles.forecastContainer}>
        {props.forecast.map((item: any, index: number) => {
            
            let d = new Date(item.date.toString());
            let dayName = days[d.getDay()];

            return (
                <div key={index} className={styles.forecastCard}>
                    <div className={styles.dayName}> { index==0?'Today':(index==1?'Tommorrow':dayName)} </div>
                   <div> {item.condition}</div>
                
                {
                    props.isCelsius?
                    <div> {item.maxtemp_c}° {item.mintemp_c}° </div>
                    :<div> {item.maxtemp_f}° {item.mintemp_f}° </div>
                }

                </div>
            )
        })
            
        }
    </div>
  )
}

export default Forecast