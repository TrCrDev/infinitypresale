import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { PresaleContract } from "../custom-hooks/contracts";

const ViewBalance = () => {
  const { address } = useAccount();
  const [balance, setBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(true);

  const contract = PresaleContract();

  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const rawBalance = await contract?.currentETHDeposited(address);
        const formattedBalance = parseFloat(ethers.utils.formatEther(rawBalance)).toFixed(2);
        setBalance(formattedBalance);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    fetchBalance();
  }, [address, contract]);

  return (
    <div className="hidden md:block bg-black py-3 px-4 max-w-fit rounded-lg mb-4 border-0 border-teal">
      <span className="text-xs text-teal">
        Your contribution: {isLoading ? "..." : balance} ETH
      </span>
    </div>
  );
};

export default ViewBalance;
