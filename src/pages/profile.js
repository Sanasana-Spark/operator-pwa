/* eslint-disable no-undef */
import React, {useState, useEffect} from 'react';
import {Box, Typography, Avatar, Card, CardContent,
   LinearProgress, List, ListItem, ListItemIcon, ListItemText, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider} from '@mui/material'
import ChevronRightIcon     from '@mui/icons-material/ChevronRight'
import { C } from '../index'
import { UserButton } from "@clerk/clerk-react";
import { useAuthContext } from "../components/onboarding/authProvider";


// SVG score ring
function ScoreRing({ score }) {
  const r = 30
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={C.lime} strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 36 36)" />
      <text x="36" y="41" textAnchor="middle"
        fontSize="14" fontWeight="800" fill="white" fontFamily="Plus Jakarta Sans, sans-serif">
        {score}
      </text>
    </svg>
  )
}

export const driver = {
    initials:'JO', name:'Driver Name', vehicle:'KBZ 012A', vehicleType:'Toyota Hiace',
    city:'Nairobi', score:96, rating:'Excellent', km:4220, trips:12, efficiency:11.2, incidents:0,
    scores:{ safety:94, fuel:88, punctual:98 },
}

const MENU = [
  { icon: '🚐', label: `My vehicle — ${driver.vehicle}`, id: 'vehicle' },
  { icon: '📊', label: 'Performance history',             id: 'perf' },
  { icon: '💰', label: 'Expense claims',                  id: 'expense' },
  { icon: '🌿', label: 'My carbon footprint',             id: 'carbon' },
  { icon: '⚙',  label: 'Settings',                        id: 'settings' }
]

const Profile = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { apiFetch } = useAuthContext();
  const [, setLoading] = useState(true);
  const [, setDriver] = useState(null);

  const [vehicleOpen, setVehicleOpen] = useState(false)
  const [carbonOpen, setCarbonOpen]   = useState(false)

  const handleMenu = (id) => {
    if (id === 'vehicle')  { setVehicleOpen(true); return }
    if (id === 'carbon')   { setCarbonOpen(true); return }
  }

  useEffect(() => {
    const apiUrl = `${baseURL}/trips/by_user/`;
    apiFetch(apiUrl, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        setDriver(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL, apiFetch]);
  


  return (
     <Box sx={{ pb: 2 }}>
    {/* Header */}
      <Box sx={{
        px: 2.5, pt: 2, pb: 1.5,
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center',
      }}>
        <Typography variant="h3" sx={{ flex: 1 }}>My Profile</Typography>
      </Box>


    <Box sx={{ textAlign: 'center', pt: 3, pb: 2.5 }}>
      <Avatar sx={{
          width: 72, height: 72,
          background: C.forest,
          border: `3px solid ${C.lime}`,
          mx: 'auto', mb: 1.25,
          fontSize: '1.5rem', fontWeight: 800,
        }}>
          <UserButton  afterSignOutUrl="/signin"  />
        </Avatar>

        <Typography sx={{ fontSize: '1.1875rem', fontWeight: 800, letterSpacing: '-0.3px', mb: 0.25 }}>
          {driver.name}
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)' }}>
          Driver · {driver.vehicle} · {driver.city}
        </Typography>

        
    </Box>



      {/* Score ring card */}
      <Box sx={{ mx: 2, mb: 2 }}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScoreRing score={driver.score} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, mb: 1 }}>
                Driver Score — {driver.rating}
              </Typography>
              {[
                { label: 'Safety',      pct: driver.scores.safety,   color: C.lime },
                { label: 'Fuel eff.',   pct: driver.scores.fuel,     color: C.lime2 },
                { label: 'Punctual',    pct: driver.scores.punctual, color: C.teal },
              ].map(bar => (
                <Box key={bar.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', width: 60, flexShrink: 0 }}>
                    {bar.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={bar.pct}
                    sx={{ flex: 1, '& .MuiLinearProgress-bar': { background: bar.color } }}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

         {/* Stats grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25, px: 2, mb: 2 }}>
        {[
          { v: driver.km.toLocaleString(), l: 'km this month' },
          { v: driver.trips,               l: 'trips completed' },
          { v: driver.efficiency,          l: 'avg km/L efficiency' },
          { v: driver.incidents,           l: 'incidents this month', color: C.lime2 },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent sx={{ p: '14px !important' }}>
              <Typography sx={{
                fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.4px',
                color: s.color || 'white', mb: 0.375,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {s.v}
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)' }}>
                {s.l}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

            {/* Menu list */}
      <Box sx={{ mx: 2 }}>
        <Card>
          <CardContent sx={{ p: '0 16px !important' }}>
            <List disablePadding>
              {MENU.map((item, i) => (
                <ListItem
                  key={item.id}
                  button
                  onClick={() => handleMenu(item.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemIcon sx={{ fontSize: '0.9375rem' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: item.red ? 'rgba(229,54,58,0.8)' : 'white',
                    }}
                  />
                  <ChevronRightIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.25)' }} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>


          {/* Vehicle dialog */}
      <Dialog open={vehicleOpen} onClose={() => setVehicleOpen(false)}>
        <DialogTitle>My vehicle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mt: 0.5 }}>
            {[
              { l: 'Registration', v: driver.vehicle },
              { l: 'Make',         v: driver.vehicleType },
              { l: 'City',         v: driver.city },
              { l: 'Status',       v: 'Active' },
              { l: 'Last service', v: '12 May 2026' },
              { l: 'Odometer',     v: '84,220 km' },
            ].map((s, i) => (
              <Box key={i} sx={{ background: C.card, borderRadius: 2, p: 1.5, border: `1px solid ${C.border}` }}>
                <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', mb: 0.375 }}>{s.l}</Typography>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>{s.v}</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" fullWidth onClick={() => setVehicleOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Carbon dialog */}
      <Dialog open={carbonOpen} onClose={() => setCarbonOpen(false)}>
        <DialogTitle>My carbon footprint</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>
              CO₂ this month (estimated)
            </Typography>
            <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: C.lime, letterSpacing: '-1px', fontFamily: "'JetBrains Mono',monospace" }}>
              270 kg
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: C.lime2, mb: 2 }}>
              ↓ 18% vs last month — well done 🌿
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1.5 }}>
            {[
              { l: 'Routes optimised this month', v: '8 trips' },
              { l: 'Avg fuel efficiency',          v: '11.2 km/L' },
              { l: 'Total km driven',              v: '4,220 km' },
            ].map((s, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>{s.l}</Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>{s.v}</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" fullWidth onClick={() => setCarbonOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>


    </Box>
   
  )
}

export default Profile