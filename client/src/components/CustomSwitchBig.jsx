import React, { useContext, useState } from 'react'

const CustomSwitch = ({currOption,setOption,options=[]}) => {
    return (
        <div className='rounded-lg flex items-center justify-center w-full gap-1'>
            {options.map(option=>(
                <div
                    key={option}
                    className={`${currOption===option ? "bg-primary text-white" : " hover:bg-neutral-200 duration-200"}
                    px-10 h-8 w-full text-sm rounded-lg shadow-lg flex items-center justify-center cursor-pointer`} 
                    onClick={()=>setOption(option)}
                >
                    {option}
                </div>
            ))}
        </div>
    )
}

export default CustomSwitch