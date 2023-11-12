import React, { useEffect, useState } from 'react'
import '../styles/tables.css';
import axios from 'axios';

const Table = () => {

    const [cryptoData, setCryptoData] = useState([]);
    const [highlight, setHighlight] = useState([]);
    useEffect(() => {
        async function fetchPrices() {
            try {
                const response = await fetch('https://api.coincap.io/v2/assets');
                const data = await response.json();
                setCryptoData(data.data);
                // console.log(data.data)
                const newHighlight = data.data
                    .filter((crypto) => parseFloat(crypto.changePercent24Hr) < 0)
                    .map((crypto) => crypto.id);
                setHighlight(newHighlight);
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
            }
        }

        fetchPrices();
        const interval = setInterval(fetchPrices, 3000);
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='table'>
            <div className="blue-div"></div>
            <table>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Market Cap</th>
                    <th>Supply</th>
                    <th>Volume</th>
                    <th>Change</th>
                </tr>
                {cryptoData.map((crypto, index) => (
                    <tr key={index}>
                        <td>{crypto.rank}</td>
                        <td>{crypto.name}</td>
                        <td>{crypto.symbol}</td>
                        <td>{Number(crypto.priceUsd).toFixed(2)}</td>
                        <td>{Number(crypto.marketCapUsd).toFixed(2)}</td>
                        <td>{Number(crypto.supply).toFixed(2)}</td>
                        <td>{Number(crypto.volumeUsd24Hr).toFixed(2)}</td>
                        <td 
                         className={
                            highlight.includes(crypto.id)
                                ? parseFloat(crypto.changePercent24Hr) > 0
                                    ? 'positive-change'
                                    : 'negative-change'
                                : ''
                        }
                        >{Number(crypto.changePercent24Hr).toFixed(3)}%</td>
                    </tr>
                ))}

            </table>
        </div>
    )
}

export default Table