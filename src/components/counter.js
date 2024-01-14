"use client";
import CountUp from "react-countup";

export default function Counter({ end }) {
  return (
    <CountUp
      className="font-bold text-2xl text-[#5dfe65]"
      end={end}
      duration={2.5}
    />
  );
}
