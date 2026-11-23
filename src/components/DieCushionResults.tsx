import { useState, useCallback, FC, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, Box, Paper, CircularProgress, Grid, Button, Divider } from '@mui/material';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';


// PDF Document Component for Die Cushion Results
const DieCushionPDF: React.FC<{ results: DieCushionResults }> = ({ results }) => {
  const styles = StyleSheet.create({
    page: {
      padding: '12 18',
      fontSize: 9,
      fontFamily: 'Helvetica',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
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
    tableCellHeader: {
      flex: 1,
      padding: '2 3',
      borderRightWidth: 0.75,
      borderRightColor: '#000',
      borderRightStyle: 'solid',
      backgroundColor: '#f0f0f0',
      fontWeight: 'bold',
      justifyContent: 'center',
    },
    customerInfo: {
      marginBottom: 10,
    },
    customerRow: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    customerLabel: {
      width: 100,
      fontWeight: 'bold',
    },
    customerValue: {
      flex: 1,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 'auto',
      padding: '10px 20px',
      marginBottom: 10,
    },
    signatureLabel: {
      fontSize: 10,
      textAlign: 'center',
    },
  });

  const formatValue = (value: any, unit: string = '') => {
    if (value === null || value === undefined || value === '') return 'N/A';
    return `${value} ${unit}`.trim();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          {/* Header with Blue Background */}
          <View style={styles.header}>
            <Image src="logo.png" style={styles.logo} />
            <View style={styles.headerText}>
              <Text>BARANI HYDRAULICS INDIA PRIVATE LIMITED</Text>
              <Text>DIE CUSHION CYLINDERS CALCULATION REPORT</Text>
            </View>
          </View>

          {/* Customer Details */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>CUSTOMER DETAILS</Text>
            <View style={[styles.tableContainer, { marginBottom: 10 }]}> 
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '30%' }]}>Customer Name</Text>
                <Text style={[styles.tableCell, { width: '70%' }]}>{results.customerDetails?.customerName || 'N/A'}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '30%' }]}>Machine Name</Text>
                <Text style={[styles.tableCell, { width: '70%' }]}>{results.customerDetails?.machineName || 'N/A'}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '30%' }]}>WO No</Text>
                <Text style={[styles.tableCell, { width: '70%' }]}>{results.customerDetails?.woNo || 'N/A'}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}> 
                <Text style={[styles.tableCell, { width: '30%' }]}>Assembly Name</Text>
                <Text style={[styles.tableCell, { width: '70%' }]}>{results.customerDetails?.assemblyName || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Performance Data */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>PERFORMANCE DATA</Text>
            {/* Up Speed Table */}
            <Text style={styles.title}>UP SPEED</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCellHeader}>Cylinder Size (mm)</Text>
                <Text style={styles.tableCellHeader}>Area (cm²)</Text>
                <Text style={styles.tableCellHeader}>Speed (mm/s)</Text>
                <Text style={styles.tableCellHeader}>Inlet Flow (lpm)</Text>
                <Text style={styles.tableCellHeader}>Outlet Flow (lpm)</Text>
                <Text style={styles.tableCellHeader}>Pressure (bar)</Text>
                <Text style={styles.tableCellHeader}>Force</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{formatValue(results.upSpeed?.cylinderSize)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.upSpeed?.area)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.upSpeed?.speed)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.upSpeed?.inletFlow)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.upSpeed?.outletFlow)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.upSpeed?.pressure)}</Text>
                <Text style={styles.tableCell}>{results.upSpeed?.force || 'N/A'}</Text>
              </View>
            </View>
            {/* Down Speed Table */}
            <Text style={styles.title}>DOWN SPEED</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCellHeader}>Cylinder Size (mm)</Text>
                <Text style={styles.tableCellHeader}>Area (cm²)</Text>
                <Text style={styles.tableCellHeader}>Speed (mm/s)</Text>
                <Text style={styles.tableCellHeader}>Inlet Flow (lpm)</Text>
                <Text style={styles.tableCellHeader}>Outlet Flow (lpm)</Text>
                <Text style={styles.tableCellHeader}>Pressure (bar)</Text>
                <Text style={styles.tableCellHeader}>Force</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{formatValue(results.downSpeed?.cylinderSize)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.downSpeed?.area)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.downSpeed?.speed)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.downSpeed?.inletFlow)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.downSpeed?.outletFlow)}</Text>
                <Text style={styles.tableCell}>{formatValue(results.downSpeed?.pressure)}</Text>
                <Text style={styles.tableCell}>{results.downSpeed?.force || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Port Sizes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>PORT SIZES</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '50%' }]}>Die Cushion Cylinder Port Size</Text>
                <Text style={[styles.tableCell, { width: '50%' }]}>{results.dieCushionCylinderPortSize || 'N/A'}</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}> 
                <Text style={[styles.tableCell, { width: '50%' }]}>Die Cushion Port Size</Text>
                <Text style={[styles.tableCell, { width: '50%' }]}>{results.dieCushionPortSize || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Footer for signatures */}
          <View style={styles.footer}>
            <Text style={styles.signatureLabel}>Checked By: ______________</Text>
            <Text style={styles.signatureLabel}>Approved By: ______________</Text>
            <Text style={styles.signatureLabel}>Date: ______________</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Define CustomerDetails interface since it's not imported
