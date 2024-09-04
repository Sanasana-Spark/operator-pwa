import React, { useState } from 'react';
import { Button, Typography, Box, Modal, Card, CardContent } from '@mui/material';

const RequestFuel = ({ trip, baseURL }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [creditedAmount, setCreditedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleCapture = (event) => {
    const image = event.target.files[0];
    setCapturedImage(image);
  };

  const handleSubmit = () => {
    if (!capturedImage) {
      alert('Please capture an odometer image first.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('f_created_by', trip.userId);
    formData.append('f_organization_id', trip.org_id);
    formData.append('f_operator_id', trip.t_operator_id);
    formData.append('f_asset_id', trip.t_asset_id);
    formData.append('f_trip_id', trip.id);
    formData.append('f_odometer_image', capturedImage);

    fetch(`${baseURL}/fuel/create`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setCreditedAmount(data.creditedAmount); // Assuming the backend response contains 'creditedAmount'
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error submitting fuel request:', error);
      });
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Request Fuel
      </Button>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Card sx={{ maxWidth: 500, margin: 'auto', mt: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h6">Upload Odometer Image</Typography>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? 'Requesting...' : 'Submit Request'}
            </Button>
            {creditedAmount && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Fuel credited: ${creditedAmount}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Modal>
    </Box>
  );
};

export default RequestFuel;
