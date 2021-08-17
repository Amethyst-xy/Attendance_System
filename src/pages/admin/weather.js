import {useState,useEffect} from "react";

export default function Weather(){
    const [weather, setweather] = useState({});

    useEffect(() => {
        fetch('https://restapi.amap.com/v3/weather/weatherInfo?key=72999d8b7494cbdcf6b1851224fe779a&city=510100')
        .then(res=>res.json())
        .then(res=>{
            setweather(res.lives[0])
        })
    }, [])

    return weather;
}