import Link from "next/link";
import Image from "next/image";
import { useNetwork } from "wagmi";

const ChainName = () => {
  const { chain } = useNetwork();

  return (
    <Link
      href="#"
      className="flex items-center bg-black border border-teal py-2 px-6 rounded-xl mr-6"
    >

<Image
        src="https://res.cloudinary.com/ddzxw9yay/image/upload/v1684748837/eth-logo_tcxgrb.png"
        alt="ETH logo"
        width={24}
        height={24}
      />


      <span className="ml-2 text-teal">{chain?.name}</span>
    </Link>
  );
};

export default ChainName;
