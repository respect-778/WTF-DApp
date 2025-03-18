import { createConfig, http, useReadContract, useWriteContract } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import {
  WagmiWeb3ConfigProvider,
  MetaMask,
  Sepolia,
} from "@ant-design/web3-wagmi";
import {
  Address,
  NFTCard,
  Connector,
  ConnectButton,
  useAccount,
} from "@ant-design/web3";
import { injected } from "wagmi/connectors";
import { Button, message } from "antd";
import { parseEther } from "viem";

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http('https://api.zan.top/node/v1/eth/mainnet/edab0ddddb444fec9c5a5f97496a7167'),
    [sepolia.id]: http('https://api.zan.top/node/v1/eth/sepolia/edab0ddddb444fec9c5a5f97496a7167'),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
});

const CallTest = () => {
  const { account } = useAccount();
  const result = useReadContract({
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
    ],
    address: '0xEC0998ec041ef40870D33996d842252CBdc7C170',
    functionName: 'balanceOf',
    args: [account?.address as `0x${string}`],
  });
  const { writeContract } = useWriteContract();

  return (
    <div>
      {result.data?.toString()}
      <Button
        onClick={() => {
          writeContract(
            {
              abi: [
                {
                  type: "function",
                  name: "mint",
                  stateMutability: "payable",
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "quantity",
                      type: "uint256",
                    },
                  ],
                  outputs: [],
                },
              ],
              address: "0xEC0998ec041ef40870D33996d842252CBdc7C170",
              functionName: "mint",
              args: [BigInt(1)],
              value: parseEther("0.01"),
            },
            {
              onSuccess: () => {
                message.success("Mint Success");
              },
              onError: (err) => {
                message.error(err.message);
              },
            }
          );
        }}
      >
        mint
      </Button>
    </div>
  );
}

export default function Web3() {
  return (
    <WagmiWeb3ConfigProvider
      config={config}
      chains={[Sepolia]}
      wallets={[MetaMask()]}
    >
      <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
      <NFTCard
        address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
        tokenId={641}
      />
      <Connector>
        <ConnectButton />
      </Connector>
      <CallTest />
    </WagmiWeb3ConfigProvider>
  );
};
