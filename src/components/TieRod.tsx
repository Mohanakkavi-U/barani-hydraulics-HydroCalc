import React, { useState, ChangeEvent } from 'react';
import { Typography, TextField, Button, Paper, Grid, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface TieRodValues {
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
  tieRodDiameter: string;
  workingStress: string;
  fos: string;
  threadDiameter: string;
  yieldStrength: string;
}

interface TieRodResults {
  area: string;
  load: string;
  threadArea: string;
  threadLoad: string;
  inputValues: TieRodValues;
}

const TieRodCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<TieRodValues>({
    customerName: '',
    machineName: '',
    woNo: '',
    assemblyName: '',
    tieRodDiameter: '',
    workingStress: '',
    fos: '',
    threadDiameter: '',
    yieldStrength: '',
  });

  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const handleChange = (prop: keyof TieRodValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValues({ ...values, [prop]: newValue });
  };

  const validateInputs = () => {
    const requiredFields = [
      { key: 'customerName', label: 'Customer Name' },
      { key: 'machineName', label: 'Machine Name' },
      { key: 'woNo', label: 'WO. NO' },
      { key: 'assemblyName', label: 'Assembly Name' },
      { key: 'tieRodDiameter', label: 'Tie Rod Diameter' },
      { key: 'workingStress', label: 'Working Stress' },
      { key: 'fos', label: 'Factor of Safety' },
      { key: 'threadDiameter', label: 'Thread Diameter' },
      { key: 'yieldStrength', label: 'Yield Strength' },
    ];

    for (const field of requiredFields) {
      if (!values[field.key as keyof TieRodValues]) {
        throw new Error(`Please enter ${field.label}`);
      }
      if (field.key === 'customerName' || field.key === 'machineName' || field.key === 'woNo' || field.key === 'assemblyName') {
        continue;
      }
      const value = parseFloat(values[field.key as keyof TieRodValues]);
      if (isNaN(value) || value <= 0) {
        throw new Error(`${field.label} must be a positive number`);
      }
    }
  };

  const calculateResults = () => {
    try {
      validateInputs();

      const tieRodDiameter = parseFloat(values.tieRodDiameter);
      const workingStress = parseFloat(values.workingStress);
      const fos = parseFloat(values.fos);
      const threadDiameter = parseFloat(values.threadDiameter);
      const yieldStrength = parseFloat(values.yieldStrength);

      // Calculate tie rod area (π * d² / 4)
      const area = ((Math.PI * Math.pow(tieRodDiameter, 2)) / 4).toFixed(4);
      
      // Calculate tie rod load (Area * Working Stress / 1000)
      const load = ((parseFloat(area) * workingStress) / 1000).toFixed(4);
      
      // Calculate thread area (π * d² / 4)
      const threadArea = ((Math.PI * Math.pow(threadDiameter, 2)) / 4).toFixed(4);
      
      // Calculate thread load (Area * Yield Strength / FOS / 1000)
      const threadLoad = ((parseFloat(threadArea) * yieldStrength) / fos / 1000).toFixed(4);

      const results: TieRodResults = {
        area,
        load,
        threadArea,
        threadLoad,
        inputValues: { ...values },
      };

      // Navigate to results page with the calculated results
      navigate('/tierod/results', { 
        state: { 
          results: JSON.stringify(results) 
        } 
      });
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
        Tie Rod & Thread Calculator
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
            label="Tie Rod Diameter (cm)"
            value={values.tieRodDiameter}
            onChange={handleChange('tieRodDiameter')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter tie rod diameter in centimeters"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Working Stress (kg/cm²)"
            value={values.workingStress}
            onChange={handleChange('workingStress')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter working stress in kg/cm²"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Factor of Safety"
            value={values.fos}
            onChange={handleChange('fos')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter factor of safety"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Thread Diameter (cm)"
            value={values.threadDiameter}
            onChange={handleChange('threadDiameter')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter thread diameter in centimeters"
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

        {/* Calculate Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateResults}
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            Calculate
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TieRodCalculator;
