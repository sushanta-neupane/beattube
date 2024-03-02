"use client"
import React from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Popover, PopoverTrigger, PopoverContent, Listbox, ListboxItem } from "@nextui-org/react";
import { TbHeart, TbHeartFilled } from 'react-icons/tb';
import { PicksType, removeAllPicks } from '../redux/features/picksSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { UseDispatch } from 'react-redux';
import Player from './PlaylistPlayer';
interface PropsType {
  picks: PicksType
}
const Picks = ({ picks }: PropsType) => {
  const data = useSelector((state: RootState) => state.picks)
  const handleStore = () => {
    console.log(data)
    localStorage.setItem("Picks", JSON.stringify(data))
  }

  const dispatch = useDispatch();
  const handleClearAll = () => {
    dispatch(removeAllPicks('')); // Dispatch the action to remove all picks
  };

  const handlePlay = () => {
    
  };
  return (
    <>
      <Toaster />


      <Popover>
        <PopoverTrigger>
          <Button
            variant="light"
            isIconOnly
            onClick={handleStore}
          >
            <TbHeartFilled color='#d43635' />
          </Button>
        </PopoverTrigger>

        <PopoverContent aria-label="Static Actions">

        <div key={90}>
            <div className='hover:bg-transparent'>

              <div className="flex justify-between mb-4 w-full">
                <div>
                  <Player/>
                </div>
                <div>
                  <Button variant="light" onClick={handleClearAll}>Clear All</Button>
                </div>
              </div>
            </div>
          </div>

          <Listbox>

          {picks.videos.map((item, index) => (
            <ListboxItem key={`${index}`} >

              <div className="flex items-center max-w-[25rem]">

                <div className="relative inline-block shrink-0">
                  <img className="w-12 h-12 rounded-full object-cover" src={item.thumbnail} alt="Jese Leos image" />
                  <span className="absolute bottom-0 right-0 inline-flex items-center justify-center w-6 h-6 bg-white rounded-full">
                    <TbHeartFilled color='#d43635' />
                    <span className="sr-only">Like icon</span>
                  </span>
                </div>
                <div className="ms-3 text-sm font-normal">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 truncate">{item.title}</div>
                  <div className="text-sm font-normal">added to picks.</div>



                  <span className="text-xs font-medium text-blue-600 dark:text-blue-500">{item.vid}</span>
                </div>
              </div>


            </ListboxItem>
          ))}
          </Listbox>
        

          

        </PopoverContent>
      </Popover>

      
      
    </>
  )
}

export default Picks