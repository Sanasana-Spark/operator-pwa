// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
const baseURL = process.env.REACT_APP_BASE_URL

export const useAuth = () => {
    
    const { user } = useUser();
    const [organization, setOrganization] = useState(null);


    const userId = user?.id;
    const user_id = user?.id;
    const userEmail = user?.emailAddresses[0]?.emailAddress; 
    const user_email = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    const fetchOrganization = async () =>  {
      if (user_id) {
        try {
          // const response = await fetch(`${baseURL}/organizations/?userId=${userId}`);
          const response = await fetch(`${baseURL}/organizations/user_org/?user_id=${user_id}&user_email=${user_email}`);
          if (response.ok) {
            const data = await response.json();
            setOrganization(data);
          } else {
            console.error('Error fetching organization:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching organization:', error);
        }
      }
    };


    fetchOrganization();
  }, [userId]);

  const org_id = organization?.id;
  const org_name = organization?.org_name;

  return { userId, userEmail,org_id, org_name };
};
