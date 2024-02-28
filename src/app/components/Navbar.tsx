"use client";
import React, { useState } from "react";
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { TbSearch, TbSun, TbMoon, TbWaveSquare, TbHeart } from "react-icons/tb";
import ThemeChanger from "./ThemeChanger";
import { useRouter } from "next/navigation";
import Picks from "./Picks";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function App() {
    const router = useRouter()
  const [query, setQuery] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e?.target?.value);
  };

  const handleClick = ()=>{
    router.push(`?q=${encodeURIComponent(query)}`)
  }


  return (
    <nav className="flex my-2 items-center justify-between">
      <div className="Brand text-xl">
        <span className="flex  items-center">
          <span className="hidden sm:block">bea</span>
          <TbWaveSquare />
          <strong className="hidden sm:block">ube</strong>
        </span>
      </div>
      <section className="flex gap-2">
        <div>
          <ButtonGroup>
            <Input
              radius="none"
              classNames={{
                base: "max-w-full sm:max-w-[20rem] h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              onChange={handleChange}
              value={query}
              placeholder="Type to search..."
              size="sm"
              type="search"
            />
            <Button isIconOnly radius="none" onClick={handleClick}>
              <TbSearch />
            </Button>
          </ButtonGroup>
        </div>
        <div>
          <ThemeChanger />
        </div>
        <div >
          <Picks picks={useSelector((state: RootState)=> state.picks)} />
        </div>
      </section>
    </nav>
  );
}
