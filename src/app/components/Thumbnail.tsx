import Image from 'next/image';
import React from 'react';

interface ThumbnailProps {
  url: string | null;
  altText: string;
}

const Thumbnail = ({ url, altText }: ThumbnailProps) => {
  return (
    <>
      {url ? (
        <div className="relative w-100 h-80 overflow-hidden rounded-2xl">
          <Image
            src={url}
            alt={altText}
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="w-100 h-80 flex items-center justify-center bg-gray-400/50 rounded-2xl">
          <p className="text-black font-bold text-2xl">No Image</p>
        </div>
      )}
    </>
  );
};

export default Thumbnail;