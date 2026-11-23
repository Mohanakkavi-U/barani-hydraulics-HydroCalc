import React, { useState } from 'react';

import {
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface DieCushionResult {
  description: string;
  cylinderSize: number;
  area: number;
  speed: number;
  inletFlow: number;
  outletFlow: number;
  pressure: number;
  force: string;
}

interface DieCushionResults {
  upSpeed: DieCushionResult;
  downSpeed: DieCushionResult;
  dieCushionCylinderPortSize: string;
  dieCushionPortSize: string; 
}

interface CustomerDetails {
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
}

interface InputState {
  customerDetails: CustomerDetails;
  upSpeed: {
    cylinderSize: string;
    speed: string;
    pressure: string;
  };
  downSpeed: {
    cylinderSize: string;
    speed: string;
    pressure: string;
  };
  dieCushionCylinderPortSize: string;
  dieCushionPortSize: string;
}

const calculateArea = (diameter: number): number => {
  return Math.PI * Math.pow(diameter / 2, 2);
};

const calculateFlow = (area: number, speed: number): number => {
  // Convert area from cm² to m² and speed from mm/sec to m/sec
  const areaInM2 = area / 10000;
  const speedInMS = speed / 1000;
  // Calculate flow in m³/sec and convert to LPM
  return areaInM2 * speedInMS * 60000;
};

const DieCushionCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<InputState>({
    customerDetails: {
      customerName: '',
      machineName: '',
      woNo: '',
      assemblyName: ''
    },
    upSpeed: {
      cylinderSize: '',
      speed: '',
      pressure: '',
    },
    downSpeed: {
      cylinderSize: '',
      speed: '',
      pressure: '',
    },
    dieCushionCylinderPortSize: '',
    dieCushionPortSize: '',
  });

  const handleInputChange = (section: 'upSpeed' | 'downSpeed', field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputs((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.value
      }
    }));
  };

  const handleCustomerDetailsChange = (field: keyof CustomerDetails) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputs((prev) => ({
      ...prev,
      customerDetails: {
        ...prev.customerDetails,
        [field]: event.target.value
      }
    }));
  };

  const handlePortSizeChange = (field: 'dieCushionCylinderPortSize' | 'dieCushionPortSize') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const calculateForce = (area: number, pressure: number): string => {
    // Area is in cm², pressure is in bar
    // Force (N) = Pressure (bar) * 100,000 (Pa/bar) * Area (m²)
    // Convert area from cm² to m²: 1 cm² = 0.0001 m²
    const areaInM2 = area * 0.0001;
    const forceInNewtons = pressure * 100000 * areaInM2;
    
    // Convert Newtons to Tons (1 ton = 9806.65 N)
    const forceInTons = forceInNewtons / 9806.65;
    
    // Return just the numeric value with 2 decimal places
    return forceInTons.toFixed(2);
  };

  const handleCalculate = () => {
    // Get input values
    const upSpeedCylinderSize = Number(inputs.upSpeed.cylinderSize);
    const downSpeedCylinderSize = Number(inputs.downSpeed.cylinderSize);
    const upSpeedPressure = Number(inputs.upSpeed.pressure) || 0;
    const downSpeedPressure = Number(inputs.downSpeed.pressure) || 0;

    // Calculate areas (in cm²)
    const upSpeedArea = calculateArea(upSpeedCylinderSize);
    const downSpeedArea = calculateArea(downSpeedCylinderSize);

    // Calculate flows (in LPM)
    const upSpeedFlow = calculateFlow(upSpeedArea, Number(inputs.upSpeed.speed));
    const downSpeedFlow = calculateFlow(downSpeedArea, Number(inputs.downSpeed.speed));

    // Calculate forces
    const upSpeedForce = calculateForce(upSpeedArea, upSpeedPressure);
    const downSpeedForce = calculateForce(downSpeedArea, downSpeedPressure);

    const results: DieCushionResults = {
      upSpeed: {
        description: 'UP SPEED',
        cylinderSize: upSpeedCylinderSize,
        area: Number(upSpeedArea.toFixed(1)),
        speed: Number(inputs.upSpeed.speed),
        inletFlow: Number(upSpeedFlow.toFixed(1)),
        outletFlow: 72, // This might need to be calculated based on your requirements
        pressure: upSpeedPressure,
        force: upSpeedForce
      },
      downSpeed: {
        description: 'DOWN SPEED',
        cylinderSize: downSpeedCylinderSize,
        area: Number(downSpeedArea.toFixed(1)),
        speed: Number(inputs.downSpeed.speed),
        inletFlow: Number(downSpeedFlow.toFixed(1)),
        outletFlow: 706.4, // This might need to be calculated based on your requirements
        pressure: downSpeedPressure,
        force: downSpeedForce
      },
      dieCushionCylinderPortSize: inputs.dieCushionCylinderPortSize || '1½″ REDUCER(38×38 PIPE)',
      dieCushionPortSize: inputs.dieCushionPortSize || '1″ REDUCER(25×25mm PIPE)',
      customerDetails: inputs.customerDetails,
    };

    navigate('/die-cushion-results', { state: { results } });
  };

  

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mt: 3,
        maxWidth: '1000px',
        width: '100%',
        mx: 'auto'
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        DIE CUSHION CYLINDERS-2NOS
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {/* Customer Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Customer Details
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Name"
              value={inputs.customerDetails.customerName}
              onChange={handleCustomerDetailsChange('customerName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Machine Name"
              value={inputs.customerDetails.machineName}
              onChange={handleCustomerDetailsChange('machineName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="W.O. No"
              value={inputs.customerDetails.woNo}
              onChange={handleCustomerDetailsChange('woNo')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Assembly Name"
              value={inputs.customerDetails.assemblyName}
              onChange={handleCustomerDetailsChange('assemblyName')}
            />
          </Grid>

          {/* Up Speed Inputs */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Up Speed
            </Typography>
            <TextField
              fullWidth
              label="Cylinder Size (mm)"
              value={inputs.upSpeed.cylinderSize}
              onChange={handleInputChange('upSpeed', 'cylinderSize')}
              type="number"
              sx={{ mb: 2 }}
              
            />
            <TextField
              fullWidth
              label="Speed (mm/sec)"
              value={inputs.upSpeed.speed}
              onChange={handleInputChange('upSpeed', 'speed')}
              type="number"
              sx={{ mb: 2 }}
              
            />
            <TextField
              fullWidth
              label="Pressure (bar)"
              value={inputs.upSpeed.pressure}
              onChange={handleInputChange('upSpeed', 'pressure')}
              type="number"
              
            />
          </Grid>

          {/* Down Speed Inputs */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Down Speed
            </Typography>
            <TextField
              fullWidth
              label="Cylinder Size (mm)"
              value={inputs.downSpeed.cylinderSize}
              onChange={handleInputChange('downSpeed', 'cylinderSize')}
              type="number"
              sx={{ mb: 2 }}
              
            />
            <TextField
              fullWidth
              label="Speed (mm/sec)"
              value={inputs.downSpeed.speed}
              onChange={handleInputChange('downSpeed', 'speed')}
              type="number"
              sx={{ mb: 2 }}
              
            />
            <TextField
              fullWidth
              label="Pressure (bar)"
              value={inputs.downSpeed.pressure}
              onChange={handleInputChange('downSpeed', 'pressure')}
              type="number"
              
            />
          </Grid>

          {/* Port Sizes */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Port Sizes
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Die Cushion Cylinder Port Size (A LINE SIZE)"
                  value={inputs.dieCushionCylinderPortSize}
                  onChange={handlePortSizeChange('dieCushionCylinderPortSize')}
                  
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Die Cushion Port Size (B LINE SIZE)"
                  value={inputs.dieCushionPortSize}
                  onChange={handlePortSizeChange('dieCushionPortSize')}
                  
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCalculate}
          sx={{ mt: 3 }}
          fullWidth
        >
          Calculate
        </Button>
      </Box>
    </Paper>
  );
};

export default DieCushionCalculator; 
