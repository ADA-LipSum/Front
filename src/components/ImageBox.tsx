import React from 'react';

type ImageBoxProps = {
    src: string;
    alt?: string;
    className?: string;
    fit?: 'cover' | 'contain';
    rounded?: boolean;
};

const ImageBox: React.FC<ImageBoxProps> = ({ src, alt = '', className = '', fit = 'cover', rounded = true }) => {
    const baseClass = 'bg-center bg-no-repeat overflow-hidden'; // ✅ aspect-[4/3] 제거
    const roundedClass = rounded ? ' rounded-xl' : '';
    const finalClassName = `${baseClass}${roundedClass}${className ? ' ' + className : ''}`;

    return (
        <div
            role="img"
            aria-label={alt}
            className={finalClassName}
            style={{
                backgroundImage: `url(${src})`,
                backgroundSize: fit, // cover or contain
            }}
        />
    );
};

export default ImageBox;
