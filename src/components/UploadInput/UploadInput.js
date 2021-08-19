import { Avatar } from '@material-ui/core';
import { useState } from 'react';
import ImageIcon from '@material-ui/icons/Image';
// import { AppIcon } from '../';

/**
 * Renders "File Input" control with "Preview Image"
 */
const UploadInput = ({ className, alt, id, name, onFileChange, ...restOfProps }) => {
  const [url, setUrl] = useState('');

  const handleChange = (event) => {
    // const newFile = event.target.files[0];
    const newFile = event?.currentTarget?.files?.[0];
    if (newFile) {
      const newUrl = URL.createObjectURL(newFile);
      setUrl(newUrl);
    } else {
      setUrl('');
    }

    // Notify parent component about file changes
    if (typeof onFileChange === 'function') {
      onFileChange(event, name, newFile);
    }
  };

  return (
    <>
      <input hidden type="file" id={id || name} name={name} onChange={handleChange} {...restOfProps} />
      <label htmlFor={id || name}>
        <Avatar className={className} src={url} variant="rounded" alt={alt}>
          <ImageIcon />
        </Avatar>
      </label>
    </>
  );
};

export default UploadInput;
