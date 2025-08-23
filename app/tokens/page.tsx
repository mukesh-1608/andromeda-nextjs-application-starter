'use client'
import { useState, useEffect } from 'react';
import { useAndromedaStore, connectAndromedaClient } from '@/zustand/andromeda';
import { Coin } from '@cosjs/proto-signing';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trpcReactClient } from '@/lib/trpc/client';

// This is a new component for displaying each token
const TokenCard = ({ saleContractAddress, tokenSymbol, tokenName, description, imageUrl }) => {
    const { client: andromedaClient, isConnected, connectedChain } = useAndromedaStore();
    const [quantity, setQuantity] = useState(1);
    const [totalCost, setTotalCost] = useState(0);
    const [txState, setTxState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const trpcContext = trpcReactClient.useContext();

    const { data: campaignInfo, isLoading, error } = trpcReactClient.ado.crowdfund.getCampaignSummary.useQuery({
        "chain-identifier": connectedChain || "",
        "contract-address": saleContractAddress,
    }, { enabled: !!connectedChain && !!saleContractAddress });

    // Safely access tier price, assuming tier[0] exists
    const pricePerToken = campaignInfo?.tiers?.[0]?.price ? parseInt(campaignInfo.tiers[0].price, 10) : 0;
    const availableSupply = campaignInfo ? parseInt(campaignInfo.available_tokens, 10) / (10**6) : 0; // Assuming 6 decimals

    useEffect(() => {
        const amount = Number(quantity) || 0;
        setTotalCost(amount * pricePerToken);
    }, [quantity, pricePerToken]);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            const numValue = parseInt(value, 10) || 0;
            setQuantity(numValue);
        }
    };

    const handleBuy = async () => {
        if (!isConnected || !andromedaClient) {
            await connectAndromedaClient(process.env.NEXT_PUBLIC_CHAIN_IDENTIFIER || "");
            return;
        }

        if (!campaignInfo) return;

        setTxState('pending');

        try {
            const msg = {
                purchase_tiers: {
                    orders: [
                        {
                            level: 1, // The tier we created
                            amount: (quantity * (10**6)).toString(), // Convert to micro-units
                        },
                    ],
                },
            };

            const funds: Coin[] = [{
                amount: totalCost.toString(),
                denom: 'uandr',
            }];

            const txResult = await andromedaClient.execute(
                saleContractAddress,
                msg,
                undefined,
                `Buy ${quantity} ${tokenName}`,
                funds
            );
            
            setTxState('success');
            alert(`Purchase successful! Tx Hash: ${txResult.transactionHash}`);
        } catch (error: any) {
            setTxState('error');
            if (error.message.includes("Request rejected")) {
                alert("Transaction rejected.");
            } else {
                alert(`An error occurred: ${error.message}`);
            }
        } finally {
            await trpcContext.ado.crowdfund.getCampaignSummary.invalidate();
            if(txState !== 'success') {
                setTimeout(() => setTxState('idle'), 3000);
            }
        }
    };

    if (isLoading) {
        return <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700 animate-pulse flex items-center justify-center">Loading Sale...</div>
    }

    if (error || !campaignInfo) {
        return <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700">Error loading sale data.</div>
    }

    const getButtonText = () => {
        if (!isConnected) return "Connect Wallet";
        if (txState === 'pending') return "Processing...";
        if (txState === 'success') return "Purchased!";
        return "Buy Tokens";
    };
    
    const isSoldOut = availableSupply <= 0;

    return (
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700">
            <img src={imageUrl} alt={tokenName} className="w-full h-auto rounded-lg mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{tokenName}</h2>
            <p className="text-gray-400 mb-4">{description}</p>
            
            <div className="flex justify-between text-gray-300 mb-2">
                <span>Price per token:</span>
                <span>{pricePerToken / (10**6)} ANDR</span>
            </div>
            <div className="flex justify-between text-gray-300 mb-4">
                <span>Available:</span>
                <span>{isSoldOut ? 'Sold Out' : `${availableSupply} ${tokenSymbol}`}</span>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <label htmlFor={`quantity-${tokenSymbol}`} className="text-white">Quantity:</label>
                    <Input 
                        id={`quantity-${tokenSymbol}`}
                        type="number"
                        min="1"
                        max={availableSupply}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="bg-gray-900 text-white border-gray-600 w-full"
                        disabled={isSoldOut}
                    />
                </div>
                <div className="text-center text-lg text-white">
                    Total Cost: <span className="font-bold text-green-400">{totalCost / (10**6)} ANDR</span>
                </div>
                <Button 
                    onClick={handleBuy}
                    disabled={!isConnected || quantity <= 0 || quantity > availableSupply || txState === 'pending' || txState === 'success' || isSoldOut}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isSoldOut ? 'Sold Out' : getButtonText()}
                </Button>
            </div>
        </div>
    );
};

const TokenMarketplacePage = () => {
    const { isConnected, accounts } = useAndromedaStore();
    const connectedAddress = accounts[0]?.address;

    const tokensToDisplay = [
        {
            name: "Milk Token",
            symbol: "MILK",
            description: "Represents a share of future milk production.",
            imageUrl: "https://placehold.co/400x400/FFFFFF/000000?text=MILK",
            saleContractAddress: process.env.NEXT_PUBLIC_MILK_CROWDFUND_ADDRESS,
        },
        {
            name: "Meat Token",
            symbol: "MEAT",
            description: "Represents a share of future meat production.",
            imageUrl: "https://placehold.co/400x400/E63946/FFFFFF?text=MEAT",
            saleContractAddress: process.env.NEXT_PUBLIC_MEAT_CROWDFUND_ADDRESS,
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-4">LiveStocX Token Marketplace</h1>
            <p className="text-lg text-gray-400 mb-8">Invest in the future of livestock products.</p>
            
            {isConnected && connectedAddress && (
                <div className="flex items-center gap-2 mb-8 p-2 bg-gray-800 rounded-lg border border-gray-700">
                    <span className="text-sm text-gray-400">Connected as:</span>
                    <span className="text-sm text-green-400 font-mono">{connectedAddress}</span>
                    <CopyButton text={connectedAddress} size="sm" variant="ghost" />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tokensToDisplay.map(token => (
                    <TokenCard 
                        key={token.symbol} 
                        saleContractAddress={token.saleContractAddress}
                        tokenSymbol={token.symbol}
                        tokenName={token.name}
                        description={token.description}
                        imageUrl={token.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
};

export default TokenMarketplacePage;
