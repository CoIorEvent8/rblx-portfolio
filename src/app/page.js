// "use client";
import Image from "next/image";
import Link from "next/link";
import Profile from "../../src/config/Profile.json";
// import CountUp from "react-countup";
// import { useEffect, useState } from "react";
import Games from "../../src/config/Games.json";

import Counter from "@/components/counter";

// console.info("Made with 💖 by CoIorEvent8");

const { Username, ProfileLink, OpenForWork, Avatar, Socials } = Profile;

function formatNumber(number) {
  const SI_SYMBOLS = ["", "K+", "M+", "B+", "T+", "P+", "E+"];
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  if (tier === 0) return number.toString();

  const suffix = SI_SYMBOLS[tier];
  const scale = 10 ** (tier * 3);

  const scaledNumber = number / scale;
  const roundedNumber = scaledNumber.toFixed(1);

  return roundedNumber + suffix;
}

function Social({ href, image }) {
  return (
    <Link
      className="h-[20px] w-[20px] border-2 border-gray-300 border-opacity-0 hover:border-opacity-100 rounded-full mr-1 duration-100"
      href={href}
      target="_blank"
    >
      <Image width="16" height="16" src={image} className="" alt={image} />
    </Link>
  );
}

function Header({ totalVisits, totalPlayers, totalGames }) {
  return (
    <div className="rounded-md backdrop-filter backdrop-blur-md backdrop-opacity-100 bg-black bg-opacity-60 dropshadow w-full grid grid-cols-1 md:grid-cols-3 items-center p-2 gap-4 font-semibold rounded-md">
      <div className="flex items-center">
        <div className="relative items-center bg-black w-[50px] h-[50px] mr-2 rounded-full">
          <Image
            src={Avatar}
            alt="avatar"
            height="50"
            width="50"
            className="rounded-full"
          />
          <span
            style={{ backgroundColor: OpenForWork ? "#5dfe65" : "#EE4B2B" }}
            className="absolute right-0 bottom-0 w-5 h-5 border-4 border-[#0d0c0c] rounded-full"
          />
        </div>
        <div>
          <Link
            className="hover:underline hover:text-blue-400 duration-100"
            target="_blank"
            href={ProfileLink}
          >
            {Username}'s Portfolio
          </Link>
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
        <div className="h-[28.5px]">
          <Counter end={totalVisits} />
        </div>
        {/* <h1 className="font-bold text-2xl text-[#5dfe65]">0</h1> */}
        <p className="text-sm">Contributed Place Visits</p>
      </div>
      <div className="text-center">
        <div className="h-[28.5px]">
          <Counter end={totalPlayers} />
        </div>
        {/* <h1 className="font-bold text-2xl text-[#5dfe65]">0</h1> */}
        <p className="text-sm">People Playing Across {totalGames} games</p>
      </div>
    </div>
  );
}

function GameCard({ name, createdAt, players, visits, placeId, thumbnail }) {
  return (
    <Link
      className="mr-2 h"
      href={`https://roblox.com/games/${placeId}`}
      target="_blank"
    >
      <div className="font-semibold min-w-[150px] rounded-md bg-gray-900">
        <div className="relative w-full h-[150px]">
          <Image
            alt="Experience Icon"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-md border-[1.5px] border-gray-800"
            src={thumbnail}
          />
        </div>
        <div className="border-x-[1.5px] border-b-[1.5px] border-gray-800 rounded-b-md">
          <div className="p-2 whitespace-nowrap">
            <h2 className="text-xs text-gray-300">{createdAt}</h2>
            <h1 className="font-bold">{name}</h1>
          </div>
          <div className="border-t-[1.5px] border-gray-800" />
          <div className="p-2 flex">
            <div className="flex justify-center items-center text-gray-300 mr-4">
              <div className="w-[16px] h-[16px] mr-2">
                <Image
                  src="/icons8-contacts.svg"
                  width={16}
                  height={16}
                  alt="Visits"
                  className="mr-2"
                />
              </div>
              <p className="text-xs">{formatNumber(visits)}</p>
            </div>
            <div className="flex justify-center items-center text-gray-300">
              <div className="w-[16px] h-[16px] mr-2">
                <Image
                  src="/icons8-connect.svg"
                  width={16}
                  height={16}
                  alt="Players"
                  className="mr-2"
                />
              </div>
              <p className="text-xs">{formatNumber(players)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function fetchUniverseIds() {
  return new Promise((resolve) => {
    let ids = {};
    let gamesHandled = 0;

    Games.forEach((placeId) => {
      fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, {
        next: { tags: ["collection"] },
      }).then((res) => {
        res.json().then(({ universeId }) => {
          ids = { ...ids, [universeId]: placeId };
          gamesHandled++;
          if (gamesHandled === Games.length) resolve(ids);
        });
      });
    });
  });
}

function fetchGameThumbnails(universes) {
  return new Promise((resolve) => {
    let thumbnails = {};
    let thumbnailsHandled = 0;

    fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universes.join(
        ","
      )}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`,
      {
        next: { tags: ["collection"], revalidate: 86400 },
      }
    ).then((res) => {
      res.json().then((body) => {
        body.data.forEach((thumbnail) => {
          thumbnails = {
            ...thumbnails,
            [thumbnail.targetId]: thumbnail.imageUrl,
          };
          thumbnailsHandled++;
          if (thumbnailsHandled === universes.length) resolve(thumbnails);
        });
      });
    });
  });
}

function fetchGameData(universes) {
  return new Promise((resolve) => {
    let data = {};
    let dataHandled = 0;

    fetch(
      `https://games.roblox.com/v1/games/?universeIds=${universes.join(",")}`,
      {
        next: { tags: ["collection"], revalidate: 60 },
      }
    ).then((res) => {
      res.json().then((body) => {
        body.data.forEach((gameData) => {
          data = {
            ...data,
            [gameData.id]: {
              name: gameData.name,
              createdAt: gameData.created,
              visits: gameData.visits,
              players: gameData.playing,
            },
          };
          dataHandled++;
          if (dataHandled === universes.length) resolve(data);
        });
      });
    });
  });
}

export default async function Home() {
  const ids = await fetchUniverseIds();
  const thumbnails = await fetchGameThumbnails(Object.keys(ids));
  const gameData = await fetchGameData(Object.keys(ids));

  return (
    <>
      <Image
        className="selectDisable absolute top-0 left-0"
        fill="cover"
        src="/background.jpg"
        style={{ objectFit: "cover" }}
        alt="background"
        priority={true}
      />
      <main className="md:min-w-[750px] min-w-[99%] md:w-auto flex flex-col items-center justify-center w-fit p-2">
        {/* Header */}
        <Header
          totalVisits={Object.values(gameData)
            .map((data) => data.visits)
            .reduce((acc, visits) => acc + visits, 0)}
          totalPlayers={Object.values(gameData)
            .map((data) => data.players)
            .reduce((acc, players) => acc + players, 0)}
          totalGames={Object.keys(ids).length}
        />

        {/* Reviews */}
        <div className="p-2 w-full overflow-hidden rounded-md backdrop-filter backdrop-blur-md backdrop-opacity-100 bg-black bg-opacity-60 dropshadow mt-2">
          <div className="flex w-[166px]">
            {Object.keys(ids).map((universeId, index) => {
              const data = gameData[universeId];

              return (
                <GameCard
                  key={index}
                  placeId={ids[universeId]}
                  name={data.name}
                  players={data.players}
                  visits={data.visits}
                  thumbnail={thumbnails[universeId]}
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
