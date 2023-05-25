import dynamic from "next/dynamic";

import BuyForm from "../src/components/BuyForm";
import ClaimForm from "../src/components/ClaimForm";
import { useState, useEffect } from "react";
import { PresaleContract } from "../src/custom-hooks/contracts";
import { GetServerSideProps } from "next";

import toast from "react-hot-toast";
import { ethers } from "ethers";

const ViewBalance = dynamic(() => import("../src/components/ViewBalance"), {
  ssr: false
});
const timeline = [
  "Pre-sale Pending",
  "Pre-sale Live",
  "Pre-sale Completed",
  "$INF Launched"
];

export default function Home() {
  const [claimMoment, setClaimMoment] = useState(false);
  const [amount, setAmount] = useState(0);
  const [hardC, setHardC] = useState(0);
  const [percent, setPercent] = useState(0);
  const [bal, setBal] = useState(0);

  const contract = PresaleContract();

  useEffect(() => {
    async function getSaleMoment() {
      try {
        const txn = await contract?.claimOpen();
        console.log("txn");
        console.log(txn);
        setClaimMoment(txn);
      } catch (error) {
        console.log("errorr 0");
        console.log({ error });
      }
    }
    getSaleMoment();
    const getPercent = async () => {
      try {
        const balance = await contract?.getCurrentBalance();
        const hardcap = await contract?.hardCap();
        setBal(parseFloat(ethers.utils.formatEther(balance)));
        setAmount(parseFloat(ethers.utils.formatEther(balance)));
        setHardC(parseInt(ethers.utils.formatEther(hardcap)));
        const perc = (balance / hardcap) * 100;
        console.log(perc);
        setPercent(perc);
        console.log(balance);
        console.log(hardcap);
      } catch (error) {
        console.log("errorr");
        console.log(error);
      }
    };
    getPercent();
  }, [contract]);
  return (
    <section className="flex flex-col md:flex-row  mt-20 text-teal">
      <div className="md:basis-7/12 md:mr-4">
        <div className="mb-9">
          <h1 className="font-spacegrotesk text-5xl mb-4">Welcome to Infinity presale</h1>
          <p className="text-base">
          Rules are about to be rewritten. Are you ready to see what's on the other side?
          </p>
        </div>
        <ul className="hidden md:block">
          {timeline.map((label, index) => {
            return (
              <li key={label} className="stepper-row">
                <div className="dot-container">
                  <div className="dot"></div>
                  {index === 1 && <div className="shade"></div>}
                </div>
                <p>{label}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="md:basis-5/12 md:ml-4">
        <ViewBalance />

        <div className="bg-gradient border rounded-xl p-5 mb-4 md:mb-0 "
        style={{ boxShadow: "0px 0px 10px #FFFFFF" }}>
          <div className="flex justify-between mb-9">
            <button className="bg-black border border-neal text-xs px-4 py-2 rounded-2xl">
              {bal + "/" + 12 + " ETH"}
            </button>
          </div>
          <div className="mb-8">
            <p className="text-sm text-teal mb-3">Sale progress : {percent.toFixed(2)} %</p>

            <div className="w-full bg-white rounded-full h-2.5">
            <div key={percent} className="bg-teal h-2.5 rounded-full" style={{width: `${percent}%`}}></div>



            </div>
          </div>

          {claimMoment === null ? (
            <p>Loading...</p>
          ) : claimMoment === true ? (
            "Sale completed, wait for the claim 🚀"
          ) : (
            <BuyForm/>
          )}
          <div>
            <h2 className="font-bold mb-2"></h2>
            <p className="text-xs text-teal">
              {" "}
              <span className="text-teal"></span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
