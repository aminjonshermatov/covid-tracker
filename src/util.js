import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
    cases: {
        multiplier: 400
    },
    recovered: {
        multiplier: 800
    },
    deaths: {
        multiplier: 1200
    }
}

export const sortData = data => {
    const sortedData = [...data];

    sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));

    return sortedData;
};

export const prettyPrintStat = stat => {
    return stat ? `+${numeral(stat).format("0,0a")}` : "+0";
}

export const showDataOnMap = (data, casesType) => {
    console.log(casesType);

    const circles = data.map((country, index) => (<Circle
            key={index}
            center={[country?.countryInfo?.lat, country?.countryInfo?.long]}
            className={casesType}
            fillOpacity={0.4}
            radius={
                Math.sqrt(country[casesType] / 5) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }} />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ));
    return circles;
};