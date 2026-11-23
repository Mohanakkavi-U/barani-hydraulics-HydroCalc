import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import {
  CylinderCalculationInput,
  CylinderCalculationResult,
  MainCylinderResults,
  MainCylinderCalculatorProps
} from '../interfaces/MainCylinderTypes';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { TableChart as TableChartIcon } from '@mui/icons-material';

const calculateArea = (diameter: number): number => {
  return Math.PI * Math.pow(diameter / 2, 2);
};

const calculateInletFlow = (area: number, speed: number): number => {
  // Convert area from cm² to m² and speed from mm/sec to m/sec
  const areaInM2 = area / 10000;
  const speedInMS = speed / 1000;
  // Calculate flow in m³/sec and convert to LPM
  return areaInM2 * speedInMS * 60000;
};

interface CustomerDetails {
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
}

interface InputState {
  customerDetails: CustomerDetails;
  fastApproach: {
    cylinderSize: string;
    speed: string;
    inletFlow: string;
    outletFlow: string;
  };
  pressing: {
    cylinderSize: string;
    speed: string;
    pressure: string;
    inletFlow: string;
    outletFlow: string;
  };
  reverse: {
    cylinderSize: string;
    speed: string;
    pressure: string;
    inletFlow: string;
    outletFlow: string;
  };
  prefillValveSize: string;
  cylinderPortSize: string;
  pipeBlockSize: string;
}

