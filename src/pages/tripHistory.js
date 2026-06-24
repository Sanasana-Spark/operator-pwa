// pages/tripHistory.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress} from '@mui/material';
import { useAuthInfo } from '../components/onboarding/useAuth';

const TripHistory = () => {
	const baseURL = process.env.REACT_APP_BASE_URL;
	const { apiFetch } = useAuthInfo();
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const apiUrl = `${baseURL}/trips/by_user/`;
		apiFetch(apiUrl, { method: 'GET' })
		.then((response) => {
			if (!response.ok) {
			throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			setTrips(data.filter((trip) => trip.t_status === "Completed"));
			setLoading(false);
		})
		.catch((error) => {
			console.error("Error fetching data:", error);
			setLoading(false);
		});
	}, [baseURL, apiFetch]);

	if (loading) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
				<CircularProgress />
			</Box>
		);
	}

	if (trips.length === 0) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
				<Typography variant='h6' color='text.secondary'>
					No completed trips found.
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ mx: 2, mt: 1.5, mb: 0.5 }}>
			{trips.map(trip => (
			
    <div class="trip-row">
		 <div class="tr-head">
		<div class="tr-num">{trip.t_type}</div>
		 <div class="tc-badge b-green">{trip.t_status}</div>
		</div>
        <div class="tr-head">
          <div class="tr-route">{trip.t_origin_place_query} → {trip.t_destination_place_query}</div>
        </div>
        <div class="tr-body">
          <div><div class="tr-stat-l">Distance</div><div class="tr-stat-v">{trip.t_distance}</div></div>
          <div><div class="tr-stat-l">Duration</div><div class="tr-stat-v">{trip.t_duration}</div></div>
          <div><div class="tr-stat-l">Date</div><div class="tr-stat-v"> {new Date(trip.t_start_date).toLocaleDateString('en-GB')}
			</div></div>
        </div>
    </div>

			))}
		</Box>
	);
};

export default TripHistory;
