'use client'
import { useState, useEffect } from 'react';
import { trpcReactClient } from '@/lib/trpc/client';
import { useAndromedaStore, connectAndromedaClient } from '@/zustand/andromeda';
import { MARKETPLACE } from '@/lib/andrjs/ados/marketplace';
import { Coin } from '@cosmjs/proto-signing';
import { CopyButton } from '@/components/ui/copy-button';

const MarketplacePage = () => {
    const { client: andromedaClient, isConnected, connectedChain, accounts } = useAndromedaStore();
    const [loading, setLoading] = useState(true);
    const [txState, setTxState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const trpcContext = trpcReactClient.useContext(); // Get tRPC context for refetching

    // Get the connected account address
    const connectedAddress = accounts[0]?.address;

    // Use environment variables for contract addresses
    const marketplaceContractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || '';
    const cw721ContractAddress = process.env.NEXT_PUBLIC_CW721_CONTRACT_ADDRESS || '';
    const tokenId = "Cow01"; // The specific token for sale

    // Fetch sale information using tRPC
    const { data: saleInfo, error: saleInfoError } = trpcReactClient.ado.marketplace.getLatestSaleState.useQuery({
        "chain-identifier": connectedChain || "",
        "contract-address": marketplaceContractAddress,
        tokenAddress: cw721ContractAddress,
        tokenId: tokenId,
    }, { enabled: !!connectedChain });

    // Fetch NFT info using tRPC
    const { data: nftInfo, error: nftInfoError } = trpcReactClient.ado.cw721.getTokenInfo.useQuery({
        "chain-identifier": connectedChain || "",
        "contract-address": cw721ContractAddress,
        tokenId: tokenId,
    }, { enabled: !!connectedChain });

    // Fetch metadata from the token URI
    const { data: nftMetadata, error: nftMetadataError } = trpcReactClient.ado.cw721.fetchTokenData.useQuery({
        token_uri: nftInfo?.token_uri ?? "",
    }, {
        enabled: !!nftInfo?.token_uri,
    });

    // Manage loading state
    useEffect(() => {
      if (saleInfo !== undefined || saleInfoError) {
        setLoading(false);
      }
    }, [saleInfo, saleInfoError]);


    /**
     * Handles the entire buy process, from connecting the wallet to executing the transaction.
     */
    const handleBuy = async () => {
        if (!isConnected || !andromedaClient) {
            try {
                await connectAndromedaClient(process.env.NEXT_PUBLIC_CHAIN_IDENTIFIER || "");
                alert("Wallet connected! Please click 'Buy' again to complete the purchase.");
            } catch (error) {
                console.error("Failed to connect wallet:", error);
                alert("Failed to connect wallet. Please check your Keplr extension and try again.");
            }
            return;
        }

        if (!saleInfo) {
            alert("Sale information is not available for this item.");
            return;
        }

        setTxState('pending');

        try {
            const msg = MARKETPLACE.buyMsg({
                tokenAddress: cw721ContractAddress,
                tokenId: tokenId
            });

            const funds: Coin[] = [{
                amount: saleInfo.price,
                denom: saleInfo.coin_denom
            }];

            const txResult = await andromedaClient.execute(
                marketplaceContractAddress,
                msg,
                undefined,
                "Buy LiveStocX NFT via Marketplace",
                funds
            );

            console.log("Transaction successful:", txResult);
            setTxState('success');
            alert(`Purchase successful! Transaction Hash: ${txResult.transactionHash}`);
        } catch (error: any) {
            console.error("Purchase failed:", error);
            setTxState('error');
            if (error.message.includes("Request rejected")) {
                alert("Transaction rejected. You cancelled the request in your wallet.");
            } else {
                alert(`An error occurred during purchase: ${error.message}`);
            }
        } finally {
            // ALWAYS refetch the sale info to update the UI
            await trpcContext.ado.marketplace.getLatestSaleState.invalidate();
            
            if(txState !== 'success') {
                setTimeout(() => setTxState('idle'), 3000);
            }
        }
    };

    const getButtonText = () => {
        if (!isConnected) return "Connect Wallet to Buy";
        if (txState === 'pending') return "Processing...";
        if (txState === 'success') return "Purchased!";
        return "Buy Now";
    }

    if (loading) {
        return <div className="text-center p-8">Loading Marketplace...</div>;
    }

    // Updated check: If the sale is executed or there's an error, show not for sale.
    if (saleInfoError || !saleInfo || saleInfo.status === 'executed') {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <h1 className="text-4xl font-bold mb-8">LiveStocX Marketplace</h1>
                <div className="bg-gray-800 rounded-lg p-6 max-w-sm text-center">
                    {nftMetadata && <img src={nftMetadata.image} alt={nftMetadata.name} className="w-full h-auto rounded-lg mb-4" />}
                    <h2 className="text-2xl font-semibold mb-2">{nftMetadata?.name ?? 'NFT'}</h2>
                    <p className="text-xl text-yellow-400">This item has been sold and is no longer available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-4">LiveStocX Marketplace</h1>
            
            {isConnected && connectedAddress && (
                <div className="flex items-center gap-2 mb-8 p-2 bg-gray-800 rounded-lg border border-gray-700">
                    <span className="text-sm text-gray-400">Connected as:</span>
                    <span className="text-sm text-green-400 font-mono">{connectedAddress}</span>
                    <CopyButton text={connectedAddress} size="sm" variant="ghost" />
                </div>
            )}

            <div className="bg-gray-800 rounded-lg p-6 max-w-sm">
                {nftMetadata ? (
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
                ) : (
                    <div className="w-full h-64 bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                )}
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-400">
                        {saleInfo.price} {saleInfo.coin_denom}
                    </span>
                    <button
                        onClick={handleBuy}
                        disabled={txState === 'pending' || txState === 'success'}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {getButtonText()}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarketplacePage;