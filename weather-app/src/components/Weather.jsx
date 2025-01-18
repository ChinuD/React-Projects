import React, {useState, useEffect, useRef } from 'react'
import Search from '../assets/search.png'
import clear from '../assets/clear.png'
import cloud from '../assets/cloud.png'
import drizzle from '../assets/drizzle.png'
import rain from '../assets/rain.png'
import humidity from '../assets/humidity.png'
import snow from '../assets/snow.png'
import wind from '../assets/wind.png'

const Weather = () => {

    const inputRef = useRef()
    const [weatherData,setWeatherData] = useState(false)

    const allIcons = {
        "01d": clear,
        "01n": clear,
        "02n": cloud,
        "02n": cloud,
        "03d": cloud,
        "03n": cloud,
        "04d": drizzle,
        "04n": drizzle,
        "09d" : rain,
        "09n" : rain,
        "10d" : rain,
        "10n" : rain,
        "13d" : snow,
        "13n" : snow,
    }

    const search = async (city) => {
        if(city === ""){
            alert("Enter City Name");
            return;
        }

        try{
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();

            if(!response.ok){
                alert(data.message)
                return;
            }
            
            const icon = allIcons[data.weather[0].icon] || clear;
            
            console.log(data);
            setWeatherData({
                humidity: data.main.humidity,
                wind: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon : icon
            })
            
        }catch(error){
            setWeatherData(false);
            console.error("Error in fetching error data")
        }
    }

    useEffect(()=>{
        search("Pune")
    },[])

  return (
    <div className='place-self-center p-10 rounded-[28px] bg-orange-400 flex flex-col items-center'>
        <div className="flex items-center gap-3">
            <input type="text" ref={inputRef} placeholder='search' className='h-12 border-none outline-none rounded-xl pl-6 text-blue-600 text-2xl' />
            <img src={Search} className='w-12 p-3 bg-white rounded-full' onClick={() => search(inputRef.current.value)} />
        </div>

        {weatherData?
        <>

        <img src={weatherData.icon} className='w-40 mx-8' alt="" />
        <p className='text-white text-4xl leading-none'>{weatherData.temperature} °C</p>
        <p className='text-white text-4xl'>{weatherData.location}</p>
        <div className="flex flex-row m-4 w-full mx-10 text-white justify-between">
            <div className="flex items-center gap-3 text-xl">
                <img src={humidity} className='w-6 mx-2' alt="" />
                <div>
                    <p>{weatherData.humidity}</p>
                    <span className='block text-xl'>Humidity</span>
                </div>
            </div>
            <div className="flex items-center gap-3 text-xl">
                <img src={wind} className='w-6 mx-2' alt="" />
                <div>
                    <p>{weatherData.wind}km/h</p>
                    <span className='block text-xl'>Wind Speed</span>
                </div>
            </div>
        </div>
        </>:
        <>

        </>}


    </div>
  )
}

export default Weather