import React, { useState, ChangeEvent } from 'react';
import { Typography, TextField, Button, Paper, Grid, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PumpCalculatorResults from './PumpFlowCalculatorResult';

interface CalculatorValues {
  [key: string]: string;
  diameter: string;
  flowRate: string;
  head: string;
  efficiency: string;
  specificGravity: string;
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
}

interface PumpFlowResult {
  flowRate: string;
  velocity: string;
}

interface MotorHPResult {
  brakeHorsepower: string;
  recommendedHP: string;
  efficiency: string;
}

interface PumpCalculatorResults {
  pumpFlow: PumpFlowResult | null;
  motorHP: MotorHPResult | null;
  inputValues: CalculatorValues;
}

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<CalculatorValues>({
    diameter: '',
    flowRate: '',
    head: '',
    efficiency: '',
    specificGravity: '1.0',
    customerName: '',
    machineName: '',
    woNo: '',
    assemblyName: '',
  });

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<PumpCalculatorResults | null>(null);
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const handleChange = (prop: keyof CalculatorValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValues({ ...values, [prop]: newValue });
  };

  const validateInputs = () => {
    const requiredFields = [
      { key: 'diameter', label: 'Diameter' },
      { key: 'flowRate', label: 'Flow Rate' },
      { key: 'head', label: 'Head' },
      { key: 'efficiency', label: 'Efficiency' },
      { key: 'specificGravity', label: 'Specific Gravity' },
    ];

    for (const field of requiredFields) {
      if (!values[field.key]) {
        throw new Error(`Please enter ${field.label}`);
      }
      const numValue = parseFloat(values[field.key]);
      if (isNaN(numValue) || numValue <= 0) {
        throw new Error(`${field.label} must be a positive number`);
      }
    }
  };

  const calculateResults = () => {
    try {
      validateInputs();

      const diameter = parseFloat(values.diameter) / 25.4;
      const flowRate = parseFloat(values.flowRate);
      const head = parseFloat(values.head);
      const efficiency = parseFloat(values.efficiency) / 100;
      const specificGravity = parseFloat(values.specificGravity);

      const area = Math.PI * Math.pow(diameter / 2, 2);
      const flowRateFtCubicPerSec = flowRate * (1/1000) * 35.3147 / 60;
      const velocity = flowRateFtCubicPerSec / (area * 0.00694444);
      const brakeHorsepower = (flowRate * head * specificGravity) / (15000 * efficiency);
      const recommendedHP = Math.ceil(brakeHorsepower * 1.15);

      const resultsData: PumpCalculatorResults = {
        pumpFlow: {
          flowRate: flowRate.toFixed(2),
          velocity: velocity.toFixed(2),
        },
        motorHP: {
          brakeHorsepower: brakeHorsepower.toFixed(2),
          recommendedHP: recommendedHP.toString(),
          efficiency: (efficiency * 100).toFixed(2),
        },
        inputValues: values,
      };

      setResults(resultsData);
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
    navigate('/calculator/results', { state: { results } });
    return null;
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
        Pump Flow and Motor HP Calculator
      </Typography>

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
            value={values.customerName}
            onChange={handleChange('customerName')}
            helperText="Enter customer name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Machine Name"
            value={values.machineName}
            onChange={handleChange('machineName')}
            helperText="Enter machine name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="W.O. No"
            value={values.woNo}
            onChange={handleChange('woNo')}
            helperText="Enter work order number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Assembly Name"
            value={values.assemblyName}
            onChange={handleChange('assemblyName')}
            helperText="Enter assembly name"
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
            label="Diameter (mm)"
            value={values.diameter}
            onChange={handleChange('diameter')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter pipe diameter in millimeters"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Flow Rate (LPM)"
            value={values.flowRate}
            onChange={handleChange('flowRate')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter flow rate in liters per minute"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Head (feet)"
            value={values.head}
            onChange={handleChange('head')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter total head in feet"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Efficiency (%)"
            value={values.efficiency}
            onChange={handleChange('efficiency')}
            type="number"
            InputProps={{
              inputProps: { min: 0, max: 100, step: '0.1' }
            }}
            helperText="Enter pump efficiency (0-100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Specific Gravity"
            value={values.specificGravity}
            onChange={handleChange('specificGravity')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.01' }
            }}
            helperText="Enter fluid specific gravity (default: 1.0 for water)"
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

export default Calculator;
