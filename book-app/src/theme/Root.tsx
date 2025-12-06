import React, { ReactNode } from 'react';
import OriginalRoot from '@theme-original/Root';
import ChatWidget from '@site/src/components/ChatWidget';

interface RootProps {
  children: ReactNode;
}

export default function Root(props: RootProps): JSX.Element {
  return (
    <>
      <OriginalRoot {...props} />
      <ChatWidget />
    </>
  );
}