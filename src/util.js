import React, { useRef, useEffect } from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
    cases: {
        hex: "#cc1034",
        multiplier: 400,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 500,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 1200,
    },
};

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    });
    return sortedData;
};

export const preetyPrintStat = (stat) =>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";

//Draw circles on the map with intrective tooltip
export const ShowDataOnMap = ({ countries, casesType, mapCountryRef }) => {
    let countriesShowData = countries.map((country, index) =>
        country.country !== "Worldwide" ? (
            <PointMarker
                key={
                    country.countryInfo.lat +
                    " " +
                    country.countryInfo.long +
                    " " +
                    index
                }
                country={country}
                center={[country.countryInfo.lat, country.countryInfo.long]}
                fillOpacity={0.4}
                color={casesTypeColors[casesType].hex}
                fillColor={casesTypeColors[casesType].hex}
                radius={
                    Math.sqrt(country[casesType]) *
                    casesTypeColors[casesType].multiplier
                }
                openPopup={mapCountryRef === index}
            />
        ) : null
    );

    return countriesShowData;
};

function PointMarker(props) {
    const markerRef = useRef(null);
    const {
        center,
        country,
        fillOpacity,
        color,
        fillColor,
        radius,
        openPopup,
    } = props;

    useEffect(() => {
        if (openPopup) {
            markerRef.current.openPopup();
        }
    }, [openPopup]);

    return (
        <Circle
            ref={markerRef}
            center={center}
            fillOpacity={fillOpacity}
            color={color}
            fillColor={fillColor}
            radius={radius}
        >
            <Popup style={{ color: "#f1f1f1" }}>
                <div className="info-container">
                    <div
                        className="info-flag"
                        style={{
                            backgroundImage: `url(${country.countryInfo.flag})`,
                        }}
                    ></div>
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">
                        Cases: {numeral(country.cases).format("0,0")}
                    </div>
                    <div className="info-recovered">
                        Recovered: {numeral(country.recovered).format("0,0")}
                    </div>
                    <div className="info-deaths">
                        Deaths: {numeral(country.deaths).format("0,0")}
                    </div>
                </div>
            </Popup>
        </Circle>
    );
}
