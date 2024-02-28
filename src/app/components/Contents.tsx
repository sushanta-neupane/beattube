"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Button,
  Chip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { FaPause, FaPlay } from "react-icons/fa6";
import LoadSpinner from "./LoadSpinner";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import Player from "./Player";
import DownloadBtn from "./DownloadBtn";
import { useDispatch } from "react-redux";
import { PicksType, loadPicks } from "../redux/features/picksSlice";
import axios from "axios";

interface ContentItem {
  id: {
    videoId: string;
  };
  snippet: {
    channelTitle: string;
    title: string;
    publishTime: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

export interface PlayingItemType {
  audioLink: string;
  audioVideoLink: string;
  lengthSeconds: string;
  videoLink: string;
  viewCount: string;
  title: string;
  thumbnail: string;
  expiresInSeconds: string;
  publishDate: string;
  ownerChannelName: string;
  vid : string;
}



const Contents = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const queries = useSearchParams();
  const [query, setQuery] = useState<string>( queries.get("q") || "new music" );
  const [currentPlaying, setCurrentPlaying] = useState<
    PlayingItemType
  >();
  const API_KEY =  process.env.YT_API_KEY as string;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fetchContents = async () => {
    try {
      console.log(`https://apibeatwave.vercel.app/api?q=${query}&max=8&apikey=${API_KEY}`);
      const data = await axios.get(
        `https://apibeatwave.vercel.app/api?q=${query}&max=8&apikey=${API_KEY}`);
      if (!data.status) {
        throw new Error('Failed to fetch contents');
      }
      const jsonData = data.data;
      console.log(jsonData);
      setContents(jsonData.items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contents:', error);
      // Handle error, such as displaying a message to the user
      setLoading(false);
    }
  };
  
  const fetchMusic = async (vid: string) => {
    try {
      console.log("fetching...");
      const data = await axios.get(
        `https://apibeatwave.vercel.app/api/${vid}`);
      if (!data.status) {
        throw new Error('Failed to fetch music');
      }
      const jsonData = data.data;
      const jsonDataWithid = { ...jsonData, vid };
      setCurrentPlaying(jsonDataWithid);
      console.log(jsonDataWithid);
    } catch (error) {
      console.error('Error fetching music:', error);
      // Handle error, such as displaying a message to the user
    }
  };
  


  useEffect(() => {
    const q =  decodeURIComponent(queries.get("q") || query);
    setQuery(q);
    
  }, [queries]);

  useEffect(() => {
    fetchContents();
  }, [query]);


  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("Picks") !== null) {
      const data: PicksType | null = JSON.parse(localStorage.getItem("Picks")!);
      if (data) {
        dispatch(loadPicks(data));
      }
    }
  }, [dispatch]);

  const handlePlay = (vid: string) => {
    fetchMusic(vid);
  };



  if (contents.length == 0) return;

  return (
    <>
 
      {loading ? (
        <LoadSpinner label="Fetching..." />
      ) : (
        <>
          <div className="flex gap-2 my-5">
            <Chip variant="flat" onClose={() => console.log("1st")}>
              New
            </Chip>
            <Chip variant="flat" onClose={() => console.log("2nd")}>
              Top
            </Chip>
            <Chip variant="flat" onClose={() => console.log("3rd")}>
              Popular
            </Chip>
            <Chip variant="flat" onClose={() => console.log("4th")}>
              Trending
            </Chip>
          </div>
          <div className="gap-5 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-5">
            {contents.map((card, index) => (
              <Card key={index} className="py-4">
                <CardHeader className="pb-0 pt-2 px-4 flex items-start justify-between">
                  <div className="flex-col items-start">
                    <div className="flex justify-between items-center ">
                      <p className="text-tiny uppercase font-bold line-clamp-1">
                        {card?.snippet?.channelTitle}
                      </p>
                      <div className="flex items-center gap-1">

                      <Button
                        isIconOnly
                        radius="full"
                        variant="flat"
                        color="secondary"
                        className=""
                        onPress={onOpen}
                        onClick={() => handlePlay(card?.id?.videoId)}
                      >
                        <FaPlay />
                      </Button>
                    

                      <DownloadBtn v={{vid : card?.id?.videoId , title : card.snippet.title , thumbnail: card.snippet.thumbnails.high.url}} />
                      

                      </div>
                    </div>
                    <h4 className="font-bold text-large line-clamp-2">
                      {card?.snippet?.title}
                    </h4>
                    <small className="text-default-500">
                      {moment(card?.snippet?.publishTime).fromNow()}
                    </small>
                  </div>
                </CardHeader>
                <CardBody className="overflow-visible  py-2 ">
                  <Image
                    alt="Card background"
                    className=" object-cover rounded-xl "
                    src={card?.snippet?.thumbnails?.high?.url}
                    width={270}
                  />
                </CardBody>
              </Card>
            ))}
          </div>

          {/* player  */}
          <div className="Player flex flex-col gap-2">
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
              <ModalContent>
                {(onClose) => (
                  <>
                    <Player current={currentPlaying}  />
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </>
      )}

    </>
  );
};

export default Contents;
