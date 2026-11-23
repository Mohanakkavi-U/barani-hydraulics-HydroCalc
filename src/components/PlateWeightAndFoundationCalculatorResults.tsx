import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Print as PrintIcon,
  TableChart as TableChartIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf
} from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

interface DetailItemProps {
  label: string;
  value: string | number;
  variant?: 'body1' | 'h6';
  unit?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, variant = 'body1', unit = '' }) => (
  <Box sx={{ mb: 1.5, px: 1 }}>
    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant={variant} sx={{
      fontWeight: variant === 'h6' ? 'bold' : 'normal',
      color: variant === 'h6' ? '#1976d2' : 'inherit',
      fontSize: variant === 'h6' ? '1rem' : '0.9rem'
    }}>
      {value || '-'} {unit && <span style={{ fontSize: '0.85em', color: '#666' }}>{unit}</span>}
    </Typography>
  </Box>
);

interface CustomerDetails {
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
}

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

interface WeightCalculationResults {
  plateWeight: number;
  foundationLength: number;
  foundationWidth: number;
  foundationHeight: number;
  concreteVolume: number;
  concreteWeight: number;
  totalLoad: number;
  projectName: string;
  referenceNumber: string;
  volume?: number;
  dynamicLoad?: number;
  loadBearingArea?: number;
  bearingPressure?: number;
  inputValues: WeightValues;
  customerDetails: CustomerDetails;
}

interface WeightResultsProps {
  results: WeightCalculationResults;
  onBack: () => void;
}

