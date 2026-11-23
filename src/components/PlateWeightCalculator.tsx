import React, { useState } from 'react';
import { Paper, Grid, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import WeightResultsComponent from './PlateWeightAndFoundationCalculatorResults';

interface WeightValues {
  plateLength: string;
  plateWidth: string;
  plateThickness: string;
  steelSpecificWeight: string;
  staticLoad: string;
  toolWeight: string;
  loadBearingLength: string;
  loadBearingWidth: string;
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
}

interface CustomerDetails {
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
}

interface WeightCalculationResults {
  volume: string;
  plateWeight: string;
  dynamicLoad: string;
  loadBearingArea: string;
  bearingPressure: string;
  totalLoad: string;
  inputValues: WeightValues;
  customerDetails: CustomerDetails;
}

const WeightCalculator: React.FC = () => {
  const [values, setValues] = useState<WeightValues>({
    plateLength: '',
    plateWidth: '',
    plateThickness: '',
    steelSpecificWeight: '',
    staticLoad: '',
    toolWeight: '',
    loadBearingLength: '',
    loadBearingWidth: '',
    customerName: '',
    machineName: '',
    woNo: '',
    assemblyName: ''
  });

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    customerName: '',
    machineName: '',
    woNo: '',
    assemblyName: ''
  });

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<WeightCalculationResults | null>(null);
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    // Update both values and customerDetails states
    setValues(prev => ({
      ...prev,
      [field]: value
    }));

    // If the field is a customer detail, update customerDetails state
    if (['customerName', 'machineName', 'woNo', 'assemblyName'].includes(field)) {
      setCustomerDetails(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateInputs = () => {
    // Define required numeric fields that need validation
    const numericFields = [
      { key: 'plateLength', label: 'Plate Length' },
      { key: 'plateWidth', label: 'Plate Width' },
      { key: 'plateThickness', label: 'Plate Thickness' },
      { key: 'steelSpecificWeight', label: 'Steel Specific Weight' },
      { key: 'staticLoad', label: 'Static Load' },
      { key: 'toolWeight', label: 'Tool Weight' },
      { key: 'loadBearingLength', label: 'Load Bearing Length' },
      { key: 'loadBearingWidth', label: 'Load Bearing Width' }
    ];

    // Define required text fields (customer details)
    const textFields = [
      { key: 'customerName', label: 'Customer Name' },
      { key: 'machineName', label: 'Machine Name' },
      { key: 'woNo', label: 'W.O. No' },
      { key: 'assemblyName', label: 'Assembly Name' }
    ];

    // Validate numeric fields
    for (const field of numericFields) {
      const value = values[field.key as keyof WeightValues];
      if (!value) {
        throw new Error(`Please enter ${field.label}`);
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        throw new Error(`${field.label} must be a positive number`);
      }
    }

    // Validate text fields (only check if they're not empty)
    for (const field of textFields) {
      if (!values[field.key as keyof WeightValues]?.trim()) {
        throw new Error(`Please enter ${field.label}`);
      }
    }
  };

  const calculateResults = () => {
    try {
      validateInputs();

      const plateLength = parseFloat(values.plateLength);
      const plateWidth = parseFloat(values.plateWidth);
      const plateThickness = parseFloat(values.plateThickness);
      const specificWeight = parseFloat(values.steelSpecificWeight);
      const staticLoad = parseFloat(values.staticLoad);
      const toolWeight = parseFloat(values.toolWeight);
      const loadBearingLength = parseFloat(values.loadBearingLength);
      const loadBearingWidth = parseFloat(values.loadBearingWidth);

      // Calculate volume in mm³
      const volume = plateLength * plateWidth * plateThickness; // mm³

      // Calculate plate weight in kg
      const plateWeight = (volume * specificWeight) / 1000000; // Convert to kg (assuming specificWeight is in g/cm³)


      // Calculate dynamic load in N (converting kg to N by multiplying by 9.81 m/s²)
      const dynamicLoad = (staticLoad + toolWeight) * 9.81; // N

      // Calculate load bearing area in mm²
      const loadBearingArea = loadBearingLength * loadBearingWidth; // mm²

      // Calculate bearing pressure in N/mm²
      // Convert dynamic load from N to N/mm² by dividing by area in mm²
      const bearingPressure = dynamicLoad / loadBearingArea; // N/mm²

      // Calculate concrete volume in m³ (assuming foundation dimensions are in mm)
      const concreteVolume = (plateLength * plateWidth * 100) / 1000000000; // m³ (assuming 100mm height)


      // Calculate concrete weight in kg (assuming concrete density of 2400 kg/m³)
      const concreteDensity = 2400; // kg/m³
      const concreteWeight = concreteVolume * concreteDensity; // kg

      // Calculate total load in kg (plate weight + concrete weight)
      const totalLoad = plateWeight + concreteWeight; // kg

      setResults({
        volume: volume.toFixed(2),
        plateWeight: plateWeight.toFixed(2),
        dynamicLoad: dynamicLoad.toFixed(2),
        loadBearingArea: loadBearingArea.toFixed(2),
        bearingPressure: bearingPressure.toFixed(6), // More precision for small values
        totalLoad: totalLoad.toFixed(2),
        concreteVolume: concreteVolume.toFixed(4), // More precision for small volumes
        concreteWeight: concreteWeight.toFixed(2),
        inputValues: values,
        customerDetails: customerDetails
      });
      setShowResults(true);
    } catch (err) {
      setError('An error occurred while calculating results');
      setShowError(true);
    }
  };

  if (showResults && results) {
    return (
      <WeightResultsComponent
        results={{
          volume: parseFloat(results.volume),
          plateWeight: parseFloat(results.plateWeight),
          dynamicLoad: parseFloat(results.dynamicLoad),
          loadBearingArea: parseFloat(results.loadBearingArea),
          bearingPressure: parseFloat(results.bearingPressure) || 0, // Ensure we have a number
          totalLoad: parseFloat(results.totalLoad),
          foundationLength: parseFloat(results.inputValues.plateLength) || 0,
          foundationWidth: parseFloat(results.inputValues.plateWidth) || 0,
          foundationHeight: 100, // 100mm height for concrete foundation
          concreteVolume: parseFloat(results.concreteVolume) || 0,
          concreteWeight: parseFloat(results.concreteWeight) || 0,
          projectName: '', // Not in the form
          referenceNumber: '', // Not in the form
          inputValues: results.inputValues,
          customerDetails: results.customerDetails
        }}
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2, maxWidth: '800px', mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Plate Weight & Foundation Calculator
          </Typography>
        </Grid>

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
            type="text"
            helperText="Enter customer name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Machine Name"
            value={values.machineName}
            onChange={handleChange('machineName')}
            type="text"
            helperText="Enter machine name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="W.O. No"
            value={values.woNo}
            onChange={handleChange('woNo')}
            type="text"
            helperText="Enter work order number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Assembly Name"
            value={values.assemblyName}
            onChange={handleChange('assemblyName')}
            type="text"
            helperText="Enter assembly name"
          />
        </Grid>

        {/* Technical Specifications */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mt: 4 }}>
            Technical Specifications:
          </Typography>
        </Grid>

        {/* Plate Dimensions */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            Plate Dimensions
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Length (cm)"
            value={values.plateLength}
            onChange={handleChange('plateLength')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter plate length in centimeters"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Width (cm)"
            value={values.plateWidth}
            onChange={handleChange('plateWidth')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter plate width in centimeters"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Thickness (cm)"
            value={values.plateThickness}
            onChange={handleChange('plateThickness')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter plate thickness in centimeters"
          />
        </Grid>

        {/* Material Properties */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            Material Properties
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Steel Specific Weight (kg/cm³)"
            value={values.steelSpecificWeight}
            onChange={handleChange('steelSpecificWeight')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.001' }
            }}
            helperText="Enter steel specific weight"
          />
        </Grid>

        {/* Foundation Calculations */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            Foundation Details
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Static Load (kgf)"
            value={values.staticLoad}
            onChange={handleChange('staticLoad')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '1' }
            }}
            helperText="Enter static load in kgf"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tool Weight (kgf)"
            value={values.toolWeight}
            onChange={handleChange('toolWeight')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '1' }
            }}
            helperText="Enter tool weight in kgf"
          />
        </Grid>

        {/* Load Bearing Area */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            Load Bearing Area
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Plate Length (cm)"
            value={values.loadBearingLength}
            onChange={handleChange('loadBearingLength')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter load bearing plate length"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Plate Width (cm)"
            value={values.loadBearingWidth}
            onChange={handleChange('loadBearingWidth')}
            type="number"
            InputProps={{
              inputProps: { min: 0, step: '0.1' }
            }}
            helperText="Enter load bearing plate width"
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
      {showError && (
        <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Paper>
  );
};

export default WeightCalculator;
