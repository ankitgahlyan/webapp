import { observer } from 'mobx-react-lite'
import { Model } from './Model'

// import Map, { Marker } from 'react-map-gl/maplibre';
// import 'maplibre-gl/dist/maplibre-gl.css';

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

interface Props {
    model: Model
}

type Location = {
    id: string;
    lat: number;
    lon: number;
    title: string;
    owner: string;
};

function BlockchainLayer() {
    const map = useMap();
    const [locations, setLocations] = useState<Location[]>([]);

    async function loadLocations() {
        const bounds = map.getBounds();

        // const bbox = [
        //     bounds.getWest(),
        //     bounds.getSouth(),
        //     bounds.getEast(),
        //     bounds.getNorth(),
        // ].join(",");

        // const data: Location[] = await fetch(
        //     `https://api.example.com/map?bbox=${bbox}`
        // ).then((r) => r.json());

        // setLocations(data);
        // const geoJsonLayer = L.geoJSON(data, {
        //     pointToLayer: (_, latlng) =>
        //         L.circleMarker(latlng, {
        //             radius: 6,
        //         }),
        // });

        // geoJsonLayer.addTo(map);
    }

    useEffect(() => {
        loadLocations();

        map.on("moveend", loadLocations);

        return () => {
            map.off("moveend", loadLocations);
        };
    }, []);

    return (
        <>
            {locations.map((loc) => (
                <Marker
                    key={loc.id}
                    position={[loc.lat, loc.lon]}
                >
                    <Popup>
                        <h3>{loc.title}</h3>
                        <p>Owner: {loc.owner}</p>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

const Referral = observer(({ model }: Props) => {

    return <>
        <h1 className='text-white'>explore source code @ <a href="https://github.com/ankitgahlyan/webapp">GitHub</a></h1>

        {/* <MapContainer
            center={[28.6139, 77.209]}
            zoom={20}
            style={{
                height: "fit-content",
                // height: "100vh",
                width: "fit-content",
            }}
        >
            <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer> */}

        {/* <div id="map" className='text-white'>Leaflet</div> */}

        {/* <Map
            initialViewState={{
                latitude: 37.8,
                longitude: -122.4,
                zoom: 14
            }}
            style={{ width: 800, height: 600 }}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
            <Marker longitude={-122.4} latitude={37.8} color="red" />
        </Map> */}
    </>

    // const root = createRoot(document.body.appendChild(document.createElement('div')));
    // root.render(<Root />);


    // return (
    //     <div className='mx-auto w-full max-w-(--breakpoint-lg) p-4 pb-32 font-body text-brown dark:text-dark-50'>
    //         <p className='px-8 pt-4 text-center text-3xl font-bold'>What Can I Do with hTON?</p>
    //         <p className='mx-auto my-8 max-w-lg px-8 text-center text-xl'>
    //             Maximize the potential of your capital with hTON in TON Settings protocols
    //         </p>

    //         <div className='m-8 mt-32 flex flex-col items-start gap-4 sm:flex-row'>
    //             <div className='flex-1 sm:max-w-64'>
    //                 <h3 className='py-4 text-2xl font-bold'>Swap on DEXs</h3>
    //                 <p className='my-4 text-lg'>hTON can be traded on DEXs for other tokens.</p>
    //             </div>
    //             <div className='flex w-full flex-1 flex-col flex-wrap items-center justify-center gap-4 md:flex-row'>
    //                 <div className='flex w-44 flex-none flex-col rounded-2xl border border-dark-600 border-opacity-50 bg-milky bg-opacity-50 p-4 text-center shadow-md dark:border-milky dark:border-opacity-50 dark:bg-dark-700'>
    //                     <img src={dedust} className='mx-auto h-12' />
    //                     <p className='m-4 font-medium'>DeDust</p>
    //                     <a
    //                         className='mx-4 rounded-xl bg-c6 p-2 text-white dark:text-dark-600'
    //                         href={model.dedustSwapUrl}
    //                         target='hipo_dedust'
    //                     >
    //                         Swap now
    //                     </a>
    //                 </div>
    //                 <div className='flex w-44 flex-none flex-col rounded-2xl border border-dark-600 border-opacity-50 bg-milky bg-opacity-50 p-4 text-center shadow-md dark:border-milky dark:border-opacity-50 dark:bg-dark-700'>
    //                     <img src={ston} className='mx-auto h-12' />
    //                     <p className='m-4 font-medium'>STON.fi</p>
    //                     <a
    //                         className='mx-4 rounded-xl bg-c6 p-2 text-white dark:text-dark-600'
    //                         href={model.stonSwapUrl}
    //                         target='hipo_ston'
    //                     >
    //                         Swap now
    //                     </a>
    //                 </div>
    //                 <div className='flex w-44 flex-none flex-col rounded-2xl border border-dark-600 border-opacity-50 bg-milky bg-opacity-50 p-4 text-center shadow-md dark:border-milky dark:border-opacity-50 dark:bg-dark-700'>
    //                     <img src={tonco} className='mx-auto h-12' />
    //                     <p className='m-4 font-medium'>TONCO</p>
    //                     <a
    //                         className='mx-4 rounded-xl bg-c6 p-2 text-white dark:text-dark-600'
    //                         href={model.toncoSwapUrl}
    //                         target='hipo_tonco'
    //                     >
    //                         Swap now
    //                     </a>
    //                 </div>
    //             </div>
    //         </div>

    //         <div className='m-8 mt-48 flex flex-col items-start gap-4 sm:flex-row'>
    //             <div className='flex-1 sm:max-w-64'>
    //                 <h3 className='py-4 text-2xl font-bold'>Provide Liquidity</h3>
    //                 <p className='my-4 text-lg'>Use hTON to provide liquidity on DEXs, earning fees, and history.</p>
    //             </div>
    //             <div className='flex w-full flex-1 flex-col flex-wrap items-center justify-center gap-4 md:flex-row'>
    //                 <div className='flex w-44 flex-none flex-col rounded-2xl border border-dark-600 border-opacity-50 bg-milky bg-opacity-50 p-4 text-center shadow-md dark:border-milky dark:border-opacity-50 dark:bg-dark-700'>
    //                     <img src={dedust} className='mx-auto h-12' />
    //                     <p className='m-4 font-medium'>DeDust</p>
    //                     <a
    //                         className='mx-4 rounded-xl bg-c6 p-2 text-white dark:text-dark-600'
    //                         href={model.dedustPoolUrl}
    //                         target='hipo_dedust'
    //                     >
    //                         Earn now
    //                     </a>
    //                 </div>
    //                 <div className='flex w-44 flex-none flex-col rounded-2xl border border-dark-600 border-opacity-50 bg-milky bg-opacity-50 p-4 text-center shadow-md dark:border-milky dark:border-opacity-50 dark:bg-dark-700'>
    //                     <img src={ston} className='mx-auto h-12' />
    //                     <p className='m-4 font-medium'>STON.fi</p>
    //                     <a
    //                         className='mx-4 rounded-xl bg-c6 p-2 text-white dark:text-dark-600'
    //                         href={model.stonPoolUrl}
    //                         target='hipo_ston'
    //                     >
    //                         Earn now
    //                     </a>
    //                 </div>
    //                 <div className='flex w-44 flex-none flex-col rounded-2xl border border-dark-600 border-opacity-50 bg-milky bg-opacity-50 p-4 text-center shadow-md dark:border-milky dark:border-opacity-50 dark:bg-dark-700'>
    //                     <img src={tonco} className='mx-auto h-12' />
    //                     <p className='m-4 font-medium'>TONCO</p>
    //                     <a
    //                         className='mx-4 rounded-xl bg-c6 p-2 text-white dark:text-dark-600'
    //                         href={model.toncoPoolUrl}
    //                         target='hipo_tonco'
    //                     >
    //                         Earn now
    //                     </a>
    //                 </div>
    //             </div>
    //         </div>

    //         <div className='m-8 mt-48 flex flex-col items-start gap-4 sm:flex-row'>
    //             <div className='flex-1 sm:max-w-64'>
    //                 <h3 className='py-4 text-2xl font-bold'>Ton Wallets</h3>
    //                 <p className='my-4 text-lg'>Partner wallets supporting hTON and HPO.</p>
    //             </div>
    //             <div className='flex w-full flex-1 flex-col flex-wrap items-center justify-center gap-4 md:flex-row'>
    //                 <div className='flex w-44 flex-none flex-col rounded-2xl border border-dark-600 border-opacity-50 bg-milky bg-opacity-50 p-4 text-center shadow-md dark:border-milky dark:border-opacity-50 dark:bg-dark-700'>
    //                     <img src={tonspace} className='mx-auto h-12' />
    //                     <p className='m-4 font-medium'>Ton Space</p>
    //                     <a
    //                         className='mx-4 rounded-xl bg-c6 p-2 text-white dark:text-dark-600'
    //                         href={model.tonspaceUrl}
    //                         target='hipo_tonspace'
    //                     >
    //                         Use Now
    //                     </a>
    //                 </div>
    //                 <div className='flex w-44 flex-none flex-col rounded-2xl border border-dark-600 border-opacity-50 bg-milky bg-opacity-50 p-4 text-center shadow-md dark:border-milky dark:border-opacity-50 dark:bg-dark-700'>
    //                     <img src={mtw} className='mx-auto h-12' />
    //                     <p className='m-4 whitespace-nowrap font-medium'>MyTonWallet</p>
    //                     <a
    //                         className='mx-4 rounded-xl bg-c6 p-2 text-white dark:text-dark-600'
    //                         href={model.mtwUrl}
    //                         target='hipo_mtw'
    //                     >
    //                         Use Now
    //                     </a>
    //                 </div>
    //             </div>
    //         </div>

    //         {/* <div className='m-8 mt-48 flex flex-col items-start gap-4 sm:flex-row'>
    //             <div className='flex-1 sm:max-w-64'>
    //                 <h3 className='py-4 text-2xl font-bold'>Take a Loan</h3>
    //                 <p className='my-4 text-lg'>Use hTON as collateral for a loan.</p>
    //             </div>
    //             <div className='flex w-full flex-1 flex-col flex-wrap items-center justify-center gap-4 md:flex-row'>
    //                 <div className='flex w-44 flex-none flex-col rounded-2xl border border-dark-600 border-opacity-50 bg-milky bg-opacity-50 p-4 text-center opacity-50 shadow-md dark:border-milky dark:border-opacity-50 dark:bg-dark-700'>
    //                     <img src={evaa} className='mx-auto h-12' />
    //                     <p className='m-4 font-medium'>Evaa</p>
    //                     <a
    //                         className='mx-4 rounded-xl bg-c6 p-2 text-white dark:text-dark-600'
    //                         href={model.evaaLoanUrl}
    //                         target='hipo_evaa'
    //                     >
    //                         Take now
    //                     </a>
    //                     Coming Soon
    //                 </div>
    //             </div>
    //         </div> */}
    //     </div>
    // )
})

export default Referral