// PDF Document Component
const PDFDocument: React.FC<{ results: WeightCalculationResults }> = ({ results }) => {
  const safeResults: WeightCalculationResults = {
    ...results,
    plateWeight: results.plateWeight || 0,
    foundationLength: results.foundationLength || 0,
    foundationWidth: results.foundationWidth || 0,
    foundationHeight: results.foundationHeight || 0,
    concreteVolume: results.concreteVolume || 0,
    concreteWeight: results.concreteWeight || 0,
    totalLoad: results.totalLoad || 0,
    loadBearingArea: results.loadBearingArea || 0,
    bearingPressure: results.bearingPressure || 0,
    volume: results.volume || 0,
    dynamicLoad: results.dynamicLoad || 0,
    projectName: results.projectName || '',
    referenceNumber: results.referenceNumber || '',
    inputValues: results.inputValues || {
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
    },
    customerDetails: {
      customerName: results.customerDetails?.customerName || '',
      machineName: results.customerDetails?.machineName || '',
      woNo: results.customerDetails?.woNo || '',
      assemblyName: results.customerDetails?.assemblyName || ''
    }
  };

  const styles = StyleSheet.create({
    page: {
      padding: '12 18',
      fontSize: 9,
      fontFamily: 'Helvetica',
    },
    header: {
      backgroundColor: '#003366',
      padding: 5,
      marginBottom: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionHeader: {
      backgroundColor: '#003366',
      color: 'white',
      padding: 3,
      fontWeight: 'bold',
      marginTop: 6,
      marginBottom: 4,
      fontSize: 10,
    },
    logo: {
      width: 30,
      height: 30,
      marginRight: 8,
      objectFit: 'contain',
    },
    headerText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 11,
      fontWeight: 'bold',
      flex: 1,
    },
    section: {
      marginBottom: 8,
    },
    title: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
    },
    tableContainer: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 0.75,
      borderColor: '#000',
      marginBottom: 5,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 0.75,
      borderBottomColor: '#000',
      borderBottomStyle: 'solid',
      minHeight: 16,
    },
    tableCell: {
      flex: 1,
      padding: '2 3',
      borderRightWidth: 0.75,
      borderRightColor: '#000',
      borderRightStyle: 'solid',
      justifyContent: 'center',
    },
    tableCellLeft: {
      flex: 1.2,
      padding: '2 3',
      borderRightWidth: 0.75,
      borderRightColor: '#000',
      borderRightStyle: 'solid',
      justifyContent: 'center',
    },
    tableCellRight: {
      flex: 0.8,
      padding: '2 3',
      borderRightWidth: 0.75,
      borderRightColor: '#000',
      borderRightStyle: 'solid',
      justifyContent: 'center',
    },
    formula: {
      padding: 2,
      marginBottom: 2,
      backgroundColor: '#f8f8f8',
    },
    formulaText: {
      fontSize: 8,
      marginBottom: 2,
      fontFamily: 'Helvetica',
      lineHeight: 1.2,
    },
    formulaVariable: {
      fontSize: 8,
      marginBottom: 2,
      marginLeft: 10,
      fontFamily: 'Helvetica',
      lineHeight: 1.2,
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
      bottom: 15,
      left: 15,
      right: 15,
      marginTop: 5,
    },
    signatureLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    signatureText: {
      fontSize: 9,
    },
    referenceNumber: {
      position: 'absolute',
      bottom: 40,
      left: 18,
      fontSize: 8,
      color: '#666',
    },
    dateContainer: {
      textAlign: 'left',
      marginBottom: 5,
      marginLeft: 2,
    },
    dateLabel: {
      fontSize: 9,
      fontWeight: 'bold',
    },
    marginTop: {
      marginTop: 5,
    },
    marginBottom: {
      marginBottom: 3,
    },
    fontWeightBold: {
      fontWeight: 'bold',
    },
    compactRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    compactLabel: {
      width: '40%',
      fontWeight: 'bold',
    },
    compactValue: {
      width: '30%',
    },
    compactUnit: {
      width: '30%',
    },

  });

  const formatNumber = (value: unknown, decimals: number = 2): string => {
    // Handle null, undefined, empty string, or non-number values
    if (value === null || value === undefined || value === '') return '0.00';
    
    // Convert to number if it's a string
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    
    // Check if the conversion resulted in a valid number
    if (isNaN(num) || typeof num !== 'number') return '0.00';
    
    // Format the number with specified decimals
    return num.toFixed(decimals);
  };

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
            PLATE WEIGHT & FOUNDATION CALCULATOR
          </Text>
        </View>

        {/* Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>DATE:</Text>
        </View>

        {/* Customer Details - Compact Table */}
        <View style={[styles.tableContainer, {marginBottom: 5}]}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, {flex: 1.2}]}><Text>Customer Name</Text></View>
            <View style={[styles.tableCell, {flex: 1.8}]}><Text>{safeResults.customerDetails.customerName || ''}</Text></View>
            <View style={[styles.tableCell, {flex: 1.2}]}><Text>Machine Name</Text></View>
            <View style={[styles.tableCell, {flex: 1.8}]}><Text>{safeResults.customerDetails.machineName || ''}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, {flex: 1.2}]}><Text>WO. NO</Text></View>
            <View style={[styles.tableCell, {flex: 1.8}]}><Text>{safeResults.customerDetails.woNo || ''}</Text></View>
            <View style={[styles.tableCell, {flex: 1.2}]}><Text>Assembly Name</Text></View>
            <View style={[styles.tableCell, {flex: 1.8}]}><Text>{safeResults.customerDetails.assemblyName || ''}</Text></View>
          </View>
        </View>

        {/* User Input Values Section */}
        <View style={[styles.section, {marginTop: 0, padding: 2}]}>
          <Text style={[styles.sectionHeader, {marginTop: 5, marginBottom: 2}]}>INPUT VALUES</Text>
          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
              <View style={[styles.tableCell, {flex: 1.5}]}><Text style={{fontWeight: 'bold'}}>Parameter</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text style={{fontWeight: 'bold'}}>Value</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text style={{fontWeight: 'bold'}}>Unit</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, {flex: 1.5}]}><Text>Plate Length</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>{safeResults.inputValues.plateLength || '0'}</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>mm</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, {flex: 1.5}]}><Text>Plate Width</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>{safeResults.inputValues.plateWidth || '0'}</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>mm</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, {flex: 1.5}]}><Text>Plate Thickness</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>{safeResults.inputValues.plateThickness || '0'}</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>mm</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, {flex: 1.5}]}><Text>Steel Specific Weight</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>{safeResults.inputValues.steelSpecificWeight || '0'}</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>g/cm³</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, {flex: 1.5}]}><Text>Static Load</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>{safeResults.inputValues.staticLoad || '0'}</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>kg</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, {flex: 1.5}]}><Text>Tool Weight</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>{safeResults.inputValues.toolWeight || '0'}</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>kg</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, {flex: 1.5}]}><Text>Load Bearing Length</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>{safeResults.inputValues.loadBearingLength || '0'}</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>mm</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, {flex: 1.5}]}><Text>Load Bearing Width</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>{safeResults.inputValues.loadBearingWidth || '0'}</Text></View>
              <View style={[styles.tableCell, {flex: 1}]}><Text>mm</Text></View>
            </View>
          </View>
        </View>

        {/* Compact Formula Section */}
        <View style={[styles.section, {marginTop: 0, padding: 2}]}>
          <Text style={[styles.sectionHeader, {marginTop: 5, marginBottom: 2}]}>FORMULAS USED</Text>
          <View style={[styles.formula, {padding: 3, marginBottom: 2}]}>
            <Text style={[styles.formulaTitle, {marginBottom: 1}]}>1. Plate Volume: V = L × W × T (mm³)</Text>
            <Text style={[styles.formulaTitle, { marginBottom: 1, fontSize: 10 }]}>2. Plate Weight: W = (V x rho) / 10^6 (kg)</Text>
            <Text style={[styles.formulaTitle, {marginBottom: 1}]}>3. Dynamic Load: F = (S + T) × 9.81 (N)</Text>
            <Text style={[styles.formulaTitle, {marginBottom: 1}]}>4. Bearing Pressure: P = F ÷ A (N/mm²)</Text>
          </View>
          <View style={{flexDirection: 'row', fontSize: 7, marginTop: 3}}>
            <View style={{flex: 1, paddingRight: 5}}>
              <Text style={{fontSize: 7, fontWeight: 'bold'}}>Where:</Text>
              <Text style={{fontSize: 7}}>L = Length (mm), W = Width (mm), T = Thickness (mm)</Text>
              <Text style={{fontSize: 7}}>V = Volume (mm³), ρ = Specific weight (g/cm³)</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 7}}>S = Static Load (kg), T = Tool Weight (kg)</Text>
              <Text style={{fontSize: 7}}>F = Dynamic Load (N), A = Bearing Area (mm²)</Text>
              <Text style={{fontSize: 7}}>P = Bearing Pressure (N/mm²)</Text>
            </View>
          </View>
        </View>

        {/* Plate Weight Calculations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PLATE WEIGHT CALCULATIONS</Text>
          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
              <View style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>Parameters</Text></View>
              <View style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>Values</Text></View>
              <View style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>Units</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Plate Weight</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.plateWeight)}</Text></View>
              <View style={styles.tableCell}><Text>kg</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Volume</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.volume)}</Text></View>
              <View style={styles.tableCell}><Text>mm³</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Dynamic Load</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.dynamicLoad)}</Text></View>
              <View style={styles.tableCell}><Text>N</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Load Bearing Area</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.loadBearingArea)}</Text></View>
              <View style={styles.tableCell}><Text>mm²</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Bearing Pressure</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.bearingPressure || 0)}</Text></View>
              <View style={styles.tableCell}><Text>N/mm²</Text></View>
            </View>
          </View>
        </View>

        {/* Foundation Calculations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>FOUNDATION CALCULATIONS</Text>
          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
              <View style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>Parameters</Text></View>
              <View style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>Values</Text></View>
              <View style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>Units</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Foundation Length</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.foundationLength)}</Text></View>
              <View style={styles.tableCell}><Text>mm</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Foundation Width</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.foundationWidth)}</Text></View>
              <View style={styles.tableCell}><Text>mm</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Foundation Height</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.foundationHeight)}</Text></View>
              <View style={styles.tableCell}><Text>mm</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Concrete Volume</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.concreteVolume)}</Text></View>
              <View style={styles.tableCell}><Text>m³</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text>Concrete Weight</Text></View>
              <View style={styles.tableCell}><Text>{formatNumber(safeResults.concreteWeight)}</Text></View>
              <View style={styles.tableCell}><Text>kg</Text></View>
            </View>
            <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
              <View style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>Total Load</Text></View>
              <View style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>{formatNumber(safeResults.totalLoad)}</Text></View>
              <View style={styles.tableCell}><Text style={{ fontWeight: 'bold' }}>kg</Text></View>
            </View>
          </View>
        </View>

        {/* Footer */}
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

