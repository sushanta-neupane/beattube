import React, { useEffect, useRef, useState } from "react";
import { Card, CardBody, Image, Button, Slider } from "@nextui-org/react";
import {
  GiNextButton,
  GiPreviousButton,
  GiPlayButton,
  GiPauseButton,
} from "react-icons/gi";
import { LiaRandomSolid } from "react-icons/lia";
import { RiRepeatOneFill } from "react-icons/ri";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { PlayingItemType } from "./Contents";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { togglePicks } from "../redux/features/picksSlice";
import { RootState, AppDispatch } from "../redux/store";
import toast, { Toaster } from 'react-hot-toast';

interface PlayingItemProps {
  current?: PlayingItemType;
}

const Player: React.FC<PlayingItemProps> = ({ current }) => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.picks);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false); // State to track loading status

  const formatTime = (time: number) => {
    return moment.utc(time * 1000).format("HH:mm:ss");
  };

  useEffect(() => {
    if (!current) return;

    setLoading(true); // Set loading to true when fetching starts

    const audioElement = videoRef.current;

    const handleTimeUpdate = () => {
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
      }
    };

    const handleDurationChange = () => {
      if (audioElement) {
        setDuration(audioElement.duration);
      }
    };

    audioElement?.addEventListener("timeupdate", handleTimeUpdate);
    audioElement?.addEventListener("durationchange", handleDurationChange);

    setLoading(false); // Set loading to false when fetching completes

    return () => {
      audioElement?.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement?.removeEventListener("durationchange", handleDurationChange);
    };
  }, [current]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPlaying(!videoRef.current.paused);
    }
  };

  useEffect(() => {
    if (!current) return;

    setLoading(true); // Set loading to true when fetching starts

    // Check if the videoId is already in the Redux state
    const isLiked = data.videos.some((video) => video.vid === current.vid);

    setLiked(isLiked);

    setLoading(false); // Set loading to false when fetching completes
  }, [current, data]);

  const handlePicks = () => {
    if (!current) return;
    dispatch(togglePicks({vid: current.vid,title: current.title, thumbnail : current.thumbnail}));
    if (!liked){

      toast.success("Added to picks");
    }
    else{

      toast("Removed from picks");
    }
  };

  if (!current) return null;

  return (
    <>
      <Toaster />
      {loading && <div>Loading...</div>} {/* Show loading indicator */}
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <Image
                alt="Album cover"
                className="object-cover"
                height={400}
                shadow="md"
                src={current?.thumbnail}
                width="100%"
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0">
                  <h3 className="font-semibold text-foreground/90 line-clamp-1">
                    {current?.title}
                  </h3>
                  <p className="text-small text-foreground/80">
                    {" "}
                    {moment(current?.publishDate).fromNow()}
                  </p>
                  <h1 className="text-large font-medium mt-2">
                    {current?.ownerChannelName}
                  </h1>
                </div>
                <Button
                  isIconOnly
                  className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                  radius="full"
                  variant="light"
                  onClick={handlePicks}
                >
                  {liked ? (
                    <FaHeart color="#f04a63" />
                  ) : (
                    <FaRegHeart color="#f04a63" />
                  )}
                </Button>
              </div>

              <div className="flex flex-col mt-3 gap-1">
                <Slider
                  aria-label="Music progress"
                  classNames={{
                    track: "bg-default-500/30",
                    thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-foreground",
                  }}
                  color="foreground"
                  maxValue={duration}
                  value={currentTime}
                  defaultValue={0}
                  size="sm"
                  onChange={(newValue) => {
                    setCurrentTime(Number(newValue));
                    if (videoRef.current) {
                      videoRef.current.currentTime = Number(newValue);
                    }
                  }}
                />
                <div className="flex justify-between">
                  <p className="text-small">{formatTime(currentTime)}</p>
                  <p className="text-small text-foreground/50">
                    {formatTime(duration)}
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center justify-center">
                <Button
                  isIconOnly
                  className="data-[hover]:bg-foreground/10"
                  radius="full"
                  variant="light"
                >
                  <RiRepeatOneFill />
                </Button>
                <Button
                  isIconOnly
                  className="data-[hover]:bg-foreground/10"
                  radius="full"
                  variant="light"
                >
                  <GiPreviousButton />
                </Button>
                <Button
                  isIconOnly
                  className=" data-[hover]:bg-foreground/10"
                  radius="full"
                  variant="light"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <GiPauseButton /> : <GiPlayButton />}
                </Button>
                <Button
                  isIconOnly
                  className="data-[hover]:bg-foreground/10"
                  radius="full"
                  variant="light"
                >
                  <GiNextButton />
                </Button>
                <Button
                  isIconOnly
                  className="data-[hover]:bg-foreground/10"
                  radius="full"
                  variant="light"
                >
                  <LiaRandomSolid />
                </Button>
              </div>
            </div>
          </div>
        </CardBody>

        <video
          ref={videoRef}
          src={current?.audioLink}
          className="hidden"
          controls
          preload="none"
        ></video>
      </Card>
    </>
  );
};

export default Player;
