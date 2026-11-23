import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import GridOnIcon from '@mui/icons-material/GridOn';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, Image, BlobProvider } from '@react-pdf/renderer';
import { useLocation } from 'react-router-dom';
import * as ExcelJS from 'exceljs';

interface DetailItemProps {
  label: string;
  value: string | number;
  variant?: 'body1' | 'h6';
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, variant = 'body1' }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
      {label}
    </Typography>
    <Typography variant={variant} sx={{ 
      fontWeight: variant === 'h6' ? 'bold' : 'normal',
      color: variant === 'h6' ? '#1976d2' : 'inherit'
    }}>
      {value || '-'}
    </Typography>
  </Box>
);

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

const PDFDocument = ({ results }: { results: TieRodResults }) => {
  const styles = StyleSheet.create({
    page: {
      padding: '15 25',
      fontSize: 10,
      fontFamily: 'Helvetica',
    },
    header: {
      backgroundColor: '#003366',
      padding: 6,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: 35,
      height: 35,
      marginRight: 8,
      objectFit: 'contain',
    },
    headerText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 12,
      fontWeight: 'bold',
      flex: 1,
    },
    section: {
      marginBottom: 8,
    },
    title: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 6,
      textAlign: 'center',
    },
    tableContainer: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
      marginBottom: 6,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      borderBottomStyle: 'solid',
      minHeight: 18,
    },
    tableCell: {
      flex: 1,
      padding: '3 4',
      borderRightWidth: 1,
      borderRightColor: '#000',
      borderRightStyle: 'solid',
      justifyContent: 'center',
    },
    tableCellLeft: {
      flex: 1.2,
      padding: '3 4',
      borderRightWidth: 1,
      borderRightColor: '#000',
      borderRightStyle: 'solid',
      justifyContent: 'center',
    },
    tableCellRight: {
      flex: 0.8,
      padding: '3 4',
      borderRightWidth: 1,
      borderRightColor: '#000',
      borderRightStyle: 'solid',
      justifyContent: 'center',
    },
    formula: {
      padding: 4,
      marginBottom: 3,
      backgroundColor: '#f8f8f8',
    },
    formulaText: {
      fontSize: 9,
      marginBottom: 2,
      fontFamily: 'Helvetica',
    },
    formulaVariable: {
      fontSize: 9,
      marginBottom: 2,
      marginLeft: 12,
      fontFamily: 'Helvetica',
    },
    formulaTitle: {
      fontSize: 9,
      fontWeight: 'bold',
      marginBottom: 2,
      color: '#003366',
      fontFamily: 'Helvetica',
    },
    footer: {
      position: 'absolute',
      bottom: 25,
      left: 25,
      right: 25,
    },
    signatureLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    signatureText: {
      fontSize: 9,
    },
    referenceNumber: {
      position: 'absolute',
      bottom: 50,
      left: 25,
      fontSize: 8,
      color: '#666',
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image style={styles.logo} src="logo.png" />
          <Text style={styles.headerText}>BARANI HYDRAULICS INDIA PRIVATE LIMITED</Text>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.title}>
            TIE ROD & THREAD CALCULATIONS
          </Text>
        </View>

        {/* Customer Details */}
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLeft}><Text>Customer Name</Text></View>
            <View style={styles.tableCellRight}><Text>{results.inputValues.customerName || ''}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLeft}><Text>Machine Name</Text></View>
            <View style={styles.tableCellRight}><Text>{results.inputValues.machineName || ''}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLeft}><Text>WO. NO</Text></View>
            <View style={styles.tableCellRight}><Text>{results.inputValues.woNo || ''}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLeft}><Text>Assembly Name</Text></View>
            <View style={styles.tableCellRight}><Text>{results.inputValues.assemblyName || ''}</Text></View>
          </View>
        </View>

        {/* Formula Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Formulas Used:</Text>
          <View style={styles.formula}>
            <Text style={styles.formulaTitle}>1. Tie Rod Area Calculation</Text>
            <Text style={styles.formulaText}>Area (cm²) = (PI × D²) ÷ 4</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      D = Tie Rod Diameter (cm)</Text>
            <Text style={styles.formulaVariable}>      PI = 3.14159 (mathematical constant pi)</Text>
            <Text style={styles.formulaVariable}>      D² = D × D (Square of diameter)</Text>

            <Text style={styles.formulaTitle}>2. Tie Rod Load Calculation</Text>
            <Text style={styles.formulaText}>Load (Tons) = (Area × Working Stress) ÷ 1000</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      Area = Tie Rod Area (cm²)</Text>
            <Text style={styles.formulaVariable}>      Working Stress = Stress in kg/cm²</Text>

            <Text style={styles.formulaTitle}>3. Thread Area Calculation</Text>
            <Text style={styles.formulaText}>Area (cm²) = (PI × D²) ÷ 4</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      D = Thread Diameter (cm)</Text>
            <Text style={styles.formulaVariable}>      PI = 3.14159 (mathematical constant pi)</Text>
            <Text style={styles.formulaVariable}>      D² = D × D (Square of diameter)</Text>

            <Text style={styles.formulaTitle}>4. Thread Load Calculation</Text>
            <Text style={styles.formulaText}>Load (Tons) = (Area × Yield Strength) ÷ (FOS × 1000)</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      Area = Thread Area (cm²)</Text>
            <Text style={styles.formulaVariable}>      Yield Strength = Material strength in kg/cm²</Text>
            <Text style={styles.formulaVariable}>      FOS = Factor of Safety</Text>
          </View>
        </View>

        {/* Results Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Calculation Results</Text>

          {/* Tie Rod Calculations */}
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Tie Rod Diameter (cm)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.tieRodDiameter}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Tie Rod Area (cm²)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.area}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Working Stress (kg/cm²)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.workingStress}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Tie Rod Load (Tons)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.load}</Text></View>
            </View>
          </View>

          {/* Thread Calculations */}
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Thread Diameter (cm)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.threadDiameter}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Thread Area (cm²)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.threadArea}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Yield Strength (kg/cm²)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.yieldStrength}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Factor of Safety</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.fos}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Thread Load (Tons)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.threadLoad}</Text></View>
            </View>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.footer}>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureText}>Prepared By:</Text>
            <Text style={styles.signatureText}>Checked By:</Text>
            <Text style={styles.signatureText}>Approved By:</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const TieRodResults: React.FC = () => {
  const location = useLocation();
  const [results, setResults] = useState<TieRodResults | null>(null);

  useEffect(() => {
    if (location.state && location.state.results) {
      try {
        const resultsData = JSON.parse(location.state.results);
        setResults(resultsData);
      } catch (error) {
        console.error('Error parsing results:', error);
      }
    }
  }, [location]);

  if (!results) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          No Results Available
        </Typography>
      </Paper>
    );
  }

  const calculateThreadLoad = (results: TieRodResults): string => {
    if (!results.threadArea || !results.inputValues.yieldStrength || !results.inputValues.fos) {
      return 'N/A';
    }
    
    try {
      const area = parseFloat(results.threadArea);
      const yieldStrength = parseFloat(results.inputValues.yieldStrength);
      const fos = parseFloat(results.inputValues.fos);
      
      // Load (Tons) = (Area × Yield Strength) ÷ (FOS × 1000)
      const load = (area * yieldStrength) / (fos * 1000);
      return load.toFixed(2);
    } catch (error) {
      console.error('Error calculating thread load:', error);
      return 'N/A';
    }
  };

  const exportToExcel = () => {
    if (!results || !results.inputValues) {
      throw new Error('No results data available for export');
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Tie Rod Calculations');

      // Set column widths and headers
      worksheet.columns = [
        { header: 'Parameter', key: 'parameter', width: 50 },
        { header: 'Value', key: 'value', width: 50 }
      ];

      // Helper function to add styled header
      const addHeader = (text: string, rowNumber: number) => {
        const row = worksheet.getRow(rowNumber);
        row.values = [text, ''];
        worksheet.mergeCells(`A${rowNumber}:B${rowNumber}`);
        row.eachCell((cell) => {
          cell.style = {
            font: { 
              name: 'Arial', 
              bold: true, 
              size: 14, // Set font size to 14 for all section headings
              color: { argb: 'FFFFFF' } 
            },
            fill: { 
              type: 'pattern', 
              pattern: 'solid', 
              fgColor: { argb: '003366' } 
            },
            alignment: { 
              horizontal: 'center', 
              vertical: 'middle' 
            },
            border: {
              top: { style: 'thin', color: { argb: '000000' } },
              bottom: { style: 'thin', color: { argb: '000000' } },
              left: { style: 'thin', color: { argb: '000000' } },
              right: { style: 'thin', color: { argb: '000000' } }
            }
          };
        });
        row.height = 25; // Set consistent height for header rows
      };

      // Enhanced function to remove all units and special characters from values
      const removeUnits = (value: string): string => {
        console.log('Original value:', value);
        
        if (!value) return value;
        if (typeof value !== 'string') {
          value = String(value);
        }
        
        // First, handle any HTML entities or special characters
        let cleanValue = value
          .replace(/&[^;]+;/g, '')  // Remove HTML entities
          .replace(/\s*\([^)]*\)/g, '')  // Remove anything in parentheses
          .replace(/[^\d.,-]/g, '')  // Remove all non-numeric characters except .,-
          .replace(/(?<=\d)[,](?=\d)/g, '.')  // Replace comma between numbers with dot
          .replace(/[.,]$/, '')  // Remove trailing decimal points or commas
          .replace(/^-$/, '')  // Remove single minus sign
          .trim();
          
        console.log('Cleaned value:', cleanValue);
        
        // If we're left with an empty string, return the original value
        return cleanValue || value;
      };

      // Helper function to clean numeric values
      const cleanNumericValue = (value: string): string => {
        if (!value) return value;
        return String(value)
          .replace(/([\d.,-]+).*/, '$1')  // Remove any text after numbers (including units)
          .replace(/,/g, '.')  // Convert commas to dots for decimal
          .replace(/[^\d.-]/g, '')  // Remove any remaining non-numeric characters except . and -
          .replace(/(\.\d*?[1-9])0+$/, '$1')  // Remove trailing zeros after decimal
          .replace(/\.$/, '');  // Remove trailing decimal point
      };

      // Helper function to add data row
      const addDataRow = (label: string, value: string, rowNumber: number, isNumeric: boolean = true, isAuthorization: boolean = false) => {
        const row = worksheet.getRow(rowNumber);
        
        // Clean the label to remove any units in parentheses
        const cleanLabel = label.replace(/\s*\([^)]*\)/g, '').trim();
        
        // Clean the value based on whether it's numeric or text
        let cleanValue = value || (isAuthorization ? '' : '-');
        if (isNumeric && value) {
          cleanValue = cleanNumericValue(value) || (isAuthorization ? '' : '-');
        }
        
        // Debug logging
        console.log('Adding row:', { 
          rowNumber, 
          originalLabel: label, 
          cleanLabel, 
          originalValue: value, 
          cleanValue 
        });
        
        // Set the cleaned values
        row.values = [cleanLabel, cleanValue];
        
        // Apply styling
        row.eachCell((cell, colNumber) => {
          cell.style = {
            font: { 
              name: 'Arial', 
              size: 11,
              bold: colNumber === 1 // Make column A text bold
            },
            border: {
              left: { style: 'thin', color: { argb: 'D3D3D3' } },
              right: { style: 'thin', color: { argb: 'D3D3D3' } },
              bottom: { style: 'thin', color: { argb: 'D3D3D3' } }
            },
            alignment: colNumber === 1 || !isNumeric ? { horizontal: 'left' } : { horizontal: 'right' }
          };
          
          // Add light gray background to parameter column
          if (colNumber === 1) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'F5F5F5' }
            };
          }
        });
        row.height = 22;
      };

      // Add company header
      addHeader('BARANI HYDRAULICS INDIA PRIVATE LIMITED', 1);
      
      // Add title
      addHeader('TIE ROD & THREAD CALCULATIONS', 2);
      
      // Add customer details section with left-aligned text values
      addHeader('CUSTOMER DETAILS', 3);
      addDataRow('Customer Name', results.inputValues.customerName, 4, false);
      addDataRow('Machine Name', results.inputValues.machineName, 5, false);
      addDataRow('WO. NO', results.inputValues.woNo, 6, false);
      addDataRow('Assembly Name', results.inputValues.assemblyName, 7, false);

      // Add tie rod calculations section with left-aligned values
      addHeader('TIE ROD CALCULATIONS', 9);
      
      // Add tie rod data with left-aligned text
      addDataRow('Diameter (cm)', results.inputValues.tieRodDiameter, 10, false);
      addDataRow('Area (cm²)', results.area, 11, false);
      addDataRow('Working Stress (kg/cm²)', results.inputValues.workingStress, 12, false);
      addDataRow('Load (Tons)', results.load, 13, false);

      // Add thread calculations section with left-aligned values
      addHeader('THREAD CALCULATIONS', 15);
      
      // Add thread data with left-aligned text
      addDataRow('Thread Diameter', results.inputValues.threadDiameter, 16, false);
      addDataRow('Thread Area', results.threadArea, 17, false);
      addDataRow('Yield Strength', results.inputValues.yieldStrength, 18, false);
      addDataRow('Factor of Safety', results.inputValues.fos, 19, false);
      addDataRow('Thread Load', results.threadLoad, 20, false);
      
      // Add FORMULAS section
      addHeader('FORMULAS', 22);
      
      // Add formula descriptions with proper formatting
      const addFormulaRow = (formula: string, description: string, rowNum: number) => {
        const row = worksheet.getRow(rowNum);
        row.values = [formula, description];
        row.eachCell((cell, colNumber) => {
          cell.style = {
            font: { 
              name: 'Arial', 
              size: 10,
              bold: colNumber === 1,  // Make column A bold
              italic: colNumber === 2  // Keep column B italic
            },
            alignment: { 
              horizontal: 'left', 
              vertical: 'middle',
              wrapText: true
            },
            border: {
              top: { style: 'thin', color: { argb: 'D3D3D3' } },
              bottom: { style: 'thin', color: { argb: 'D3D3D3' } },
              left: { style: 'thin', color: { argb: 'D3D3D3' } },
              right: { style: 'thin', color: { argb: 'D3D3D3' } }
            }
          };
        });
        row.height = 18;
      };
      
      // Add formula rows
      addFormulaRow('Tie Rod Area (cm²)', '= (π × (Tie Rod Diameter)²) / 4', 23);
      addFormulaRow('Tie Rod Load (Tons)', '= (Tie Rod Area × Working Stress) / 1000', 24);
      addFormulaRow('Thread Area (cm²)', '= (π × (Thread Diameter)²) / 4', 25);
      addFormulaRow('Thread Load (Tons)', '= (Thread Area × Yield Strength) / (FOS × 1000)', 26);
      
      // Add empty row for spacing
      worksheet.addRow([]);
      
      // Add AUTHORIZATION section header
      addHeader('AUTHORIZATION', 28);
      
      // Add authorization rows with empty values (no hyphens)
      addDataRow('Prepared By', '', 29, false, true);
      addDataRow('Checked By', '', 30, false, true);
      addDataRow('Approved By', '', 31, false, true);
      addDataRow('Date', '', 32, false, true);
      
      // Removed signatureLines array as it's no longer needed
      // The authorization section now matches the style of other sections

      // Add borders to all cells
      const addBorders = (cell: ExcelJS.Cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      };

      for (let i = 1; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        row.eachCell((cell) => {
          addBorders(cell);
        });
      }

      // Write and save the workbook
      workbook.xlsx.writeBuffer().then((buffer) => {
        const excelBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelBlob, 'tierod_calculations.xlsx');
      });
    } catch (error) {
      console.error('Error generating Excel file:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 3 }}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f5f7fa' }}>
        <Typography variant="h5" align="center" sx={{ 
          color: '#1a237e', 
          fontWeight: 'bold',
          mb: 1
        }}>
          BARANI HYDRAULICS INDIA PRIVATE LIMITED
        </Typography>
        <Typography variant="h6" align="center" sx={{ 
          color: '#303f9f',
          fontWeight: 'medium',
          mb: 2
        }}>
          TIE ROD & THREAD CALCULATIONS
        </Typography>
        
        <Divider sx={{ my: 2, borderColor: '#90caf9' }} />
        
        {/* Customer Details Card */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'white' }}>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 'bold', 
            color: '#1a237e',
            mb: 2,
            borderBottom: '1px solid #e0e0e0',
            pb: 1
          }}>
            CUSTOMER DETAILS
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DetailItem label="Customer Name" value={results.inputValues.customerName} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailItem label="Machine Name" value={results.inputValues.machineName} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailItem label="WO. NO" value={results.inputValues.woNo} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailItem label="Assembly Name" value={results.inputValues.assemblyName} />
            </Grid>
          </Grid>
        </Paper>

        {/* Tie Rod Calculations Card */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%', backgroundColor: 'white' }}>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 'bold', 
                color: '#1a237e',
                mb: 2,
                borderBottom: '1px solid #e0e0e0',
                pb: 1
              }}>
                TIE ROD CALCULATIONS
              </Typography>
              
              <DetailItem label="Diameter" value={`${results.inputValues.tieRodDiameter} cm`} />
              <DetailItem label="Area" value={`${results.area} cm²`} />
              <DetailItem label="Working Stress" value={`${results.inputValues.workingStress} kg/cm²`} />
              <DetailItem label="Load" value={`${results.load} Tons`} variant="h6" />
            </Paper>
          </Grid>

          {/* Thread Calculations Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%', backgroundColor: 'white' }}>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 'bold', 
                color: '#1a237e',
                mb: 2,
                borderBottom: '1px solid #e0e0e0',
                pb: 1
              }}>
                THREAD CALCULATIONS
              </Typography>
              
              <DetailItem label="Thread Diameter" value={`${results.inputValues.threadDiameter} cm`} />
              <DetailItem label="Thread Area" value={`${results.threadArea} cm²`} />
              <DetailItem label="Yield Strength" value={`${results.inputValues.yieldStrength} kg/cm²`} />
              <DetailItem label="Factor of Safety" value={results.inputValues.fos} />
              <DetailItem label="Thread Load" value={`${results.threadLoad} Tons`} variant="h6" />
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f5f7fa' }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 'bold', 
              color: '#1a237e',
              mb: 2,
              textAlign: 'center'
            }}>
              EXPORT OPTIONS
            </Typography>
            
            <Grid container alignItems="center" justifyContent="space-between">
  {/* Back Button Left */}
  <Grid item>
    <Button
      variant="outlined"
      color="primary"
      onClick={() => window.location.assign('/tierod')}
      sx={{
        borderColor: '#1976d2', color: '#1976d2',
        minWidth: '140px', height: '34px', fontSize: '13px', textTransform: 'none',
        fontWeight: 'medium',
        mr: 2,
        '&:hover': { borderColor: '#115293', backgroundColor: '#e3eafc' }
      }}
      startIcon={<ArrowBackIcon />}
    >
      Back to Calculator
    </Button>
  </Grid>
  {/* Export Buttons Right */}
  <Grid item>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-end', '& > *': { flex: '1 1 120px', maxWidth: '140px' } }}>
      <BlobProvider document={<PDFDocument results={results} />}>
        {({ loading, url }: { loading: boolean, url: string | null }) => (
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            disabled={loading || !results}
            href={url || '#'}
            download="tierod_calculations.pdf"
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              width: '120px',
              height: '34px',
              textTransform: 'none',
              fontSize: '13px',
              '&:hover': { backgroundColor: '#b71c1c' }
            }}
          >
            {loading ? 'Generating...' : 'Download PDF'}
          </Button>
        )}
      </BlobProvider>
      <Button
        variant="contained"
        startIcon={<TableChartIcon />}
        onClick={() => {
          try {
            // Helper function to clean values and add text-based units
            const formatValue = (value: string, unit: string = ''): string => {
              if (!value) return '';
              // Clean the value
              let cleanValue = String(value)
                .replace(/\s*\([^)]*\)/g, '')  // Remove anything in parentheses
                .replace(/[^\d.,-]/g, '')  // Remove all non-numeric characters except .,-
                .replace(/,/g, '.')  // Convert commas to dots for decimal
                .replace(/(\.\d*?[1-9])0+$/, '$1')  // Remove trailing zeros after decimal
                .replace(/\.$/, '')  // Remove trailing decimal point
                .trim();
              // Add unit if provided and value exists
              return cleanValue ? `${cleanValue} ${unit}`.trim() : '';
            };
            const data = [
              ['Tie Rod Calculations'],
              [''],
              ['Customer Details'],
              ['Customer Name', results.inputValues.customerName || ''],
              ['Machine Name', results.inputValues.machineName || ''],
              ['WO NO', results.inputValues.woNo || ''],
              ['Assembly Name', results.inputValues.assemblyName || ''],
              [''],
              ['Technical Details'],
              ['Tie Rod Diameter', formatValue(results.inputValues.tieRodDiameter, 'cm')],
              ['Tie Rod Area', formatValue(results.area, 'cm2')],
              ['Working Stress', formatValue(results.inputValues.workingStress, 'kg/cm2')],
              ['Tie Rod Load', formatValue(results.load, 'Tons')],
              ['Thread Diameter', formatValue(results.inputValues.threadDiameter, 'cm')],
              ['Thread Area', formatValue(results.threadArea, 'cm2')],
              ['Yield Strength', formatValue(results.inputValues.yieldStrength, 'kg/cm2')],
              ['Factor of Safety', formatValue(results.inputValues.fos)],
              ['Thread Load', formatValue(results.threadLoad, 'Tons')],
              [''],
              [''],
              ['Prepared By:'],
              [''],
              ['Checked By:'],
              [''],
              ['Approved By:'],
            ];
            const csvData = data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, 'tierod_calculations.csv');
          } catch (error) {
            console.error('Error exporting to CSV:', error);
            alert('Failed to export to CSV. Please try again.');
          }
        }}
        sx={{
          backgroundColor: '#388e3c',
          color: 'white',
          width: '120px',
          height: '34px',
          textTransform: 'none',
          fontSize: '13px',
          '&:hover': { backgroundColor: '#1b5e20' }
        }}
      >
        Download CSV
      </Button>
      <Button
        variant="contained"
        startIcon={<GridOnIcon />}
        onClick={exportToExcel}
        sx={{
          backgroundColor: '#2196f3',
          color: 'white',
          width: '120px',
          height: '34px',
          textTransform: 'none',
          fontSize: '13px',
          '&:hover': { backgroundColor: '#1976d2' }
        }}
      >
        Download Excel
      </Button>
    </Box>
  </Grid>
</Grid>
          </Paper>
        </Grid>
      </Paper>
    </Box>
  );
}

export default TieRodResults;
