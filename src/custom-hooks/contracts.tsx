import { getContract } from "@wagmi/core";
import { useContract, useSigner } from "wagmi";
import presaleAbi from "../abis/presale.json";
import { getProvider } from "@wagmi/core";

export const PresaleContract = () => {
  const provider = getProvider();
  const { data: signer, isError, isLoading } = useSigner();

  const contract = useContract({
    address: "0xC7497285513467eEa5BCB11e37612DCFe0413D55",
    abi: presaleAbi,
    signerOrProvider: signer
  });

  return contract;
};






