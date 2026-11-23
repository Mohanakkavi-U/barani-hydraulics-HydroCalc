import React, { useState, ChangeEvent } from 'react';
import { Typography, TextField, Button, Paper, Grid, Alert, Snackbar, IconButton } from '@mui/material';
import TonnageResultsComponent from './TonnageResults';

interface TonnageValues {
  cylinderBore: string;
  pressure: string;
  yieldStrength: string;
  factorOfSafety: string;
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
}

interface TonnageResults {
  area: string;
  tons: string;
  workingStress: string;
  wallThickness: string;
  inputValues: TonnageValues;
}

const TonnageCalculator: React.FC = () => {
  const [values, setValues] = useState<TonnageValues>({
    cylinderBore: '',
    pressure: '',
    yieldStrength: '',
    factorOfSafety: '',
    customerName: '',
    machineName: '',
    woNo: '',
    assemblyName: '',
  });

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<TonnageResults | null>(null);
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const handleChange = (prop: keyof TonnageValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValues({ ...values, [prop]: newValue });
  };

  const validateInputs = () => {
    const requiredFields = [
      { key: 'cylinderBore', label: 'Cylinder Bore' },
      { key: 'pressure', label: 'Pressure' },
      { key: 'yieldStrength', label: 'Yield Strength' },
      { key: 'factorOfSafety', label: 'Factor of Safety' }
    ];

    for (const field of requiredFields) {
      if (!values[field.key as keyof TonnageValues]) {
        throw new Error(`Please enter ${field.label}`);
      }
      const value = parseFloat(values[field.key as keyof TonnageValues]);
      if (isNaN(value) || value <= 0) {
        throw new Error(`${field.label} must be a positive number`);
      }
    }
  };

  const calculateResults = () => {
    try {
      validateInputs();

      const bore = parseFloat(values.cylinderBore); // Already in cm
      const pressure = parseFloat(values.pressure);
      const yieldStrength = parseFloat(values.yieldStrength);
      const fos = parseFloat(values.factorOfSafety);

      // Calculate Area (π × D²/4) in cm²
      const area = Math.PI * Math.pow(bore, 2) / 4;

      // Calculate Tons (P × A / 1000)
      const tons = (pressure * area) / 1000;

      // Calculate Working Stress (σy/FOS) in kg/cm²
      const workingStress = yieldStrength / fos;

      // Calculate Wall Thickness (D × P) / (2 × σ) in cm
      const wallThickness = (bore * pressure) / (2 * workingStress);

      const calculatedResults: TonnageResults = {
        area: area.toFixed(3),
        tons: tons.toFixed(3),
        workingStress: workingStress.toFixed(3),
        wallThickness: wallThickness.toFixed(3),
        inputValues: { ...values }  // Make a copy of values to avoid reference issues
      };

      setResults(calculatedResults);
      setShowResults(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setShowError(true);
      } else {
        setError('An unexpected error occurred');
        setShowError(true);
      }
      console.error('Error in calculations:', error);
    }
  };

  if (showResults && results) {
    return (
      <TonnageResultsComponent results={results} setShowResults={setShowResults} />
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2, maxWidth: '800px', mx: 'auto' }}>
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        Tonnage & Cylinder Wall Thickness Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Customer Details */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            Customer Details
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Customer Name"
            value={values.customerName}
            onChange={handleChange('customerName')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Machine Name"
            value={values.machineName}
            onChange={handleChange('machineName')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="WO. NO"
            value={values.woNo}
            onChange={handleChange('woNo')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Assembly Name"
            value={values.assemblyName}
            onChange={handleChange('assemblyName')}
          />
        </Grid>

        {/* Technical Inputs */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            Technical Specifications
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cylinder Bore (cm)"
            value={values.cylinderBore}
            onChange={handleChange('cylinderBore')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter cylinder bore in centimeters"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Pressure (kg/cm²)"
            value={values.pressure}
            onChange={handleChange('pressure')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter pressure in kg/cm²"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Yield Strength (kg/cm²)"
            value={values.yieldStrength}
            onChange={handleChange('yieldStrength')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter yield strength in kg/cm²"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Factor of Safety"
            value={values.factorOfSafety}
            onChange={handleChange('factorOfSafety')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter factor of safety"
          />
        </Grid>

        {/* Calculate Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateResults}
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 3 }}
          >
            Calculate Results
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TonnageCalculator;
