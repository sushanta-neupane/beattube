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
import { PicksType, loadPicks, togglePicks } from "../redux/features/picksSlice";
import { RootState, AppDispatch } from "../redux/store";
import toast, { Toaster } from 'react-hot-toast';
import Draggable from 'react-draggable';
import { TbCross, TbCrossOff, TbMultiplier05X, TbVolume, TbVolume2, TbVolume3 } from "react-icons/tb";
import { FaCross } from "react-icons/fa6";
import { BiCross } from "react-icons/bi";
import { IoCloseCircle } from "react-icons/io5";

interface PlayingItemProps {
    index?: number;
}

const Player: React.FC<PlayingItemProps> = ({ index }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem("Picks") !== null) {
            const data: PicksType | null = JSON.parse(localStorage.getItem("Picks")!);
            if (data) {
                dispatch(loadPicks(data));
            }
        }
    }, [dispatch]);

    const data = useSelector((state: RootState) => state.picks);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [liked, setLiked] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isSuffle, setIsSuffle] = useState(false);
    const [isLoop, setIsLoop] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(false); // State to track loading status
    const [currentPlaying, setCurrentPlaying] = useState<PlayingItemType>();
    const [currentIndex, setCurrentIndex] = useState(index || 0);


    const [volume, setVolume] = useState(50); // Initial volume level

 

    const handleNext = () => {
        if (isSuffle) {
            let randomIndex = Math.floor(Math.random() * data.videos.length);
            setCurrentIndex(randomIndex);
        }
        else {

            setCurrentIndex(prev => (prev + 1) % data.videos.length);
        }
    }

    const handleSongEnd = () => {
        if (!isLoop) {
            handleNext();
        }
        else {
            if (videoRef.current) {
                videoRef.current.currentTime = 0; // Set the current time of the video to 0 to replay from the beginning
                videoRef.current.play(); // Play the video
                setIsPlaying(true); // Update the state to indicate that the video is playing
            }
        }
    }

    const handlePrevious = () => {
        if (isSuffle) {
            let randomIndex = Math.floor(Math.random() * data.videos.length);
            setCurrentIndex(randomIndex);
        }
        else {

            setCurrentIndex(prev =>
                prev === 0 ? data.videos.length - 1 : prev - 1
            );
        }


    }
    const handlePlaylistPicks = async (index: any) => {
        if (!data || !data.videos[index]) return;
        const cirIndex = index % data.videos.length;
        const picksData = data.videos[cirIndex];
        try {
            const response = await fetch(
                `http://localhost:3001/api/${picksData.vid}`
                // `https://apibeatwave.vercel.app/api/${videoId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch audio link");
            }
            const data = await response.json();
            // Assuming the response contains the audio link
            const audioLink = data.audioLink;
            setCurrentPlaying(data);
            if (videoRef.current) {
                videoRef.current.src = audioLink;
                videoRef.current.load(); // Reload the audio element
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching audio link:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        handlePlaylistPicks(currentIndex)
    }, [currentIndex])


    const formatTime = (time: number) => {
        return moment.utc(time * 1000).format("HH:mm:ss");
    };

    useEffect(() => {
        if (!currentPlaying) return;

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
    }, [currentPlaying]);

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
        if (!currentPlaying) return;

        setLoading(true); // Set loading to true when fetching starts

        // Check if the videoId is already in the Redux state
        const isLiked = data.videos.some((video) => video.vid === currentPlaying.vid);

        setLiked(isLiked);

        setLoading(false); // Set loading to false when fetching completes
    }, [currentPlaying, data]);

    const handlePicks = () => {
        if (!currentPlaying) return;
        dispatch(togglePicks({ vid: currentPlaying.vid, title: currentPlaying.title, thumbnail: currentPlaying.thumbnail }));
        if (!liked) {

            toast.success("Added to picks");
        }
        else {

            toast("Removed from picks");
        }
    };



    return (
        <>
            <Toaster />
            {loading && <div>Loading...</div>} {/* Show loading indicator */}
            <Draggable>

                <Card
                    isBlurred
                    className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                    shadow="sm"
                >
                    <CardBody>
                        <div className="  " ><IoCloseCircle  color="red" /></div>
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                            <div className="relative col-span-6 md:col-span-4">
                                <Image
                                    alt="Album cover"
                                    className="object-cover"
                                    height={400}
                                    shadow="md"
                                    src={currentPlaying?.thumbnail}
                                    width="100%"
                                />
                            </div>

                            <div className="flex flex-col col-span-6 md:col-span-8">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-0">
                                        <h3 className="font-semibold text-foreground/90 line-clamp-1">
                                            {currentPlaying?.title}
                                        </h3>
                                        <p className="text-small text-foreground/80">
                                            {" "}
                                            {moment(currentPlaying?.publishDate).fromNow()}
                                        </p>
                                        <h1 className="text-large font-medium mt-2">
                                            {currentPlaying?.ownerChannelName}
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
                                        onClick={() => {
                                            toast("loop:" + !isLoop);
                                            return setIsLoop(prev => !prev)
                                        }
                                        }
                                    >
                                        <RiRepeatOneFill />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        className="data-[hover]:bg-foreground/10"
                                        radius="full"
                                        variant="light"
                                        onClick={handlePrevious}
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
                                        onClick={handleNext}
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
                                <Slider
                                    aria-label="Volume"
                                    size="sm"
                                    color="foreground"
                                    startContent={<TbVolume2 />}
                                    endContent={<TbVolume />}
                                    className="max-w-sm"
                                    value={volume}
                                    defaultValue={volume}
                                    onChange={(newValue:any) => {
                                        setVolume(Number(newValue));
                                        if (videoRef.current) {
                                            videoRef.current.volume = Number(newValue/100 );
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </CardBody>

                    <video
                        ref={videoRef}
                        src={currentPlaying?.audioLink}
                        className="hidden"
                        controls
                        preload="none"
                        autoPlay
                        onEnded={handleSongEnd}
                    ></video>
                </Card>
            </Draggable>

        </>
    );
};

export default Player;
