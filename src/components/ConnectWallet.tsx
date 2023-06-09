import { Tooltip } from "react-tooltip";
import { useConnectWallet } from "../custom-hooks/wallet";
import "react-tooltip/dist/react-tooltip.css";

import ArrowIcon from "../../public/assets/icons/connect-arrow.svg";

const shortAddress = (address: string) => {
  return address
    ? address.slice(0, 8) +
        "..." +
        address.slice(address.length - 8, address.length)
    : "";
};

const ConnectWallet = () => {
  const { onOpen, loading, disconnect, address, isConnected } =
    useConnectWallet();

  return (
    <>
      {isConnected ? (
        <>
          <button
            id="props-basic"
            className="py-2 px-6 border-teal border text-teal rounded-lg hover:border-2 focus:border-2 transition-all focus:outline-none"
          >
            <span>{shortAddress(address ?? "")}</span>
          </button>
          <Tooltip
            className="bg-white text-teal"
            events={["hover"]}
            anchorId="props-basic"
            delayHide={3000000}
            variant="light"
            wrapper="button"
            clickable={true}
          >
            <span
              className="hover:underline focus:underline transition-all focus:outline-none cursor-pointer"
              onClick={() => disconnect()}
            >
              Disconnect
            </span>
          </Tooltip>
        </>
      ) : (
        <button
          onClick={onOpen}
          disabled={loading}
          className="py-3 px-6 border-teal border rounded-lg bg-blacl flex items-center"
        >
          <span className="text-teal">Connect Wallet</span>
          <ArrowIcon className="h-2 w-2 ml-4" />
        </button>
      )}
    </>
  );
};

export default ConnectWallet;
