"use client"

import { useEffect } from 'react';
import { useMyContext } from '@/store/passportStore';

export default function MyPage() {
  const { passportState: passportInstance,  } = useMyContext();
  useEffect(() => {
    async function handleLoginCallback() {
      if (!passportInstance) {
        return
      }
    try {
        console.log("login callback");
        await passportInstance.loginCallback();
    }
    catch (err) {
        console.error("login callback error", err);
    }
    }
    handleLoginCallback()
  }, []);

  return (
    <div/>
  );
}
