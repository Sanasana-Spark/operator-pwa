// components/PostToBackendComponent.js
import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useAuth } from './useAuth';
const baseURL = process.env.REACT_APP_BASE_URL

function PostToBackendComponent() {
  const { userId, userEmail, organization } = useAuth();

  const handlePost = async () => {
    const postData = {
      userId,
      userEmail,
      organizationId: organization?.id,
      // ... other data you want to post
    };

    try {
      const response = await fetch('baseURL/organisation/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
      } else {
        console.error('Error posting data:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  return (
    <div>
      <UserButton />
      <button onClick={handlePost}>Post to Backend</button>
    </div>
  );
}

export default PostToBackendComponent;
