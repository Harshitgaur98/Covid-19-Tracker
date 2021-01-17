import React, { useMemo } from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import { ShowDataOnMap } from "./util";
function Map({ countries, casesType, center, zoom, mapCountryRef }) {
    function CovidPointerMap() {
        const displayMap = useMemo(
            () => (
                <LeafletMap center={center} zoom={zoom}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* loop through countries and draw circles on the screen */}
                    <ShowDataOnMap
                        key={countries}
                        countries={countries}
                        casesType={casesType}
                        mapCountryRef={Number(mapCountryRef)}
                    />
                </LeafletMap>
            ),
            []
        );

        return <>{displayMap}</>;
    }

    return (
        <div className="map">
            <CovidPointerMap />
        </div>
    );
}

export default Map;
