import React, {useContext, useEffect, useState} from 'react'
import AppContext from '../AppContext'
import PropertyCard from './PropertyCard'
import LoaderFull from './LoaderFull'
import { IoHome } from "react-icons/io5";

const Liked = () => {
    const {user,properties,loading} = useContext(AppContext);
    const [list,setList] = useState([]);


    if(loading){
        return (<LoaderFull/>)
    }

    return (
        user?.token ? <div className='p-2 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2'>
            {properties?.filter(property=>user?.likedProperties?.includes(property._id))?.map((property,index)=>(
                <PropertyCard key={index} property={property}/>
            ))}
        </div> :
        <div className='w-full h-[80vh] flex flex-col items-center justify-center'>
            <IoHome className='text-primary/50 text-9xl'/>
            <span className='text-primary/50 text-4xl text-center'>Login/Register to <br/>Like & Save Properties!</span>
        </div>
    )
}

export default Liked;