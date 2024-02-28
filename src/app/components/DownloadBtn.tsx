import React, { useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { TbDotsVertical } from "react-icons/tb";
import { PlayingItemType } from "./Contents";
import useDownloader from "react-use-downloader";
import { useDispatch, useSelector } from "react-redux";
import { VideoType, togglePicks } from "../redux/features/picksSlice";
import { RootState } from "../redux/store";
import toast, { Toaster } from 'react-hot-toast';


interface LinksProps {
    v?: VideoType;
}

const DownloadBtn: React.FC<LinksProps> = ({ v }) => {
    const dispatch = useDispatch();
    const [downloadLinks, setDownloadLinks] = useState<PlayingItemType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isPicked, setIsPicked] = useState<boolean>(false); // State to track if the video is picked
    const { download } = useDownloader();
    const picksList = useSelector((state: RootState) => state.picks);

    useEffect(() => {
        const fetchPicks = async () => {
            if (v) {
                setIsPicked(picksList.videos.some((videos)=>videos.vid === v.vid));
            }
        };

        fetchPicks();
    }, [v,picksList]); // Trigger the effect when vid changes

    const handleDownload = () => {
        if (!downloadLinks) return;
        download(downloadLinks.audioLink, "abcd.mp3");
    };

    const handleClick = () => {
        if (!v || loading) {
            toast.error("Please wait while the video is being fetched.");
            return;
        }
    
        setLoading(true);
    
        const fetchMusic = async () => {
            try {
                console.log("fetching...");
                const data = await fetch(`http://localhost:3001/api/${v.vid}`);
                const jsonData = await data.json();
                console.log(jsonData);
                setDownloadLinks(jsonData);
    
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching the video.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchMusic();
    };
    
    const handlePicks = () => {
        if (!v ) return;
        dispatch(togglePicks({vid: v.vid,title: v.title, thumbnail : v.thumbnail}));
        setIsPicked(prev=>!prev);
        if (!isPicked){

            toast.success("Added this  video to your picks!");
        }
        else{
            toast("Removed this video from picks!");
        }
        console.log("added: " + v.title);
    };

    return (
        <>
        <Toaster/>
        <Dropdown>
            <DropdownTrigger>
                <Button variant="light" color={"secondary"} isIconOnly>
                    <TbDotsVertical />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions">
                <DropdownItem onClick={handlePicks} color="default" className="">
                    {isPicked ? "Remove from Picks" : "Add to Picks"}
                </DropdownItem>
                <DropdownItem onClick={handleClick} color="default" className="">
                    {loading ? "Downloading..." : "Download"}
                </DropdownItem>
                <DropdownItem color="default" className="">
                    Share
                </DropdownItem>
                <DropdownItem color="danger" className="text-danger">
                    Pass Over
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        </>
    );
};

export default DownloadBtn;
