import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import logoUranium from "../assets/images/logoUranium.png";
import MenuIcon from "../../public/assets/icons/menu.svg";

const ChainName = dynamic(() => import("./ChainName"), {
  ssr: false
});
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false
});
const SSConnectWallet = dynamic(() => import("./SSConnectWallet"), {
  ssr: false
});

const Header = () => {
  return (
    <header className="text-sm flex justify-between items-center pb-8">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          width={150} 
          height={150} 
          className="cursor-pointer" 
        />
      </Link>
      <div className="hidden md:flex items-center">
        <ChainName />

        <ConnectWallet />
      </div>

      <div className="flex md:hidden items-center">
        <SSConnectWallet />
        <button>
          <MenuIcon className="h-5 w-7" />
        </button>
      </div>
    </header>
  );
};


export default Header;
