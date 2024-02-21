import { Spinner } from '@nextui-org/react'
import React from 'react'
interface LoadSpinnerProps {
  label: string;
}
const LoadSpinner:React.FC<LoadSpinnerProps> = ({label}) => {
  return (
    <div className='flex justify-center items-center h-screen backdrop-blur-3xl bg-black/5'>
        <Spinner label={label} />
    </div>
  )
}

export default LoadSpinner