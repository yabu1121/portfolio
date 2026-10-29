import Image from 'next/image';
import React from 'react';

interface ThumbnailProps {
  url: string | null;
  altText: string;
}

const MiniThumbnail = ({ url, altText }: ThumbnailProps) => {
  return (
    <>
      {url ? (
        <div className="relative w-30 h-30 overflow-hidden border border-line">
          <Image
            src={url}
            alt={altText}
            width={120}
            height={120}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="w-30 h-30 flex items-center justify-center border border-dashed border-line bg-surface">
          <p className="font-mono text-[11px] tracking-wider text-ink-3">NO IMAGE</p>
        </div>
      )}
    </>
  );
};

export default MiniThumbnail;