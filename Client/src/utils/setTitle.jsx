import { useEffect } from 'react';

const SetTitle = ({ title }) => {
  useEffect(() => {
    document.title = title || "Judul Default";
  }, [title]); 

  return null; 
}

export default SetTitle;