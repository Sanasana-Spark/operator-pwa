import React, { useState, useEffect, useRef } from 'react';
import './DriverView.css';
import profileImage from '../../assets/profileImage.png';
import odometerImage from '../../assets/odometer.png';
import spinningWheel from '../../assets/spinningWheel.png';
import gasFillerImage from '../../assets/gasFiller.png';
import successTickImage from '../../assets/successTick.png';
import Trip from './Trip';
import EndTrip from './EndTrip';
import { useAuthContext } from "../../components/onboarding/authProvider"; 
import Map from "../../components/maps/singleTripMap";



const DriverView = () => {
  const { userId, org_id, userEmail } = useAuthContext();
  const center = { lat: 5.66667, lng: 0.0 };
  const baseURL = process.env.REACT_APP_BASE_URL; 
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showStartTripButton, setShowStartTripButton] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [tripEnded, setTripEnded] = useState(false);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  // eslint-disable-next-line
  const [driverLocation, setDriverLocation] = useState(null);
  // eslint-disable-next-line
  const [distanceRemaining, setDistanceRemaining] = useState(null);
  // eslint-disable-next-line
  const [inProgressTrip, setInProgressTrip] = useState(null);
  // eslint-disable-next-line
  const [inProgressTripId, setInProgressTripId] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);


  useEffect(() => {
    const apiUrl = `${baseURL}/trips?userEmail=${userEmail}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTripDetails(data);
        setLoading(false);

        // Find the first trip with status "In-progress"
        const inProgressTrip = data.find(
          (trip) => trip.t_status === "In-progress"
        );
        if (inProgressTrip) {
          setInProgressTrip(inProgressTrip);
          setInProgressTripId(inProgressTrip.id);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  },);




  useEffect(() => {
    const getDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDriverLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error('Error getting driver location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getDriverLocation();
  }, []);

  const handleRequestFuel = () => {
    setShowModal(true);
  };

  const handleOpenCamera = async () => {
    setShowModal(false);
    setShowCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Error accessing camera. Please ensure you have allowed camera access.');
    }
  };

  const handleTakePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      const imageData = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageData); // Store the captured image

      // const imageData = canvasRef.current.toDataURL('image/png');


      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      setShowCamera(false);
      setShowProcessingModal(true);

      setTimeout(() => {
        setShowProcessingModal(false);
        setShowResultModal(true);
      }, 5000);
    }
  };

  const handleProceed = async () => {
    const payload = {
      f_created_by: userId,
      f_organization_id: org_id,
      f_operator_id: tripDetails?.t_operator_id,
      f_asset_id: tripDetails?.t_asset_id,
      f_trip_id: tripDetails?.t_trip_id,
      f_odometer_image: capturedImage,
    };

    try {
      const response = await fetch(`${baseURL}/fuel/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowResultModal(false);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          setShowSuccessMessage(true);
          setShowStartTripButton(true);
        }, 3000);
      } else {
        console.error('Error posting fuel request:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting fuel request:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTripEnd = () => {
    setTripEnded(true);
  };

  return (
    <div className="driver-view">


      <Map startpoint={center} endpoint={center} key={1} />

      <div className="delivery-info">
        <img src={profileImage} alt="Delivery" className="delivery-pic" /> {/* Assuming this is the truck image */}
        <div className="delivery-details">
          <h4>Sand delivery</h4>
          <p>{tripDetails?.destination || 'Destination not available'}</p>
          <p>{tripDetails?.time}</p>
          <div className="delivery-rating">
            <span className="rating-label">Rating:</span>
            <span className="rating">{tripDetails?.rating || 'N/A'}</span>
            <span className="distance">
              {distanceRemaining !== null ? `Distance Remaining: ${distanceRemaining.toFixed(2)} km` : 'Calculating...'}
            </span>
          </div>
        </div>
      </div>
      {showStartTripButton ? (
        <Trip tripDistance={tripDetails?.distance || 5} onTripEnd={handleTripEnd} />
      ) : (
        <button className="request-fuel" onClick={handleRequestFuel}>
          Request fuel
        </button>
      )}
      {tripEnded && <EndTrip />} {/* Render EndTrip component if trip has ended */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <img src={odometerImage} alt="Odometer" className="odometer-img" />
            <h2>Upload Picture of the Odometer</h2>
            <p>To determine the amount of fuel needed for the trip, upload a picture of the odometer.</p>
            <button className="blue-button" onClick={handleOpenCamera}>
              Open Camera
            </button>
            <button className="white-button" onClick={handleCloseModal}>
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
            <img src={spinningWheel} alt="Processing" className="processing-img" />
            <h3>Analyzing data...</h3>
          </div>
        </div>
      )}
      {showResultModal && (
        <div className="modal">
          <div className="modal-content result-modal">
            <img src={gasFillerImage} alt="Gas filler" className="gas-filler-img" />
            <h2>$100</h2> {/* This should be dynamic based on some calculation */}
            <p>According to the trip duration, this is the amount of fuel needed to complete your journey.</p>
            <div>
              <button className="blue-button big-button" onClick={handleProceed}>
                Proceed
              </button>
              <button className="white-button big-button" onClick={() => setShowResultModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content success-modal">
            <img src={successTickImage} alt="Success" className="success-tick-img" />
            <h3>Refuel request successful</h3>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <div className="success-popup">
          <p>Refuel request successful!</p>
        </div>
      )}
    </div>
  );
};

export default DriverView;
