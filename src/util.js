import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
    cases: {
        multiplier: 400,
        style: {
            color: "#CC1034",
            fillColor: '#CC1034',
            fillOpacity: 0.4
        }
    },
    recovered: {
        multiplier: 800,
        style: {
            color: "#7dd71d",
            fillColor: '#7dd71d',
            fillOpacity: 0.4
        }
    },
    deaths: {
        multiplier: 1200,
        style: {
            color: "#fb4443",
            fillColor: '#fb4443',
            fillOpacity: 0.4
        }
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

export const showDataOnMap = (data, casesType = 'cases') => {
    console.log(casesTypeColors[casesType]);
    return data.map(country => (<Circle
            center={[country?.countryInfo?.lat, country?.countryInfo?.long]}
            style={casesTypeColors[casesType].style}
            radius={
                Math.sqrt(country[casesType] / 10) * casesTypeColors[casesType].multiplier
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
    ))};