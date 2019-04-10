import React, { ReactText } from 'react';

// Defines news preview props
export type ArticlePreviewProps = {
  id: ReactText;
  // language
  title: string;
  perex: string;
  content: string;
  // attributes
  duration: ReactText;
  dateOfPublish: ReactText;
  // behaviors
  onUpdate: () => void;
  onRemove: () => void;
};

// Displays preview of ArticleModel (remote data)
const ArticlePreview: React.FC<ArticlePreviewProps> = props => {
  const {
    id,
    title,
    perex,
    content,
    duration,
    dateOfPublish,
    onUpdate,
    onRemove
  } = props;
  return (
    <div>
      <h4>{title}</h4>
      <h5>{perex}</h5>
      <p>{content}</p>
      <p>
        <small>{`ID: ${id} (${dateOfPublish}, ${duration}min)`}</small>
      </p>
      <p>
        <button type="button" onClick={onUpdate}>
          update
        </button>
        <button type="button" onClick={onRemove}>
          remove
        </button>
      </p>
    </div>
  );
};

// exports
export { ArticlePreview };