interface CustomerDetails {
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
}

// Define local interfaces
export interface DieCushionResult {
  description: string;
  cylinderSize: number;
  area: number;
  speed: number;
  inletFlow: number;
  outletFlow: number;
  pressure: number;
  force: string;
}

export interface DieCushionResults {
  upSpeed: DieCushionResult;
  downSpeed: DieCushionResult;
  dieCushionCylinderPortSize: string;
  dieCushionPortSize: string;
  customerDetails?: CustomerDetails;
}

// Extend ExcelJS Worksheet type
declare module 'exceljs' {
  interface Worksheet {
    mergeCells(cells: string): void;
  }
}

interface DetailItemProps {
  label: string;
  value: string | number | null | undefined | Record<string, unknown>;
  unit?: string;
  variant?: 'body1' | 'h6';
}

const safeToFixed = (value: number | string | undefined | null): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'string' && value.trim() === '') return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 'N/A' : num.toFixed(2);
};

const DetailItem: FC<DetailItemProps> = ({ label, value, unit = '', variant = 'body1' }) => {
  const getDisplayValue = () => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      if ('value' in value && value.value !== undefined) {
        return String(value.value);
      }
      try {
        return JSON.stringify(value);
      } catch {
        return 'Invalid value';
      }
    }
    return String(value);
  };

  const displayValue = getDisplayValue();
  
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" color="textSecondary" display="block">
        {label}
      </Typography>
      <Typography variant={variant}>
        {displayValue} {unit && <span style={{ fontSize: '0.8em', color: '#666' }}>{unit}</span>}
      </Typography>
    </Box>
  );
};

interface CushionStageProps {
  title: string;
  data: DieCushionResult | null;
}

const CushionStage: FC<CushionStageProps> = ({ title, data }) => {
  if (!data) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DetailItem label="Cylinder Size" value={data.cylinderSize || 'N/A'} unit="mm" />
          <DetailItem label="Speed" value={data.speed || 'N/A'} unit="mm/s" />
          <DetailItem label="Inlet Flow" value={safeToFixed(data.inletFlow)} unit="lpm" />
        </Grid>
        <Grid item xs={6}>
          <DetailItem label="Area" value={safeToFixed(data.area)} unit="cm²" />
          <DetailItem label="Pressure" value={data.pressure || 'N/A'} unit="bar" />
          <DetailItem label="Outlet Flow" value={safeToFixed(data.outletFlow)} unit="lpm" />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ 
            mb: 1,
            p: 1,
            backgroundColor: '#f5f7fa',
            borderRadius: 1,
            textAlign: 'center'
          }}>
            <Typography variant="caption" color="textSecondary" display="block">
              Force
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {data.force ? data.force.replace(/\s*tons?\s*/i, '') : 'N/A'} <span style={{ fontSize: '0.8em', color: '#666' }}>tons</span>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Helper function to safely merge cells
const safeMergeCells = (worksheet: ExcelJS.Worksheet, range: string) => {
  console.log('Checking if', range, 'is already merged:', worksheet.getCell(range.split(':')[0]).isMerged);
  if (!worksheet.getCell(range.split(':')[0]).isMerged) {
    worksheet.mergeCells(range);
    console.log('Merged cells', range);
  } else {
    console.log('Cells', range, 'are already merged, skipping merge.');
  }
};

