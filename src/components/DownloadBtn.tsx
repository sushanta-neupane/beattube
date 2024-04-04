"use client"
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { TbDotsVertical } from "react-icons/tb";
import { PlayingItemType } from "./Contents";
import useDownloader from "react-use-downloader";
import { useDispatch, useSelector } from "react-redux";
import { VideoType, togglePicks } from "../redux/features/picksSlice";
import { RootState } from "../redux/store";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import Link from "next/link";

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
                setIsPicked(picksList.videos.some((videos) => videos.vid === v.vid));
            }
        };

        fetchPicks();
    }, [v, picksList]); // Trigger the effect when vid changes
    const router = useRouter()

    const handlePicks = () => {
        if (!v) return;
        dispatch(togglePicks({ vid: v.vid, title: v.title, thumbnail: v.thumbnail }));
        setIsPicked(prev => !prev);
        if (!isPicked) {

            toast.success("Added this  video to your picks!");
        }
        else {
            toast("Removed this video from picks!");
        }
        console.log("added: " + v.title);
    };

    return (
        <>
            <Toaster />
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
                    <DropdownItem color="default" className="">
                        <Link href={`${process.env.API_URI}/download?link=https://www.youtube.com/watch?v=${v?.vid}`} target="_blank">
                            {loading ? "Downloading..." : "Download"}
                        </Link>
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
