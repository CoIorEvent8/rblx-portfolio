import Image from "next/image";
import Link from "next/link";
import Profile from "../../src/config/Profile.json";

const { Username, OpenForWork, Avatar, Socials } = Profile;

function Social({ href, image }) {
  return (
    <Link href={href} target="_blank">
      <Image width="16" height="16" src={image} className="mr-1" />
    </Link>
  );
}

function Header() {
  return (
    <div className="w-full inner grid grid-cols-1 md:grid-cols-3 items-center p-2 gap-4 font-semibold rounded-md">
      <div className="flex items-center">
        <div className="relative items-center bg-black w-[50px] h-[50px] mr-2 rounded-full">
          <Image src={Avatar} height="50" width="50" className="rounded-full" />
          <span
            style={{ backgroundColor: OpenForWork ? "#5dfe65" : "#EE4B2B" }}
            className="absolute right-0 bottom-0 w-5 h-5 border-4 border-[#0d0c0c] rounded-full"
          />
        </div>

        <div>
          <h1>{Username}'s Portfolio</h1>
          <div className="flex items-center justify-left">
            {Socials.Github && (
              <Social href={Socials.Github} image="/github.svg" />
            )}
            {Socials.Discord && (
              <Social href={Socials.Discord} image="/discord.svg" />
            )}
            {Socials.X && <Social href={Socials.X} image="/x.svg" />}
          </div>
        </div>
      </div>
      <div className="text-center">
        <h2 className="font-bold text-2xl text-[#5dfe65]">216.1M+</h2>
        <p className="text-sm">Contributed Place Visits</p>
      </div>
      <div className="text-center">
        <h2 className="font-bold text-2xl text-[#5dfe65]">2.0K+</h2>
        <p className="text-sm">People Playing Across 8 games</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="rounded-md backdrop-filter backdrop-blur-md backdrop-opacity-100 bg-black bg-opacity-60 dropshadow flex flex-col items-center justify-center w-fit p-2">
      {/* Header */}
      <Header />

      {/* Reviews */}
      {/* <div className="grid grid-cols-2 gap-2 w-full">
        <div className="py-2 px-4 rounded-md  inner">
          <h1 className="font-bold text-xs text-gray-400">
            Randomdoodoo - 11/20/23
          </h1>
          <p className="text-sm">Great to work with, fair prices!</p>
        </div>
        <div className="py-2 px-4 rounded-md  inner">
          <h1 className="font-bold text-xs text-gray-400">
            Randomdoodoo - 11/20/23
          </h1>
          <p className="text-sm max-w-[350px]">
            I was excited with the updates he provided! I was excited with the
            updates he provided!
          </p>
        </div>
      </div> */}
    </main>
  );
}
