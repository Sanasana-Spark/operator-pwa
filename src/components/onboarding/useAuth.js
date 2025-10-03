// hooks/useAuth.js
import { useEffect, useState, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
const baseURL = process.env.REACT_APP_BASE_URL

export const useAuthInfo = () => {   
    const { user } = useUser();
    const [organization, setOrganization] = useState(null);
    const { getToken } = useAuth();

    const userId = user?.id;
    const user_id = user?.id;
    const userEmail = user?.emailAddresses[0]?.emailAddress; 
    const user_email = user?.emailAddresses[0]?.emailAddress;
    const user_org = user?.organizationMemberships[0]?.organization?.id;

  const apiFetch = useCallback(async (url, options = {}) => {
    const token = await getToken();
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }, [getToken]);

  useEffect(() => {
    const fetchOrganization = async () => {
      const token = await getToken({template: "sanasana"});
      if (user_id) {
        try {
          const apiUrl = `${baseURL}/organizations/user_org/?user_id=${user_id}&user_email=${user_email}`;
          const response = await fetch(apiUrl,
            {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            });

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
  }, [user_id, user_email, getToken]);





  const org_id = organization?.id;
  const org_name = organization?.org_name;
  const org_currency = organization?.org_currency;
  const org_logo = organization?.org_logo;
  const org_country = organization?.org_country;
  const org_phone = organization?.org_phone;
  const org_email = organization?.org_email;


  return { userId,user_id,userEmail,user_email,user_org,org_id, org_name, org_currency,
     org_logo, org_country, org_phone, org_email, apiFetch };

};
