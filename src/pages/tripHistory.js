// pages/tripHistory.js
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, IconButton, Button, CardMedia } from '@mui/material';
import { useAuthInfo } from '../components/onboarding/useAuth';
import pin_location from '../../src/assets/pin_location.png';
import navigation_icon from '../../src/assets/navigation_icon.png';
import clock_icon from '../../src/assets/clock_icon.png';
import truck_image from '../../src/assets/truck.png';

const TripHistory = () => {
	const { org_id, user_id, apiFetch } = useAuthInfo();
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTrips = async () => {
			if (!org_id) return;

			try {
				const orgResp = await apiFetch(`${process.env.REACT_APP_BASE_URL}/organizations/user_org/?user_id=${user_id}`);

				if (!orgResp.ok) {
					throw new Error('Failed to fetch organization');
				}
				const orgData = await orgResp.json();
				const numericOrgId = orgData.id;
				const tripsResp = await apiFetch(`${process.env.REACT_APP_BASE_URL}/trips/${numericOrgId}/`);

				if (!tripsResp.ok) {
					throw new Error(`Network response was not ok (${tripsResp.status})`);
				}

				const tripsData = await tripsResp.json();
				setTrips(tripsData.filter(trip => trip.t_status === 'Completed'));
			} catch (error) {
				console.error('Error fetching trips:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchTrips();
	}, [org_id, user_id, apiFetch]);

	if (!org_id) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
				<Typography variant='h6' color='text.secondary'>
					Loading organization info...
				</Typography>
			</Box>
		);
	}

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
		<Box padding={2}>
			{trips.map(trip => (
				<Card
					key={trip.id}
					sx={{
						display: 'flex',
						marginBottom: 3,
						borderRadius: 5,
						alignItems: 'flex-start',
						justifyContent: 'space-between',
					}}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 5, marginLeft: 2 }}>
						<CardMedia component='img' sx={{ width: 130, marginTop: 2 }} image={truck_image} alt='Truck' />
					</Box>

					<Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 5, alignItems: 'flex-start' }}>
						<CardContent
							sx={{
								flex: '1 0 auto',
								alignContent: 'left',
								justifyContent: 'left',
								color: 'var(--main-text-color)',
								textAlign: 'left',
							}}
						>
							<Typography component='h4' variant='h4' sx={{ fontSize: 'large' }}>
								{trip.t_type}
							</Typography>

							<Typography variant='h6' sx={{ color: 'var(--gray-color)', fontSize: 'medium' }}>
								<IconButton aria-label='location'>
									<img src={pin_location} alt='location' width={20} height={25} />
								</IconButton>
								{trip.t_destination_place_query}
							</Typography>

							<Typography variant='h6' sx={{ color: 'var(--gray-color)', fontSize: 'small' }}>
								<IconButton aria-label='clock'>
									<img src={clock_icon} alt='clock' width={20} height={20} />
								</IconButton>
								{trip.t_duration}
							</Typography>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 'small' }}>
								<Button
									variant='contained'
									sx={{
										padding: 0,
										paddingRight: '5px',
										backgroundColor: 'var(--secondary-color)',
										width: 'fit-content',
										height: 30,
										fontSize: '0.55rem',
									}}
								>
									<IconButton aria-label='navigation'>
										<img src={navigation_icon} alt='navigation' width={15} height='inherit' />
									</IconButton>
									{trip.t_distance}
								</Button>
							</Box>

							<Typography sx={{ color: 'var(--main-text-color)', fontSize: 'medium' }}>Status: {trip.t_status}</Typography>
						</CardContent>
					</Box>
				</Card>
			))}
		</Box>
	);
};

export default TripHistory;