// Helper function to format values with units
const formatValue = (value: number | string | undefined, unit: string = ''): string => {
  if (value === undefined || value === null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return unit ? `${num.toFixed(2)} ${unit}` : num.toFixed(2);
};

// Helper function to format force values
const formatForce = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)} kN`;
  }
  return `${num.toFixed(2)} N`;
};

interface DieCushionResultsProps {
  results: DieCushionResults;
}

const DieCushionResults: FC<DieCushionResultsProps> = ({ results }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate('/die-cushion'); // Update this route if your calculator page route is different
  }, [navigate]);

  const handleExportPDF = useCallback(async () => {
    if (!results) return;
    setIsGenerating(true);
    try {
      // Create a new instance of the PDF document
      const blob = await new Promise<Blob>((resolve, reject) => {
        const pdfInstance = pdf();
        
        // Create a container for the PDF
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        // Render the PDF component
        const element = <DieCushionPDF results={results} />;
        pdfInstance.updateContainer(element);
        
        // Generate the blob
        pdfInstance.toBlob().then((blob) => {
          document.body.removeChild(container);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate PDF blob'));
          }
        }).catch(reject);
      });
      
      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DieCushionCalculationReport_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [results]);

  const handleExportCSV = useCallback(() => {
    if (!results) return;
    
    try {
      setIsGenerating(true);
      
      // Format data for CSV
      const csvRows = [];
      
      // Add header
      csvRows.push('BARANI HYDRAULICS INDIA PRIVATE LIMITED');
      csvRows.push('DIE CUSHION CYLINDERS CALCULATION REPORT');
      csvRows.push('');
      
      // Add customer details
      csvRows.push('CUSTOMER DETAILS');
      csvRows.push('----------------');
      if (results.customerDetails) {
        if (results.customerDetails.customerName) csvRows.push(`Customer Name,${results.customerDetails.customerName}`);
        if (results.customerDetails.machineName) csvRows.push(`Machine Name,${results.customerDetails.machineName}`);
        if (results.customerDetails.woNo) csvRows.push(`WO No,${results.customerDetails.woNo}`);
        if (results.customerDetails.assemblyName) csvRows.push(`Assembly Name,${results.customerDetails.assemblyName}`);
      }
      csvRows.push('');
      
      // Add table header
      csvRows.push('Description,Cylinder (mm),Area (cm²),Speed (mm/s),Inlet (lpm),Outlet (lpm),Pressure (bar),Force');
      
      // Add data rows
      csvRows.push([
        'Up Speed',
        formatValue(results.upSpeed.cylinderSize, ''),
        formatValue(results.upSpeed.area, ''),
        formatValue(results.upSpeed.speed, ''),
        formatValue(results.upSpeed.inletFlow, ''),
        formatValue(results.upSpeed.outletFlow, ''),
        formatValue(results.upSpeed.pressure, ''),
        results.upSpeed.force || 'N/A'
      ].join(','));
      
      csvRows.push([
        'Down Speed',
        formatValue(results.downSpeed.cylinderSize, ''),
        formatValue(results.downSpeed.area, ''),
        formatValue(results.downSpeed.speed, ''),
        formatValue(results.downSpeed.inletFlow, ''),
        formatValue(results.downSpeed.outletFlow, ''),
        formatValue(results.downSpeed.pressure, ''),
        results.downSpeed.force || 'N/A'
      ].join(','));
      
      // Add port sizes
      csvRows.push('');
      csvRows.push('PORT SIZES');
      csvRows.push('-----------');
      csvRows.push(`Die Cushion Cylinder Port Size (A LINE SIZE),${results.dieCushionCylinderPortSize || 'N/A'}`);
      csvRows.push(`Die Cushion Port Size (B LINE SIZE),${results.dieCushionPortSize || 'N/A'}`);
      
      // Add Authorization section
      csvRows.push('');
      csvRows.push('AUTHORIZATION');
      csvRows.push('-------------');
      csvRows.push('Prepared by:,');
      csvRows.push('Checked by:,');
      csvRows.push('Approved by:,');
      
      // Create CSV content and download
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `DieCushion_Report_${new Date().toISOString().split('T')[0]}.csv`);
      
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Error generating CSV. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [results]);

  const handleExportExcel = useCallback(async () => {
    if (!results) return;
    try {
      setIsGenerating(true);
      
      // Create a new Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Die Cushion Calculation');
      for (let i = 1; i <= 8; i++) worksheet.getColumn(i).width = 22;
      worksheet.addRow(['', '', '', '', '', '', '', '']); // Empty row
      // Company Header
      const companyRow = worksheet.addRow(['BARANI HYDRAULICS INDIA PRIVATE LIMITED', '', '', '', '', '', '', '']);
      worksheet.mergeCells('A2:H2');
      companyRow.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
      companyRow.alignment = { horizontal: 'center', vertical: 'middle' };
      companyRow.height = 25;
      for (let i = 1; i <= 8; i++) {
        const cell = companyRow.getCell(i);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
        cell.border = {
          top: { style: 'medium', color: { argb: 'FF7F7F7F' } },
          left: { style: 'medium', color: { argb: 'FF7F7F7F' } },
          right: { style: 'medium', color: { argb: 'FF7F7F7F' } }
        };
      }
      // Report Title
      const titleRow = worksheet.addRow(['DIE CUSHION CYLINDER CALCULATION REPORT', '', '', '', '', '', '', '']);
      worksheet.mergeCells('A3:H3');
      titleRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
      titleRow.height = 22;
      for (let i = 1; i <= 8; i++) {
        const cell = titleRow.getCell(i);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
        cell.border = {
          bottom: { style: 'medium', color: { argb: 'FF7F7F7F' } },
          left: { style: 'medium', color: { argb: 'FF7F7F7F' } },
          right: { style: 'medium', color: { argb: 'FF7F7F7F' } }
        };
      }
      worksheet.addRow([]); // Spacing
      // Customer Details Header
      const custHeader = worksheet.addRow(['CUSTOMER DETAILS', '', '', '', '', '', '', '']);
      worksheet.mergeCells('A5:H5');
      custHeader.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
      custHeader.height = 20;
      for (let i = 1; i <= 8; i++) {
        const cell = custHeader.getCell(i);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF7F7F7F' } },
          left: { style: 'thin', color: { argb: 'FF7F7F7F' } },
          bottom: { style: 'thin', color: { argb: 'FF7F7F7F' } },
          right: { style: 'thin', color: { argb: 'FF7F7F7F' } }
        };
      }
      // Customer Details Table
      const customerRows = [
        ['Customer Name', results.customerDetails?.customerName || ''],
        ['Machine Name', results.customerDetails?.machineName || ''],
        ['WO No', results.customerDetails?.woNo || ''],
        ['Assembly Name', results.customerDetails?.assemblyName || ''],
      ];
      customerRows.forEach((rowData, idx) => {
        const row = worksheet.addRow([...rowData, '', '', '', '', '', '']);
        row.height = 18;
        row.getCell(1).font = { name: 'Calibri', size: 10 };
        for (let i = 1; i <= 8; i++) {
          const cell = row.getCell(i);
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
          };
          cell.alignment = { 
            vertical: 'middle',
            horizontal: (i === 1 || i === 2) ? 'left' : 'center',
            indent: i === 1 ? 1 : 0
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: idx % 2 === 0 ? 'FFF2F2F2' : 'FFFFFFFF' }
          };
        }
        // Merge B-H for value
        worksheet.mergeCells(`B${row.number}:H${row.number}`);
      });
      worksheet.addRow([]); // Spacing
      // DIE CUSHION PERFORMANCE header
      const performanceHeader = worksheet.addRow(['DIE CUSHION PERFORMANCE', '', '', '', '', '', '', '']);
      worksheet.mergeCells(`A${performanceHeader.number}:H${performanceHeader.number}`);
      performanceHeader.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      performanceHeader.height = 20;
      for (let i = 1; i <= 8; i++) {
        const cell = performanceHeader.getCell(i);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
      // Table headers
      const headers = ['Description', 'Cylinder (mm)', 'Area (cm²)', 'Speed (mm/s)', 'Inlet (lpm)', 'Outlet (lpm)', 'Pressure (bar)', 'Force (tons)'];
      const headerRow2 = worksheet.addRow(headers);
      headerRow2.eachCell((cell: ExcelJS.Cell) => {
        Object.assign(cell, {
          font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } },
          alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
        });
      });
      
      const addDataRow = (data: any, description: string) => {
        const row = worksheet.addRow([
          description,
          formatValue(data.cylinderSize, 'mm'),
          formatValue(data.area, 'cm²'),
          formatValue(data.speed, 'mm/s'),
          formatValue(data.inletFlow, 'lpm'),
          formatValue(data.outletFlow, 'lpm'),
          formatValue(data.pressure, 'bar'),
          formatForce(data.force)
        ]);
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
          Object.assign(cell, {
            font: { size: 10, name: 'Calibri' },
            border: {
              top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
              left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
              bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
              right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            },
            alignment: { 
              vertical: 'middle',
              horizontal: colNumber === 1 ? 'left' : 'center',
              wrapText: true,
            },
          });
          if (row.number % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
          } else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
          }
        });
      };

      addDataRow(results.upSpeed, 'Up Speed');
      addDataRow(results.downSpeed, 'Down Speed');
      worksheet.addRow([]); // Spacing
      // Port Sizes Header
      const portHeader = worksheet.addRow(['PORT SIZES', '', '', '', '', '', '', '']);
      worksheet.mergeCells(`A${portHeader.number}:H${portHeader.number}`);
      portHeader.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      portHeader.height = 20;
      for (let i = 1; i <= 8; i++) {
        const cell = portHeader.getCell(i);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
      const portDetails = [
        { label: 'Die Cushion Cylinder Port Size (A LINE SIZE)', value: results.dieCushionCylinderPortSize || 'N/A' },
        { label: 'Die Cushion Port Size (B LINE SIZE)', value: results.dieCushionPortSize || 'N/A' }
      ];
      portDetails.forEach(({ label, value }) => {
        const row = worksheet.addRow([label, value, '', '', '', '', '', '']);
        row.height = 18;
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
          Object.assign(cell, {
            font: { size: 10, name: 'Calibri' },
            border: {
              top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
              left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
              bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
              right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            },
            alignment: { 
              vertical: 'middle',
              horizontal: colNumber === 1 ? 'left' : 'center',
              wrapText: true,
            },
          });
          if (row.number % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
          } else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
          }
        });
        worksheet.mergeCells(`B${row.number}:H${row.number}`);
      });
      worksheet.addRow([]); // Spacing

      // Footer removed as per request

      // Authorization Section Heading at row 21
      const authorizationHeader = worksheet.addRow(['AUTHORIZATION', '', '', '', '', '', '', '']);
      worksheet.mergeCells(`A21:H21`);
      authorizationHeader.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      authorizationHeader.alignment = { horizontal: 'center', vertical: 'middle' };
      authorizationHeader.height = 20;
      // Ensure blue background for all cells in merged range
      for (let i = 1; i <= 8; i++) {
        const cell = authorizationHeader.getCell(i);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
      }

      // Signature rows
      const preparedRow = worksheet.addRow(['Prepared by:', '', '', '', '', '', '', '']);
      worksheet.mergeCells(`B${preparedRow.number}:H${preparedRow.number}`);
      const checkedRow = worksheet.addRow(['Checked by:', '', '', '', '', '', '', '']);
      worksheet.mergeCells(`B${checkedRow.number}:H${checkedRow.number}`);
      const approvedRow = worksheet.addRow(['Approved by:', '', '', '', '', '', '', '']);
      worksheet.mergeCells(`B${approvedRow.number}:H${approvedRow.number}`);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `die_cushion_calculation_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [results]);

  if (!results) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6">No results to display</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f5f7fa' }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ color: '#1a237e', fontWeight: 'bold', mb: 1 }}
        >
          BARANI HYDRAULICS INDIA PRIVATE LIMITED
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ color: '#303f9f', fontWeight: 'medium', mb: 2 }}
        >
          DIE CUSHION CYLINDERS CALCULATION RESULTS
        </Typography>
        <Divider sx={{ my: 2, borderColor: '#90caf9' }} />

        {results.customerDetails && (
          <Box sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Customer Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <DetailItem 
                  label="Customer Name" 
                  value={results.customerDetails.customerName} 
                  variant="body1" 
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DetailItem 
                  label="Machine Name" 
                  value={results.customerDetails.machineName} 
                  variant="body1" 
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DetailItem 
                  label="WO No" 
                  value={results.customerDetails.woNo} 
                  variant="body1" 
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DetailItem 
                  label="Assembly Name" 
                  value={results.customerDetails.assemblyName} 
                  variant="body1" 
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Performance Data */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <CushionStage title="UP SPEED" data={results.upSpeed} />
          </Grid>
          <Grid item xs={12} md={6}>
            <CushionStage title="DOWN SPEED" data={results.downSpeed} />
          </Grid>
        </Grid>

        {/* Port Sizes */}
        <Box sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            Port Sizes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailItem 
                label="Die Cushion Cylinder Port Size (A LINE SIZE)" 
                value={results.dieCushionCylinderPortSize} 
                variant="body1" 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem 
                label="Die Cushion Port Size (B LINE SIZE)" 
                value={results.dieCushionPortSize} 
                variant="body1" 
              />
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 'bold', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              minWidth: '120px', 
              backgroundColor: '#757575', 
              color: 'white', 
              '&:hover': {
                backgroundColor: '#616161'
              },
              marginRight: 'auto'
            }}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleExportPDF}
            disabled={isGenerating}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 'bold', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              minWidth: '120px', 
              backgroundColor: '#f44336', 
              color: 'white', 
              '&:hover': {
                backgroundColor: '#d32f2f'
              },
              ...(isGenerating ? { backgroundColor: '#e0e0e0', color: '#9e9e9e' } : {})
            }}
            startIcon={isGenerating ? null : <PictureAsPdfIcon />}
          >
            {isGenerating ? (
              <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12, color: 'rgba(0, 0, 0, 0.6)' }} />
            ) : (
              'Export PDF'
            )}
          </Button>
          <Button
            variant="contained"
            onClick={handleExportExcel}
            disabled={isGenerating}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 'bold', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              minWidth: '120px', 
              backgroundColor: '#4caf50', 
              color: 'white', 
              '&:hover': {
                backgroundColor: '#388e3c'
              },
              ...(isGenerating ? { backgroundColor: '#e0e0e0', color: '#9e9e9e' } : {})
            }}
            startIcon={isGenerating ? null : <TableChartIcon />}
          >
            {isGenerating ? (
              <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12, color: 'rgba(0, 0, 0, 0.6)' }} />
            ) : (
              'Export Excel'
            )}
          </Button>
          <Button
            variant="contained"
            onClick={handleExportCSV}
            disabled={isGenerating}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 'bold', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              minWidth: '120px', 
              backgroundColor: '#2196f3', 
              color: 'white', 
              '&:hover': {
                backgroundColor: '#1976d2'
              },
              ...(isGenerating ? { backgroundColor: '#e0e0e0', color: '#9e9e9e' } : {})
            }}
            startIcon={isGenerating ? null : <TableChartIcon />}
          >
            {isGenerating ? (
              <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12, color: 'rgba(0, 0, 0, 0.6)' }} />
            ) : (
              'Export CSV'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

const DieCushionResultsPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<DieCushionResults | null>(null);

  useEffect(() => {
    if (location.state?.results) {
      setResults(location.state.results);
    } else {
      navigate('/die-cushion-calculator');
    }
  }, [location.state, navigate]);

  if (!results) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <DieCushionResults results={results} />;
};

export default DieCushionResultsPage;