// Main Component
const WeightResultsComponent: React.FC<WeightResultsProps> = ({ results, onBack }) => {
  const [loading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper function to safely format numbers
  const formatNumber = (value: unknown, decimals: number = 2): string => {
    // Handle null, undefined, empty string, or non-number values
    if (value === null || value === undefined || value === '') return '0.00';
    
    // Convert to number if it's a string
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    
    // Check if the conversion resulted in a valid number
    if (isNaN(num) || typeof num !== 'number') return '0.00';
    
    // Format the number with specified decimals
    return num.toFixed(decimals);
  };

  // Safely access results with defaults
  const safeResults: WeightCalculationResults = {
    plateWeight: results?.plateWeight || 0,
    foundationLength: results?.foundationLength || 0,
    foundationWidth: results?.foundationWidth || 0,
    foundationHeight: results?.foundationHeight || 0,
    concreteVolume: results?.concreteVolume || 0,
    concreteWeight: results?.concreteWeight || 0,
    totalLoad: results?.totalLoad || 0,
    loadBearingArea: results?.loadBearingArea || 0,
    bearingPressure: results?.bearingPressure || 0,
    volume: results?.volume || 0,
    dynamicLoad: results?.dynamicLoad || 0,
    projectName: results?.projectName || '',
    referenceNumber: results?.referenceNumber || '',
    inputValues: results?.inputValues || {
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
    },
    customerDetails: results?.customerDetails || {
      customerName: '',
      machineName: '',
      woNo: '',
      assemblyName: ''
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Helper function to clean numeric values for Excel
  const cleanNumericValue = (value: string | number): string => {
    if (value === null || value === undefined || value === '') return '';
    return String(value)
      .replace(/([\d.,-]+).*/, '$1')  // Remove any text after numbers (including units)
      .replace(/,/g, '.')  // Convert commas to dots for decimal
      .replace(/[^\d.-]/g, '')  // Remove any remaining non-numeric characters except . and -
      .replace(/(\.\d*?[1-9])0+$/, '$1')  // Remove trailing zeros after decimal
      .replace(/\.$/, '');  // Remove trailing decimal point
  };

  const exportToCSV = () => {
    try {
      // Prepare data for CSV with headers and metadata
      const inputData = [
        ['BARANI HYDRAULICS INDIA PRIVATE LIMITED'],
        ['Plate Weight & Foundation Calculator'],
        ['Date', ''],
        [], // Empty row for spacing
        ['CUSTOMER DETAILS'],
        ['Customer Name', safeResults.customerDetails.customerName || 'N/A'],
        ['Machine Name', safeResults.customerDetails.machineName || 'N/A'],
        ['WO No.', safeResults.customerDetails.woNo || 'N/A'],
        ['Assembly Name', safeResults.customerDetails.assemblyName || 'N/A'],
        [], // Empty row for spacing
        ['INPUT VALUES'],
        ['Parameter', 'Value', 'Unit'],
        ['Plate Length', safeResults.inputValues.plateLength || '0', 'mm'],
        ['Plate Width', safeResults.inputValues.plateWidth || '0', 'mm'],
        ['Plate Thickness', safeResults.inputValues.plateThickness || '0', 'mm'],
        ['Steel Specific Weight', safeResults.inputValues.steelSpecificWeight || '0', 'g/cm³'],
        ['Static Load', safeResults.inputValues.staticLoad || '0', 'kg'],
        ['Tool Weight', safeResults.inputValues.toolWeight || '0', 'kg'],
        ['Load Bearing Length', safeResults.inputValues.loadBearingLength || '0', 'mm'],
        ['Load Bearing Width', safeResults.inputValues.loadBearingWidth || '0', 'mm'],
        [], // Empty row for spacing
        ['CALCULATION RESULTS'],
        ['Parameter', 'Value', 'Unit'],
        ['Plate Weight', formatNumber(safeResults.plateWeight), 'kg'],
        ['Volume', formatNumber(safeResults.volume), 'mm³'],
        ['Dynamic Load', formatNumber(safeResults.dynamicLoad), 'N'],
        ['Load Bearing Area', formatNumber(safeResults.loadBearingArea), 'mm²'],
        ['Bearing Pressure', formatNumber(safeResults.bearingPressure || 0), 'N/mm²'],
        ['Foundation Length', formatNumber(safeResults.foundationLength), 'mm'],
        ['Foundation Width', formatNumber(safeResults.foundationWidth), 'mm'],
        ['Foundation Height', formatNumber(safeResults.foundationHeight), 'mm'],
        ['Concrete Volume', formatNumber(safeResults.concreteVolume), 'm³'],
        ['Concrete Weight', formatNumber(safeResults.concreteWeight), 'kg'],
        ['Total Load', formatNumber(safeResults.totalLoad), 'kg'],
        [], // Empty row for spacing
        ['AUTHORIZATION'],
        ['Prepared By'],
        ['Checked By'],
        ['Approved By']
      ];

      // Create CSV content with proper escaping
      const csvContent = inputData.map(row => 
        row.map(cell => {
          // Convert cell to string and escape quotes
          const cellStr = String(cell);
          // If cell contains comma, quote, or newline, wrap in quotes and escape existing quotes
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      ).join('\r\n'); // Use \r\n for better Excel compatibility

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `plate_weight_calculation_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };

  const exportToExcel = async () => {
    try {
      setIsGenerating(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Plate Weight Calculation');
      
      // Set column widths and alignments
      worksheet.getColumn(1).width = 35; // Parameter column
      worksheet.getColumn(1).alignment = { 
        horizontal: 'left', 
        vertical: 'middle',
        wrapText: true
      };
      
      worksheet.getColumn(2).width = 25; // Value column
      worksheet.getColumn(2).alignment = { 
        horizontal: 'right', 
        vertical: 'middle',
        wrapText: true
      };
      worksheet.getColumn(2).numFmt = '0.00'; // Format numbers to 2 decimal places
      
      worksheet.getColumn(3).width = 20; // Slightly wider unit column
      worksheet.getColumn(3).alignment = { 
        horizontal: 'left', 
        vertical: 'middle',
        wrapText: true
      };
      
      // Set default row height and alignment for all rows
      worksheet.properties.defaultRowHeight = 20;
      
      // Hide all columns beyond C by setting their width to 0.1 (minimum width)
      // and making them very narrow
      for (let i = 4; i <= 1000; i++) { // Cover a large number of columns
        const column = worksheet.getColumn(i);
        if (column) {
          column.hidden = true;
          column.width = 0.1; // Minimum width
        }
      }
      
      // Set the first 3 columns to be visible with proper widths
      worksheet.getColumn(1).width = 35; // Column A
      worksheet.getColumn(2).width = 25; // Column B
      worksheet.getColumn(3).width = 20; // Column C
      
      // Helper function to add a header row
      const addHeader = (text: string, rowNumber: number) => {
        const row = worksheet.getRow(rowNumber);
        
        // Split the text into multiple lines if needed
        const maxLength = 60; // Maximum characters per line
        const wrappedText = text.length > maxLength 
          ? text.match(new RegExp(`.{1,${maxLength}}(\\s|$)`, 'g'))?.join('\n') || text
          : text;
          
        // Set the value in column A only
        const cell = worksheet.getCell(`A${rowNumber}`);
        cell.value = wrappedText;
        cell.font = { 
          name: 'Arial',
          bold: true, 
          size: 14, 
          color: { argb: '000000' } 
        };
        
        // Set alignment and wrap text
        cell.alignment = { 
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true
        };
        
        // Set row height to accommodate wrapped text
        const lineCount = wrappedText.split('\n').length;
        row.height = Math.max(35, lineCount * 18); // Adjust height based on number of lines
        
        // Merge only columns A to C
        worksheet.mergeCells(`A${rowNumber}:C${rowNumber}`);
      };

      // Helper function to add a section header
      const addSectionHeader = (text: string, rowNumber: number) => {
        const row = worksheet.getRow(rowNumber);
        
        // Split the text into multiple lines if needed
        const maxLength = 60; // Maximum characters per line
        const wrappedText = text.length > maxLength 
          ? text.match(new RegExp(`.{1,${maxLength}}(\\s|$)`, 'g'))?.join('\n') || text
          : text;
        
        // Set the value in column A only
        const cell = worksheet.getCell(`A${rowNumber}`);
        cell.value = wrappedText;
        cell.font = { 
          name: 'Arial',
          bold: true, 
          size: 12, 
          color: { argb: '000000' } 
        };
        
        // Set alignment and wrap text
        cell.alignment = { 
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        };
        
        // Set background color for the merged cells
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '003366' }, // Same dark blue as headers
        };
        cell.font = {
          name: 'Arial',
          bold: true, 
          size: 12, 
          color: { argb: 'FFFFFF' } // White text for better contrast
        };
        
        // Set row height to accommodate wrapped text
        const lineCount = wrappedText.split('\n').length;
        row.height = Math.max(25, lineCount * 18); // Adjust height based on number of lines
        
        // Merge only columns A to C
        worksheet.mergeCells(`A${rowNumber}:C${rowNumber}`);
      };

      // Helper function to add a data row with unit
      const addDataRowWithUnit = (label: string, value: string | number, unit: string, rowNumber: number) => {
        const row = worksheet.getRow(rowNumber);
        const cleanValue = cleanNumericValue(String(value));
        
        // Add data to all three columns
        row.values = [label, cleanValue, unit];
        
        // Style the row
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
          cell.border = {
            left: { style: 'thin', color: { argb: 'D3D3D3' } },
            right: { style: 'thin', color: { argb: 'D3D3D3' } },
            bottom: { style: 'thin', color: { argb: 'D3D3D3' } }
          };
          
          if (colNumber === 1) { // First column (Parameter)
            cell.font = { name: 'Arial', size: 11, bold: true };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'F5F5F5' }
            };
            cell.alignment = { horizontal: 'left' };
          } else { // Second and third columns (Value and Unit)
            cell.font = { name: 'Arial', size: 11 };
            cell.alignment = { horizontal: 'right' };
          }
        });
        
        row.height = 22;
      };
      
      // Add company header with blue background
      const companyNameRow = worksheet.addRow(['BARANI HYDRAULICS INDIA PRIVATE LIMITED']);
      const companyNameCell = worksheet.getCell('A1');
      companyNameCell.font = { 
        name: 'Arial', 
        bold: true, 
        size: 16, 
        color: { argb: 'FFFFFF' } // White text
      };
      companyNameCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '003366' } // Dark blue background to match Tie Rod Calculator
      };
      companyNameCell.alignment = { 
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      companyNameRow.height = 35;
      worksheet.mergeCells('A1:C1');
      
      // Add calculator name with lighter blue background
      const calculatorNameRow = worksheet.addRow(['PLATE WEIGHT & FOUNDATION CALCULATOR']);
      const calculatorNameCell = worksheet.getCell('A2');
      calculatorNameCell.font = { 
        name: 'Arial', 
        bold: true, 
        size: 14, 
        color: { argb: 'FFFFFF' } // White text
      };
      calculatorNameCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '003366' } // Same dark blue as company name header
      };
      calculatorNameCell.alignment = { 
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      calculatorNameRow.height = 30;
      worksheet.mergeCells('A2:C2');
      
      // Add date label (without actual date)
      const dateRow = worksheet.addRow(['DATE:']);
      const dateCell = worksheet.getCell('A3');
      dateCell.font = { 
        name: 'Arial', 
        size: 10,
        bold: true
      };
      dateCell.alignment = { 
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true
      };
      dateRow.height = 20;
      worksheet.mergeCells('A3:C3');
      
      // Add empty row for spacing
      const emptyRow = worksheet.addRow([]);
      emptyRow.height = 10; // Add some spacing after the header section
      
      // Add customer details section
      addSectionHeader('CUSTOMER DETAILS', 5);
      
      // Add customer details
      const addCustomerDetail = (label: string, value: any, rowNum: number) => {
        const row = worksheet.getRow(rowNum);
        row.values = [label, value];
        row.height = 18;
        
        // Set alignment and font for customer details label
        const labelCell = row.getCell(1);
        labelCell.alignment = { 
          horizontal: 'left',
          vertical: 'middle'
        };
        labelCell.font = { 
          name: 'Arial', 
          size: 10,
          bold: true
        };
        
        // Set alignment for customer details value
        const valueCell = row.getCell(2);
        valueCell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        };
        valueCell.font = { 
          name: 'Arial', 
          size: 10,
          bold: false
        };
      };
      
      // Add customer details
      addCustomerDetail('Customer Name', safeResults.customerDetails.customerName, 6);
      addCustomerDetail('Machine Name', safeResults.customerDetails.machineName, 7);
      addCustomerDetail('WO. NO', safeResults.customerDetails.woNo, 8);
      addCustomerDetail('Assembly Name', safeResults.customerDetails.assemblyName, 9);
      
      // Add empty row after customer details
      const emptyRowAfterCustomer = worksheet.addRow([]);
      emptyRowAfterCustomer.height = 10;
      
      // Add input details section
      const inputDetailsStartRow = 11; // Starting row for input details
      addSectionHeader('INPUT DETAILS', inputDetailsStartRow);
      
      // Add input details in a tabular format
      const inputDetails = [
        { label: '1. Plate Length', value: results.inputValues.plateLength, unit: 'mm' },
        { label: '2. Plate Width', value: results.inputValues.plateWidth, unit: 'mm' },
        { label: '3. Plate Thickness', value: results.inputValues.plateThickness, unit: 'mm' },
        { label: '4. Steel Specific Weight', value: results.inputValues.steelSpecificWeight, unit: 'kg/m³' },
        { label: '5. Static Load', value: results.inputValues.staticLoad, unit: 'kg' },
        { label: '6. Tool Weight', value: results.inputValues.toolWeight, unit: 'kg' },
        { label: '7. Load Bearing Length', value: results.inputValues.loadBearingLength, unit: 'mm' },
        { label: '8. Load Bearing Width', value: results.inputValues.loadBearingWidth, unit: 'mm' }
      ];
      
      // Add input details with proper formatting
      inputDetails.forEach((detail, index) => {
        addDataRowWithUnit(
          detail.label,
          detail.value || '0',
          detail.unit,
          inputDetailsStartRow + 1 + index // Start from row after the header
        );
      });
      
      // Calculate the next available row after input details
      const nextRowAfterInputs = inputDetailsStartRow + 1 + inputDetails.length;
      
      // Add empty row after input details
      const emptyRowAfterInputs = worksheet.getRow(nextRowAfterInputs);
      emptyRowAfterInputs.height = 10;
      
      // Add Plate Weight Calculation section after input details
      const plateWeightStartRow = nextRowAfterInputs + 1;
      addSectionHeader('PLATE WEIGHT CALCULATION', plateWeightStartRow);
      
      // Add plate weight calculation rows
      const plateWeightRows = [
        { label: 'Plate Weight', value: safeResults.plateWeight, unit: 'kg' },
        { label: 'Volume', value: safeResults.volume || 0, unit: 'mm³' },
        { label: 'Dynamic Load', value: safeResults.dynamicLoad || 0, unit: 'N' },
        { label: 'Load Bearing Area', value: safeResults.loadBearingArea || 0, unit: 'mm²' },
        { label: 'Bearing Pressure', value: safeResults.bearingPressure || 0, unit: 'N/mm²' }
      ];
      
      plateWeightRows.forEach((row, index) => {
        addDataRowWithUnit(
          row.label,
          row.value,
          row.unit,
          plateWeightStartRow + 1 + index
        );
      });
      
      // Calculate the next available row after plate weight section
      const nextRowAfterPlateWeight = plateWeightStartRow + 1 + plateWeightRows.length;
      
      // Add empty row after Plate Weight section
      const emptyRowAfterPlateWeight = worksheet.getRow(nextRowAfterPlateWeight);
      emptyRowAfterPlateWeight.height = 10;
      
      // Add Foundation Calculation section
      const foundationStartRow = nextRowAfterPlateWeight + 1;
      addSectionHeader('FOUNDATION CALCULATION', foundationStartRow);
      
      // Add foundation calculation rows
      const foundationRows = [
        { label: 'Foundation Length', value: safeResults.foundationLength, unit: 'mm' },
        { label: 'Foundation Width', value: safeResults.foundationWidth, unit: 'mm' },
        { label: 'Foundation Height', value: safeResults.foundationHeight, unit: 'mm' },
        { label: 'Concrete Volume', value: safeResults.concreteVolume, unit: 'm³' },
        { label: 'Concrete Weight', value: safeResults.concreteWeight, unit: 'kg' }
      ];
      
      foundationRows.forEach((row, index) => {
        addDataRowWithUnit(
          row.label,
          row.value,
          row.unit,
          foundationStartRow + 1 + index
        );
      });
      
      // Calculate the next available row after foundation section
      const nextRowAfterFoundation = foundationStartRow + 1 + foundationRows.length;
      
      // Add empty row after Foundation section
      const emptyRowAfterFoundation = worksheet.getRow(nextRowAfterFoundation);
      emptyRowAfterFoundation.height = 10;
      
      // Add Total Load section
      const totalLoadRow = nextRowAfterFoundation + 1;
      addDataRowWithUnit('TOTAL LOAD', safeResults.totalLoad, 'kg', totalLoadRow);
      
      // Make the total load row bold
      const totalLoadCell = worksheet.getCell(`B${totalLoadRow}`);
      totalLoadCell.font = { name: 'Arial', size: 11, bold: true };
      const totalLoadUnitCell = worksheet.getCell(`C${totalLoadRow}`);
      totalLoadUnitCell.font = { name: 'Arial', size: 11, bold: true };
      
      // Add empty row after Total Load
      const emptyRowAfterTotal = worksheet.getRow(totalLoadRow + 1);
      emptyRowAfterTotal.height = 10;
      
      // Add formulas section
      const formulasStartRow = totalLoadRow + 2;
      addSectionHeader('FORMULAS USED', formulasStartRow);
      
      // Add formula descriptions with proper formatting
      const addFormulaRow = (description: string, _: string, rowNum: number) => {
        const row = worksheet.getRow(rowNum);
        row.values = [description];
        row.font = { name: 'Arial', size: 10, italic: true };
        row.height = 18;
        worksheet.mergeCells(`A${rowNum}:C${rowNum}`);
        
        // Set alignment for the row
        const cell = worksheet.getCell(`A${rowNum}`);
        cell.alignment = { 
          horizontal: 'left', 
          vertical: 'middle',
          indent: 1
        };
      };
      
      addFormulaRow('1. Plate Volume Calculation', '', formulasStartRow + 1);
      addFormulaRow('   Volume (mm³) = Length × Width × Thickness', '', formulasStartRow + 2);
      
      addFormulaRow('2. Plate Weight Calculation', '', formulasStartRow + 4);
      addFormulaRow('   Weight (kg) = (Volume × Specific Weight) ÷ 1,000,000', '', formulasStartRow + 5);
      
      addFormulaRow('3. Dynamic Load Calculation', '', formulasStartRow + 7);
      addFormulaRow('   Dynamic Load (N) = (Static Load + Tool Weight) × 9.81', '', formulasStartRow + 8);
      
      addFormulaRow('4. Bearing Pressure Calculation', '', formulasStartRow + 10);
      addFormulaRow('   Bearing Pressure (N/mm²) = Dynamic Load (N) ÷ Load Bearing Area (mm²)', '', formulasStartRow + 11);
      
      // Calculate the next available row after formulas
      const nextRowAfterFormulas = formulasStartRow + 1 + 11; // 11 rows for all formula lines
      
      // Add AUTHORIZATION section with left alignment and dark blue background
      const authorizationRow = worksheet.getRow(nextRowAfterFormulas + 1);
      const authorizationCell = worksheet.getCell(`A${authorizationRow.number}`);
      
      // Set the AUTHORIZATION header with left alignment and dark blue background
      authorizationCell.value = 'AUTHORIZATION';
      authorizationCell.font = { 
        name: 'Arial', 
        size: 12, 
        bold: true,
        color: { argb: 'FFFFFF' } // White text
      };
      authorizationCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '003366' } // Dark blue background
      };
      authorizationCell.alignment = { 
        horizontal: 'left',
        vertical: 'middle',
        indent: 1 // Small left indent
      };
      worksheet.mergeCells(`A${authorizationRow.number}:C${authorizationRow.number}`);
      authorizationRow.height = 25;
      
      // Add signature labels one after another without empty rows
      const signatureLabels = ['Prepared By:', 'Checked By:', 'Approved By:'];
      
      signatureLabels.forEach((label, index) => {
        const rowNum = authorizationRow.number + 1 + index;
        const row = worksheet.getRow(rowNum);
        
        // Add label
        const labelCell = row.getCell(1);
        labelCell.value = label;
        labelCell.font = { 
          name: 'Arial', 
          size: 10, 
          bold: true 
        };
        labelCell.alignment = { 
          horizontal: 'left',
          vertical: 'middle',
          indent: 1
        };
        
        // Set row height
        row.height = 25;
      });
      
      // Add border around the entire content (A1 to C{lastRow})
      const lastRow = authorizationRow.number + signatureLabels.length;
      for (let i = 1; i <= lastRow; i++) {
        const row = worksheet.getRow(i);
        
        // Add left and right borders to all cells in columns A, B, and C
        ['A', 'B', 'C'].forEach(col => {
          const cell = worksheet.getCell(`${col}${i}`);
          
          // Add left and right borders to all cells
          cell.border = {
            ...cell.border,
            left: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
          
          // Add top border to first row
          if (i === 1) {
            cell.border = {
              ...cell.border,
              top: { style: 'thin', color: { argb: '000000' } }
            };
          }
          
          // Add bottom border to last row
          if (i === lastRow) {
            cell.border = {
              ...cell.border,
              bottom: { style: 'thin', color: { argb: '000000' } }
            };
          }
        });
      }
      
      // Set page properties
      worksheet.pageSetup = {
        orientation: 'portrait',
        horizontalCentered: true,
        verticalCentered: false,
        margins: {
          left: 0.5, right: 0.5,
          top: 0.5, bottom: 0.5,
          header: 0.3, footer: 0.3
        }
      };

      // Save the workbook
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'plate_weight_calculation.xlsx');
    } catch (error) {
      console.error('Error generating Excel file:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = <PDFDocument results={safeResults} />;
      const pdfBlob = await pdf(pdfDoc).toBlob();
      saveAs(pdfBlob, `Plate_Weight_Calculations_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
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
          PLATE WEIGHT & FOUNDATION CALCULATOR
        </Typography>
        
        <Divider sx={{ my: 2, borderColor: '#90caf9' }} />

        {/* Customer Details */}
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
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Customer Name" value={safeResults.customerDetails.customerName} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Machine Name" value={safeResults.customerDetails.machineName} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="WO No." value={safeResults.customerDetails.woNo} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DetailItem label="Assembly Name" value={safeResults.customerDetails.assemblyName} />
            </Grid>
          </Grid>
        </Paper>

        {/* Calculation Results */}
        <Paper elevation={2} sx={{ p: 3, backgroundColor: '#fff' }}>
          <Typography variant="h6" sx={{ color: '#003366', fontWeight: 'bold', mb: 2 }}>
            Calculation Results
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                  Plate Weight Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DetailItem label="Plate Weight" value={formatNumber(safeResults.plateWeight)} unit="kg" />
                  </Grid>
                  <Grid item xs={6}>
                    <DetailItem label="Load Bearing Area" value={formatNumber(safeResults.loadBearingArea)} unit="mm²" />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                  Foundation Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DetailItem label="Length" value={formatNumber(safeResults.foundationLength)} unit="mm" />
                    <DetailItem label="Width" value={formatNumber(safeResults.foundationWidth)} unit="mm" />
                    <DetailItem label="Height" value={formatNumber(safeResults.foundationHeight)} unit="mm" />
                  </Grid>
                  <Grid item xs={6}>
                    <DetailItem label="Concrete Volume" value={formatNumber(safeResults.concreteVolume)} unit="m³" />
                    <DetailItem label="Concrete Weight" value={formatNumber(safeResults.concreteWeight)} unit="kg" />
                    <DetailItem 
                      label="Bearing Pressure" 
                      value={formatNumber(safeResults.bearingPressure)} 
                      unit="N/mm²" 
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f0f7ff', borderColor: '#1976d2' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={8}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      Total Load on Foundation
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Includes plate weight, concrete weight, and additional loads
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {formatNumber(safeResults.totalLoad)} kg
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Calculator
          </Button>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<TableChartIcon />}
              onClick={exportToCSV}
              sx={{ 
                backgroundColor: '#4caf50', 
                '&:hover': { 
                  backgroundColor: '#388e3c' 
                },
                mr: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}
            >
              EXPORT AS CSV
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<PictureAsPdfIcon />}
              disabled={isGenerating}
              onClick={handleGeneratePDF}
              sx={{ minWidth: '150px' }}
            >
              {isGenerating ? 'Generating...' : 'Export as PDF'}
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<TableChartIcon />}
              onClick={exportToExcel}
              disabled={isGenerating}
              sx={{ minWidth: '150px' }}
            >
              {isGenerating ? 'Generating...' : 'Export as Excel'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default WeightResultsComponent;
