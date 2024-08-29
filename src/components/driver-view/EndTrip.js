import React, { useState, useRef } from 'react';
import odometerImage from '../../assets/odometer.png';
import successTickImage from '../../assets/successTick.png';

const EndTrip = ({ onEndTrip }) => {
  const [showModal, setShowModal] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFuelUsageModal, setShowFuelUsageModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  const handleOpenCamera = async () => {
    setShowModal(false); // Close request fuel modal
    setShowCamera(true); // Show camera

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera: ", error);
      alert("Error accessing camera. Please ensure you have allowed camera access.");
    }
  };

  const handleTakePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      // const imageData = canvasRef.current.toDataURL('image/png');

      // Stop the camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      // Clear canvas
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      setShowCamera(false); // Hide camera
      setShowProcessingModal(true); // Show processing modal

      setTimeout(() => {
        setShowProcessingModal(false); // Hide processing modal after some time
        setShowFuelUsageModal(true); // Show fuel usage modal after processing
      }, 5000); // Simulate processing time
    }
  };

  const handleFuelUsageModalClose = () => {
    setShowFuelUsageModal(false); // Hide fuel usage modal
    setShowSuccessModal(true); // Show success modal
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false); // Hide success modal
    onEndTrip(); // Call the onEndTrip callback to notify that the trip has ended
  };

  return (
    <div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <img src={odometerImage} alt="Odometer" className="odometer-img" />
            <h2>Upload Picture of the Odometer</h2>
            <p>To finalize the trip, please upload a picture of the odometer.</p>
            <button className="blue-button" onClick={handleOpenCamera}>
              Open Camera
            </button>
            <button className="white-button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {showCamera && (
        <div className="modal">
          <div className="modal-content">
            <video ref={videoRef} className="video-feed"></video>
            <div>
              <button className="blue-button" onClick={handleTakePicture}>
                Take Picture
              </button>
            </div>
          </div>
        </div>
      )}
      {showProcessingModal && (
        <div className="modal">
          <div className="modal-content processing-modal">
            <h3>Processing...</h3>
          </div>
        </div>
      )}
      {showFuelUsageModal && (
        <div className="modal">
          <div className="modal-content result-modal">
            <h2>Fuel Usage and Distance</h2>
            <p>You have used 15 liters of fuel and traveled 1000 kilometers.</p>
            <div>
              <button className="blue-button big-button" onClick={handleFuelUsageModalClose}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content result-modal">
            <img src={successTickImage} alt="Success tick" className="gas-filler-img" />
            <h2>Trip Ended Successfully</h2>
            <p>Click the button below to go back to your assigned trips for the day.</p>
            <div>
              <button className="blue-button big-button" onClick={handleSuccessModalClose}>
                Assigned Trips
              </button>
            </div>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
    </div>
  );
};

export default EndTrip;
