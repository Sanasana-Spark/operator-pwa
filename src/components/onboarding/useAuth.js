// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
const baseURL = process.env.REACT_APP_BASE_URL

export const useAuth = () => {
    
    const { user } = useUser();
    const [organization, setOrganization] = useState(null);

    const userId = user?.id;
    const userEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    const fetchOrganization = async () => {
      if (userId) {
        try {
          const response = await fetch(`${baseURL}/organizations/?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            // Assuming data is an array with one item
            if (Array.isArray(data) && data.length > 0) {
              setOrganization(data[0]);
            } else {
              console.error('Error: Organization data is not an array or is empty');
            }
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
