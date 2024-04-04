"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Button,
  Chip,

} from "@nextui-org/react";
import { FaPause, FaPlay } from "react-icons/fa6";
import LoadSpinner from "./LoadSpinner";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import Player from "./Player";
import DownloadBtn from "./DownloadBtn";
import { useDispatch, useSelector } from "react-redux";
import { PicksType, loadPicks } from "../redux/features/picksSlice";
import axios from "axios";
import { RootState } from "../redux/store";
import { togglePlayer } from "../redux/features/playerSlice";



interface ContentItem {
  id: string;
  title: string;
  channelTitle: string;
  publishTime: string;
  thumbnails: string;
}


export interface PlayingItemType {
  id: string;
  title: string;
  channelTitle: string;
  publishTime: string;
  thumbnails: string;
  formatAudioHigh: string; // Add new fields as needed
  formatAudioLow: string;
  formatVideoHigh: string;
  formatVideoLow: string;
  formatAudioAndVideo: string;
}


const Contents = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const queries = useSearchParams();
  const [query, setQuery] = useState<string>(queries.get("q") || "new music");
  const [currentPlaying, setCurrentPlaying] = useState<
    PlayingItemType
  >();
  const isPlayerOpen = useSelector((state: RootState) => state.player.isOpen);

  const [isOpen, setOpen] = useState(isPlayerOpen);
  const fetchContents = async () => {
    try {
      console.log(`${process.env.API_URI}?q=${query}`);
      const data = await axios.get(`${process.env.API_URI}?q=${query}`);
      if (!data.status) {
        throw new Error('Failed to fetch contents');
      }
      const { videoDetails, relatedVideos, searchVideos } = data.data;
      const contentItem: ContentItem = {
        id: videoDetails.id,
        title: videoDetails.title,
        channelTitle: videoDetails.author.name,
        publishTime: (videoDetails?.publishTime),
        thumbnails: videoDetails.thumbnails[0].url,
      };
      const relatedContentItems: ContentItem[] = relatedVideos.map((relatedVideo: any) => ({
        id: relatedVideo.id,
        title: relatedVideo.title,
        channelTitle: relatedVideo.author.name,
        publishTime: relatedVideo.published,
        thumbnails: relatedVideo.thumbnails[0].url,
      }));
      const allContents: ContentItem[] = [contentItem, ...relatedContentItems];
      const search: ContentItem[] = searchVideos.map((searchVideo: any) => ({
        id: searchVideo.id.videoId,
        title: searchVideo.title,
        channelTitle: "Youtube Content",
        publishTime: searchVideo?.snippet.publishedAt,
        thumbnails: searchVideo.snippet.thumbnails.url,
      }));
      console.log(search)

      setContents(search);
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
        `${process.env.API_URI}/${vid}`);
      if (!data.status) {
        throw new Error('Failed to fetch music');
      }
      const { videoDetails } = data.data;
      const curentItem: PlayingItemType = {
        id: videoDetails.id,
        title: videoDetails.title,
        channelTitle: videoDetails.author.name,
        publishTime: (videoDetails?.publishTime),
        thumbnails: videoDetails.thumbnails[0].url,
        formatAudioHigh: videoDetails.formatAudioHigh,
        formatAudioLow: videoDetails.formatAudioLow,
        formatVideoHigh: videoDetails.formatVideoHigh,
        formatVideoLow: videoDetails.formatVideoLow,
        formatAudioAndVideo: videoDetails.formatAudioAndVideo
      };
      setCurrentPlaying(curentItem);
      console.log(curentItem);
    } catch (error) {
      console.error('Error fetching music:', error);
      // Handle error, such as displaying a message to the user
    }
  };



  useEffect(() => {
    const q = decodeURIComponent(queries.get("q") || query);
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
    console.log(vid)
    fetchMusic(vid);

    dispatch(togglePlayer())
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
                        {card?.channelTitle}
                      </p>
                      <div className="flex items-center gap-1">

                        <Button
                          isIconOnly
                          radius="full"
                          variant="flat"
                          color="secondary"
                          className=""
                          onClick={() => handlePlay(card?.id)}
                        >
                          <FaPlay />
                        </Button>


                        <DownloadBtn v={{ vid: card.id, title: card.title, thumbnail: card.thumbnails }} />


                      </div>
                    </div>
                    <h4 className="font-bold text-large line-clamp-2">
                      {card?.title}
                    </h4>
                    <small className="text-default-500">
                      {card?.publishTime}
                    </small>
                  </div>
                </CardHeader>
                <CardBody className="overflow-visible  py-2 ">
                  <Image
                    alt="Card background"
                    className=" object-cover rounded-xl "
                    src={card?.thumbnails}
                    width={270}
                  />
                </CardBody>
              </Card>
            ))}
          </div>

          {/* player  */}
          <div className="Player w-full  z-50 fixed bottom-0 right-0">
            {isPlayerOpen && (

              <Player current={currentPlaying} />
            )}

          </div>
        </>
      )}

    </>
  );
};

export default Contents;
