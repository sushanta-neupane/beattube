import React, { useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { TbDotsVertical } from "react-icons/tb";
import { PlayingItemType } from "./Contents";

interface LinksProps {
    vid?: string;
}

const DownloadBtn: React.FC<LinksProps> = ({ vid }) => {
    const [downloadLinks, setDownloadLinks] = useState<PlayingItemType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleDownload = () => {
        if (!downloadLinks) return;
        const link = document.createElement('a');
        link.href = downloadLinks.audioLink;
        link.download = "music";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
      if (downloadLinks) {
          handleDownload();
      }
  }, [downloadLinks]);

    const handleClick = () => {
        if (!vid) {
            alert("Error: Video ID not provided");
            return;
        }

        setLoading(true);

        const fetchMusic = async () => {
            try {
                console.log("fetching...");
                const data = await fetch(`http://localhost:3001/api/${vid}`);
                const jsonData = await data.json();
                console.log(jsonData);
                setDownloadLinks(jsonData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();
    };

    const items = [
        {
            key: "picks",
            label: "Add to Picks",
        },
        {
            key: "share",
            label: "Share",
        },
        {
            key: "download",
            label: "Download",
            clkFun: handleClick,
        },
        {
            key: "pass",
            label: "Pass Over",
        }
    ];

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="light" color={'secondary'} isIconOnly>
                    <TbDotsVertical />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions" items={items}>
                {(item) => (
                    <DropdownItem
                        onClick={() => item.clkFun ? item.clkFun() : null}
                        key={item.key}
                        color={item.key === "pass" ? "danger" : "default"}
                        className={item.key === "pass" ? "text-danger" : ""}
                    >
                        {loading && item.key === "download" ? "Downloading..." : item.label}
                    </DropdownItem>
                )}
            </DropdownMenu>
        </Dropdown>
    );
};

export default DownloadBtn;