const MainCylinderCalculator: React.FC<MainCylinderCalculatorProps> = ({ onCalculate, initialValues }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<InputState>({
    customerDetails: {
      customerName: '',
      machineName: '',
      woNo: '',
      assemblyName: ''
    },
    fastApproach: {
      cylinderSize: '',
      speed: '',
      inletFlow: '',
      outletFlow: '',
    },
    pressing: {
      cylinderSize: '',
      speed: '',
      pressure: '',
      inletFlow: '',
      outletFlow: '',
    },
    reverse: {
      cylinderSize: '',
      speed: '',
      pressure: '',
      inletFlow: '',
      outletFlow: '',
    },
    prefillValveSize: '',
    cylinderPortSize: '',
    pipeBlockSize: ''
  });

  const [results, setResults] = useState<MainCylinderResults | null>(null);

  const handleInputChange = (section: keyof InputState, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => {
      // For direct state updates (like prefillValveSize, cylinderPortSize, pipeBlockSize)
      if (section === 'prefillValveSize' || section === 'cylinderPortSize' || section === 'pipeBlockSize') {
        return {
          ...prev,
          [section]: event.target.value
        };
      }
      
      // For nested state updates (like fastApproach, pressing, reverse)
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: event.target.value
        }
      };
    });
  };

  const handleCustomerDetailsChange = (field: keyof CustomerDetails) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({
      ...prev,
      customerDetails: {
        ...prev.customerDetails,
        [field]: event.target.value
      }
    }));
  };

  const handleCalculate = () => {
    // Calculate areas in cm²
    const fastApproachArea = calculateArea(Number(inputs.fastApproach.cylinderSize));
    const pressingArea = calculateArea(Number(inputs.pressing.cylinderSize));
    const reverseArea = calculateArea(Number(inputs.reverse.cylinderSize));

    // Use user-provided flows or calculate if not provided
    const fastApproachFlow = inputs.fastApproach.inletFlow ? 
      Number(inputs.fastApproach.inletFlow) : 
      calculateInletFlow(fastApproachArea, Number(inputs.fastApproach.speed));
      
    const pressingFlow = inputs.pressing.inletFlow ? 
      Number(inputs.pressing.inletFlow) : 
      calculateInletFlow(pressingArea, Number(inputs.pressing.speed));
      
    const reverseFlow = inputs.reverse.inletFlow ? 
      Number(inputs.reverse.inletFlow) : 
      calculateInletFlow(reverseArea, Number(inputs.reverse.speed));

    // Calculate forces (Force in Tons = (Pressure in bar * Area in cm²) / 1000)
    const fastApproachForce = (1 * fastApproachArea) / 1000; // Using 1 bar for gravity
    const pressingForce = (Number(inputs.pressing.pressure) * pressingArea) / 1000;
    const reverseForce = (Number(inputs.reverse.pressure) * reverseArea) / 1000;

    const newResults: MainCylinderResults = {
      customerDetails: {
        customerName: inputs.customerDetails.customerName,
        machineName: inputs.customerDetails.machineName,
        woNo: inputs.customerDetails.woNo,
        assemblyName: inputs.customerDetails.assemblyName
      },
      fastApproach: {
        description: 'FAST APPROACH SPEED',
        cylinderSize: Number(inputs.fastApproach.cylinderSize),
        area: Number(fastApproachArea.toFixed(1)),
        speed: Number(inputs.fastApproach.speed),
        inletFlow: Number(fastApproachFlow.toFixed(1)),
        outletFlow: inputs.fastApproach.outletFlow ? Number(inputs.fastApproach.outletFlow) : 0,
        pressure: 'BY GRAVITY',
        force: fastApproachForce.toFixed(1) + ' Tons'
      },
      pressing: {
        description: 'PRESSING SPEED',
        cylinderSize: Number(inputs.pressing.cylinderSize),
        area: Number(pressingArea.toFixed(1)),
        speed: Number(inputs.pressing.speed),
        inletFlow: Number(pressingFlow.toFixed(1)),
        outletFlow: inputs.pressing.outletFlow ? Number(inputs.pressing.outletFlow) : 0,
        pressure: Number(inputs.pressing.pressure),
        force: pressingForce.toFixed(1) + ' Tons'
      },
      reverse: {
        description: 'REVERSE SPEED',
        cylinderSize: Number(inputs.reverse.cylinderSize),
        area: Number(reverseArea.toFixed(1)),
        speed: Number(inputs.reverse.speed),
        inletFlow: Number(reverseFlow.toFixed(1)),
        outletFlow: inputs.reverse.outletFlow ? Number(inputs.reverse.outletFlow) : 0,
        pressure: Number(inputs.reverse.pressure),
        force: reverseForce.toFixed(1) + ' Tons'
      },
      prefillValveSize: inputs.prefillValveSize,
      cylinderPortSize: inputs.cylinderPortSize,
      pipeBlockSize: inputs.pipeBlockSize
    };

    setResults(newResults);
    if (onCalculate) {
      onCalculate(newResults);
    }

    navigate('/main-cylinder-results', { state: { results: newResults } });
  };

  const exportToCSV = (results: MainCylinderResults) => {
    const { customerDetails, ...restResults } = results;
    const headers = [
      'Description', 
      'Cylinder Size (mm)', 
      'Area (cm²)', 
      'Speed (mm/sec)', 
      'Inlet Flow (LPM)', 
      'Outlet Flow (LPM)', 
      'Pressure (Bar)', 
      'Force (Ton)'
    ];

    // Convert data to CSV rows
    const rows = [
      ['Fast Approach', ...Object.values(restResults.fastApproach)],
      ['Pressing', ...Object.values(restResults.pressing)],
      ['Reverse', ...Object.values(restResults.reverse)]
    ];

    // Add customer details if available
    let csvContent = '';
    if (customerDetails) {
      csvContent += `Customer Name,${customerDetails.customerName || ''}\n`;
      csvContent += `Machine Name,${customerDetails.machineName || ''}\n`;
      csvContent += `WO No,${customerDetails.woNo || ''}\n`;
      csvContent += `Assembly Name,${customerDetails.assemblyName || ''}\n\n`;
    }

    // Add headers and rows
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(value => `"${value}"`).join(',') + '\n';
    });

    // Add additional results
    csvContent += `\nPrefill Valve Size,${restResults.prefillValveSize}\n`;
    csvContent += `Cylinder Port Size,${restResults.cylinderPortSize}\n`;
    csvContent += `Pipe/Block Size,${restResults.pipeBlockSize}\n`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `MainCylinder_Results_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, filename);
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom align="center">
            MAIN CYLINDER ASSEMBLY - 2NOS
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
            value={inputs.customerDetails.customerName}
            onChange={handleCustomerDetailsChange('customerName')}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Machine Name"
            value={inputs.customerDetails.machineName}
            onChange={handleCustomerDetailsChange('machineName')}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="W.O. No"
            value={inputs.customerDetails.woNo}
            onChange={handleCustomerDetailsChange('woNo')}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Assembly Name"
            value={inputs.customerDetails.assemblyName}
            onChange={handleCustomerDetailsChange('assemblyName')}
            sx={{ mb: 2 }}
          />
        </Grid>

        {/* Input Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Input Parameters
          </Typography>
        </Grid>

        {/* Fast Approach Inputs */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom>
            Fast Approach
          </Typography>
          <TextField
            fullWidth
            label="Cylinder Size (mm)"
            value={inputs.fastApproach.cylinderSize}
            onChange={handleInputChange('fastApproach', 'cylinderSize')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Speed (mm/sec)"
            value={inputs.fastApproach.speed}
            onChange={handleInputChange('fastApproach', 'speed')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Inlet Flow (lpm)"
            value={inputs.fastApproach.inletFlow}
            onChange={handleInputChange('fastApproach', 'inletFlow')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Outlet Flow (lpm)"
            value={inputs.fastApproach.outletFlow}
            onChange={handleInputChange('fastApproach', 'outletFlow')}
            type="number"
            sx={{ mb: 2 }}
          />
        </Grid>

        {/* Pressing Inputs */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom>
            Pressing
          </Typography>
          <TextField
            fullWidth
            label="Cylinder Size (mm)"
            value={inputs.pressing.cylinderSize}
            onChange={handleInputChange('pressing', 'cylinderSize')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Speed (mm/sec)"
            value={inputs.pressing.speed}
            onChange={handleInputChange('pressing', 'speed')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Pressure (bar)"
            value={inputs.pressing.pressure}
            onChange={handleInputChange('pressing', 'pressure')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Inlet Flow (lpm)"
            value={inputs.pressing.inletFlow}
            onChange={handleInputChange('pressing', 'inletFlow')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Outlet Flow (lpm)"
            value={inputs.pressing.outletFlow}
            onChange={handleInputChange('pressing', 'outletFlow')}
            type="number"
            sx={{ mb: 2 }}
          />
        </Grid>

        {/* Reverse Inputs */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom>
            Reverse
          </Typography>
          <TextField
            fullWidth
            label="Cylinder Size (mm)"
            value={inputs.reverse.cylinderSize}
            onChange={handleInputChange('reverse', 'cylinderSize')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Speed (mm/sec)"
            value={inputs.reverse.speed}
            onChange={handleInputChange('reverse', 'speed')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Pressure (bar)"
            value={inputs.reverse.pressure}
            onChange={handleInputChange('reverse', 'pressure')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Inlet Flow (lpm)"
            value={inputs.reverse.inletFlow}
            onChange={handleInputChange('reverse', 'inletFlow')}
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Outlet Flow (lpm)"
            value={inputs.reverse.outletFlow}
            onChange={handleInputChange('reverse', 'outletFlow')}
            type="number"
            sx={{ mb: 2 }}
          />
        </Grid>

        {/* Port Sizes */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Port Sizes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Prefill Valve Size"
                value={inputs.prefillValveSize}
                onChange={(e) => {
                  setInputs(prev => ({
                    ...prev,
                    prefillValveSize: e.target.value
                  }));
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Cylinder Port Size"
                value={inputs.cylinderPortSize}
                onChange={(e) => {
                  setInputs(prev => ({
                    ...prev,
                    cylinderPortSize: e.target.value
                  }));
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Pipe Block Size"
                value={inputs.pipeBlockSize}
                onChange={(e) => {
                  setInputs(prev => ({
                    ...prev,
                    pipeBlockSize: e.target.value
                  }));
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCalculate}
              >
                Calculate
              </Button>
              {results && (
                <Button
                  variant="outlined"
                  startIcon={<TableChartIcon />}
                  onClick={() => exportToCSV(results)}
                  disabled={!results}
                >
                  Export to CSV
                </Button>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Results Table */}
        {results && (
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Cylinder Size (mm)</TableCell>
                    <TableCell align="right">Area (cm²)</TableCell>
                    <TableCell align="right">Speed (mm/sec)</TableCell>
                    <TableCell align="right">Inlet Flow (LPM)</TableCell>
                    <TableCell align="right">Outlet Flow (LPM)</TableCell>
                    <TableCell align="right">Pressure (bar)</TableCell>
                    <TableCell align="right">Force (Tons)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Fast Approach</TableCell>
                    <TableCell align="right">{results.fastApproach.cylinderSize}</TableCell>
                    <TableCell align="right">{results.fastApproach.area}</TableCell>
                    <TableCell align="right">{results.fastApproach.speed}</TableCell>
                    <TableCell align="right">{results.fastApproach.inletFlow}</TableCell>
                    <TableCell align="right">{results.fastApproach.outletFlow}</TableCell>
                    <TableCell align="right">{results.fastApproach.pressure}</TableCell>
                    <TableCell align="right">{results.fastApproach.force}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pressing</TableCell>
                    <TableCell align="right">{results.pressing.cylinderSize}</TableCell>
                    <TableCell align="right">{results.pressing.area}</TableCell>
                    <TableCell align="right">{results.pressing.speed}</TableCell>
                    <TableCell align="right">{results.pressing.inletFlow}</TableCell>
                    <TableCell align="right">{results.pressing.outletFlow}</TableCell>
                    <TableCell align="right">{results.pressing.pressure}</TableCell>
                    <TableCell align="right">{results.pressing.force}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Reverse</TableCell>
                    <TableCell align="right">{results.reverse.cylinderSize}</TableCell>
                    <TableCell align="right">{results.reverse.area}</TableCell>
                    <TableCell align="right">{results.reverse.speed}</TableCell>
                    <TableCell align="right">{results.reverse.inletFlow}</TableCell>
                    <TableCell align="right">{results.reverse.outletFlow}</TableCell>
                    <TableCell align="right">{results.reverse.pressure}</TableCell>
                    <TableCell align="right">{results.reverse.force}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default MainCylinderCalculator;