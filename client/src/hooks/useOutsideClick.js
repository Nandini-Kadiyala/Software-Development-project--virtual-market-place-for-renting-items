import { useEffect } from "react"

const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const handleOutsideClick = (e)=>{
            if(ref.current && !ref.current.contains(e.target)) 
                callback();
        }

        document.addEventListener('mousedown',handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown',handleOutsideClick);
        }
    },[ref,callback])
}

export default useOutsideClick;