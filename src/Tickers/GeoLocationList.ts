// Todo: https://restcountries.com/v3.1/currency/
// use this api to get the geolocations

import { UriProvider } from "../UriProvider/UriProvider";
import FiatList from "./FiatTickers";

export default async function ConstructFiatGeoLocationList(): Promise<{ ticker: string; lat: number; long: number }[]> {
    const fiat = FiatList();
    const fiatList = Object.keys(fiat);

    const geoLocationFiatList: { ticker: string; lat: number; long: number }[] = [];

    await Promise.all(
        fiatList.map(async (fiat) => {
            try {
                const response = await fetch(UriProvider.getCurrencyInfomation(fiat));
                if (!response.ok) {
                    geoLocationFiatList.push({
                        ticker: fiat,
                        lat: 0,
                        long: 0
                    });
                    return;
                }
                const dataArr = await response.json();

                if (Array.isArray(dataArr)) {
                    for (const data of dataArr) {
                        const latLng = data?.capitalInfo?.latlng;
                        if (latLng && latLng.length === 2) {
                            geoLocationFiatList.push({
                                ticker: fiat,
                                lat: latLng[0],
                                long: latLng[1]
                            });
                            break;
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        })
    );

    return geoLocationFiatList;
}
