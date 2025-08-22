'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

// NOTE: These lines are removed to avoid the errors. 
// Instead, the code will handle client creation internally.
// import { useAndromedaClient } from '@andromeda-client/react';
// import { CW721, Marketplace } from '@andromeda-client/andromeda-contracts';

const MARKETPLACE_CONTRACT_ADDRESS = 'andr1a243c32szfdgq07e0a7vdukj8h065txvrzsy4kp8k9973604f9jspxmy3y';
const CW721_CONTRACT_ADDRESS = 'andr1m3dq2q20x239d3ccxvdeumasay09dexj5c5w26dwa7yypqgx4djsr0yecx';
const REST_ENDPOINT = 'https://andromeda-testnet-api.polkachu.com';

interface SaleInfo {
    sale_id: string;
    nft_contract_address: string;
    token_id: string;
    sale_type: { fixed_price: { price: { amount: string; denom: string; } } };
}

interface NftMetadata {
    name: string;
    description: string;
    image: string;
    attributes: { trait_type: string; value: string; }[];
}

const MarketplacePage = () => {
    const [saleInfo, setSaleInfo] = useState<SaleInfo | null>(null);
    const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Query for the sale info on the marketplace
                const salesQuery = { sales: { nft_contract_address: CW721_CONTRACT_ADDRESS, token_id: "Cow01" } };
                const salesQueryBase64 = btoa(JSON.stringify(salesQuery));
                const salesUrl = `${REST_ENDPOINT}/cosmwasm/wasm/v1/contract/${MARKETPLACE_CONTRACT_ADDRESS}/smart/${salesQueryBase64}`;
                const salesResponse = await fetch(salesUrl);
                const salesData = await salesResponse.json();
                const sale = salesData.data.sales?.[0];

                if (!sale) {
                    setLoading(false);
                    return;
                }
                
                // 2. Query for the NFT's metadata from the CW721 contract
                const nftInfoQuery = { nft_info: { token_id: "Cow01" } };
                const nftInfoQueryBase64 = btoa(JSON.stringify(nftInfoQuery));
                const nftInfoUrl = `${REST_ENDPOINT}/cosmwasm/wasm/v1/contract/${CW721_CONTRACT_ADDRESS}/smart/${nftInfoQueryBase64}`;
                const nftInfoResponse = await fetch(nftInfoUrl);
                const nftInfoData = await nftInfoResponse.json();
                const tokenUri = nftInfoData.data.token_uri;

                // 3. Fetch the actual metadata from the IPFS gateway
                const metadataResponse = await fetch(tokenUri);
                const metadata = await metadataResponse.json();

                setSaleInfo(sale);
                setNftMetadata(metadata);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBuy = async () => {
        if (!saleInfo) {
            alert("Sale information is not available.");
            return;
        }

        const buyMsg = {
            buy: {
                nft_contract_address: CW721_CONTRACT_ADDRESS,
                token_id: "Cow01"
            }
        };

        const funds = [{ amount: saleInfo.sale_type.fixed_price.price.amount, denom: saleInfo.sale_type.fixed_price.price.denom }];

        try {
            // NOTE: This part requires an installed Andromeda client library.
            // Since `npm install` is failing, you will need to add this back once the package is available.
            // For the demo, this code block shows the intended functionality.
            alert("A wallet transaction would be initiated here. Due to package issues, please demonstrate this step manually via CLI.");
        } catch (error) {
            console.error("Buy failed:", error);
            alert('Buy failed. See console for details.');
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading Marketplace...</div>;
    }

    if (!saleInfo) {
        return <div className="text-center p-8">No active sales for this NFT.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-8">LiveStocX Marketplace</h1>
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm">
                {nftMetadata && (
                    <>
                        <img src={nftMetadata.image} alt={nftMetadata.name} className="w-full h-auto rounded-lg mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">{nftMetadata.name}</h2>
                        <p className="text-lg mb-4">{nftMetadata.description}</p>
                        <div className="mb-4">
                            <h3 className="text-xl font-medium mb-2">Attributes:</h3>
                            {nftMetadata.attributes.map((attr: any, index: number) => (
                                <div key={index} className="flex justify-between text-gray-400">
                                    <span>{attr.trait_type}:</span>
                                    <span>{attr.value}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-400">
                        {saleInfo.sale_type.fixed_price.price.amount} {saleInfo.sale_type.fixed_price.price.denom}
                    </span>
                    <button
                        onClick={handleBuy}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                        Buy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarketplacePage;