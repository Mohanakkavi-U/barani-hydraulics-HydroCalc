import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  Grid, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  PictureAsPdf as PictureAsPdfIcon,
  TableChart as TableChartIcon
} from '@mui/icons-material';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Helper function to safely get value with unit
const getValueWithUnit = (value: any, unit: string = ''): string => {
  if (value === null || value === undefined) return 'N/A';
  return `${value} ${unit}`.trim();
};

import { MainCylinderResults, MainCylinderResult } from '../interfaces/MainCylinderTypes';
import * as ExcelJS from 'exceljs';

// Helper function to safely merge cells in Excel
const safeMergeCells = (worksheet: ExcelJS.Worksheet, cells: string): void => {
  try {
    if (worksheet) {
      worksheet.mergeCells(cells);
    }
  } catch (error) {
    console.warn(`Failed to merge cells ${cells}:`, error);
  }
};

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

// Moved to top level to avoid duplication
const safeToFixed = (value: number | string | undefined | null): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'string' && value.trim() === '') return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 'N/A' : num.toFixed(2);
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value, unit = '', variant = 'body1' }) => {
  // Handle different value types
  const getDisplayValue = () => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      // If it's an object with a 'value' property, use that
      if ('value' in value && value.value !== undefined) {
        return String(value.value);
      }
      // Otherwise, try to stringify the object
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

interface CylinderStageProps {
  title: string;
  data: MainCylinderResult | null;
}

const CylinderStage: React.FC<CylinderStageProps> = ({ title, data }) => {
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
              {title === 'Fast Approach' ? 'N/A' : (data.force ? `${data.force}` : 'N/A')} <span style={{ fontSize: '0.8em', color: '#666' }}>tons</span>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface MainCylinderResultsComponentProps {
  results: MainCylinderResults;
}

const MainCylinderResultsComponent: React.FC<MainCylinderResultsComponentProps> = ({ results }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/'); // Fallback to home if no history
    }
  }, [navigate]);

  const handleExportCSV = useCallback(async () => {
    if (!results) return;
    
    try {
      setIsGenerating(true);

      // Format number with 2 decimal places
      const formatNumber = (num: any) => {
        if (num === null || num === undefined) return 'N/A';
        const n = Number(num);
        return isNaN(n) ? num : n.toFixed(2);
      };

      // Create CSV sections
      const header = [
        'BARANI HYDRAULICS INDIA PRIVATE LIMITED',
        'MAIN CYLINDER CALCULATION REPORT',
        ''
      ];

      const customerDetails = [
        'CUSTOMER DETAILS',
        '----------------',
        ...(results.customerDetails?.customerName ? [`Customer Name,${results.customerDetails.customerName}`] : []),
        ...(results.customerDetails?.machineName ? [`Machine Name,${results.customerDetails.machineName}`] : []),
        ...(results.customerDetails?.woNo ? [`WO No,${results.customerDetails.woNo}`] : []),
        ...(results.customerDetails?.assemblyName ? [`Assembly Name,${results.customerDetails.assemblyName}`] : []),
        ''
      ];

      const columns = [
        'Description',
        'Cylinder Size (mm)',
        'Area (cm²)',
        'Speed (mm/s)',
        'Inlet Flow (LPM)',
        'Outlet Flow (LPM)',
        'Pressure (Bar)',
        'Force (Ton)'
      ];

      const formatRow = (label: string, data: any) => [
        label,
        formatNumber(data?.cylinderSize),
        formatNumber(data?.area),
        formatNumber(data?.speed),
        formatNumber(data?.inletFlow),
        formatNumber(data?.outletFlow),
        formatNumber(data?.pressure),
        formatNumber(data?.force)
      ];

      const calculationResults = [
        'CALCULATION RESULTS',
        '-------------------',
        columns.join(','),
        formatRow('Fast Approach', results.fastApproach).join(','),
        formatRow('Pressing', results.pressing).join(','),
        formatRow('Reverse', results.reverse).join(','),
        ''
      ];

      const additionalInfo = [
        'COMPONENT SIZING',
        '-----------------',
        `Prefill Valve Size,${results.prefillValveSize || 'N/A'}`,
        `Cylinder Port Size,${results.cylinderPortSize || 'N/A'}`,
        `Pipe/Block Size,${results.pipeBlockSize || 'N/A'}`,
        ''
      ];

      const authorization = [
        'AUTHORIZATION',
        'Prepared By:',
        'Checked By:',
        'Approved By:'
      ];

      // Combine all sections
      const csvContent = [
        ...header,
        ...customerDetails,
        ...calculationResults,
        ...additionalInfo,
        ...authorization
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const filename = `MainCylinder_${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, filename);
      
    } catch (error) {
      console.error('Error generating CSV:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [results]);

  const handleExportExcel = useCallback(async () => {
    if (!results) return; // Guard clause if results is null
    
    try {
      setIsGenerating(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Main Cylinder Calculation');
      
      // Removed extra empty row at the top as per user request
      // worksheet.addRow([]);
      
      // Define styles
      const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } }, // Dark blue
        border: {
          top: { style: 'thin', color: { argb: 'FF7F7F7F' } },
          left: { style: 'thin', color: { argb: 'FF7F7F7F' } },
          bottom: { style: 'thin', color: { argb: 'FF7F7F7F' } },
          right: { style: 'thin', color: { argb: 'FF7F7F7F' } }
        },
        alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }
      };

      const dataStyle = {
        font: { size: 10, name: 'Calibri' },
        border: {
          top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
        },
        alignment: { vertical: 'middle', horizontal: 'left', indent: 1 }
      };

      // Set column widths and default styles
      worksheet.columns = [
        { width: 28 },  // Column A: Description/Wider first column
        { width: 18 },  // Column B: Cylinder (mm)
        { width: 15 },  // Column C: Area (cm²)
        { width: 15 },  // Column D: Speed (mm/s)
        { width: 15 },  // Column E: Inlet (lpm)
        { width: 15 },  // Column F: Outlet (lpm)
        { width: 15 },  // Column G: Pressure
        { width: 15 }   // Column H: Force
      ];
      
      // Hide columns beyond H
      for (let i = 9; i <= 100; i++) {
        try {
          worksheet.getColumn(i).hidden = true;
        } catch (e) {
          break;
        }
      }

      // Add company name in the center as the first row
      const companyRow = worksheet.addRow(['BARANI HYDRAULICS INDIA PRIVATE LIMITED']);
      companyRow.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
      companyRow.alignment = { horizontal: 'center', vertical: 'middle' };
      companyRow.height = 25;
      worksheet.mergeCells('A1:H1');
      // Style merged title row
      for (let i = 1; i <= 8; i++) {
        const cell = companyRow.getCell(i);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } }; // Dark blue
        cell.border = {
          top: { style: 'medium', color: { argb: 'FF7F7F7F' } },
          left: { style: 'medium', color: { argb: 'FF7F7F7F' } },
          right: { style: 'medium', color: { argb: 'FF7F7F7F' } }
        };
      }
      
      const titleRow2 = worksheet.addRow(['MAIN CYLINDER CALCULATION REPORT']);
      titleRow2.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
      titleRow2.alignment = { horizontal: 'center', vertical: 'middle' };
      titleRow2.height = 22;
      worksheet.mergeCells('A2:H2');
      // Style subtitle row
      for (let i = 1; i <= 8; i++) {
        const cell = titleRow2.getCell(i);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } }; // Dark blue
        cell.border = {
          bottom: { style: 'medium', color: { argb: 'FF7F7F7F' } },
          left: { style: 'medium', color: { argb: 'FF7F7F7F' } },
          right: { style: 'medium', color: { argb: 'FF7F7F7F' } }
        };
      }
      
      // Add customer details section (starting from row 4)
      worksheet.addRow([]); // Empty row (row 4)
      
      // Add empty row with some height
      const emptyRow = worksheet.addRow([]);
      emptyRow.height = 10;
      
      // Add Customer Details header
      const customerHeader = worksheet.addRow(['CUSTOMER DETAILS']);
      customerHeader.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' };
      customerHeader.height = 20;
      
      // Style header row
      for (let i = 1; i <= 8; i++) {
        const cell = customerHeader.getCell(i);
        Object.assign(cell, headerStyle);
      }
      safeMergeCells(worksheet, 'A6:H6');
      
      // Add column headers for customer details
      const columnHeaders = ['Field', 'Value'];
      const headerRow = worksheet.addRow(columnHeaders);
      headerRow.height = 20;
      
      // Style column headers
      headerRow.eachCell((cell: ExcelJS.Cell) => {
        cell.font = { bold: true, size: 10, name: 'Calibri', color: { argb: 'FF000000' } }; // Black text for better contrast
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } }; // Light gray background
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF7F7F7F' } },
          left: { style: 'thin', color: { argb: 'FF7F7F7F' } },
          bottom: { style: 'thin', color: { argb: 'FF7F7F7F' } },
          right: { style: 'thin', color: { argb: 'FF7F7F7F' } }
        };
        cell.alignment = { 
          vertical: 'middle',
          horizontal: 'left',
          indent: 2,
          wrapText: true
        };
      });
      
      // Add customer details in a tabular format
      const customerDetails = results?.customerDetails || {};
      const details = [
        { label: 'Customer Name', value: customerDetails.customerName },
        { label: 'Machine Name', value: customerDetails.machineName },
        { label: 'WO No', value: customerDetails.woNo },
        { label: 'Assembly Name', value: customerDetails.assemblyName }
      ];
      
      details.forEach(({ label, value }) => {
        const row = worksheet.addRow([label, value || '']);
        
        // Style the row
        row.height = 18;
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
          // Apply base data style
          Object.assign(cell, dataStyle);
          
          // Alternate row colors for better readability
          if (row.number % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
          } else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
          }
        });
        
        // Merge cells B through H for the value
        if (value) {
          safeMergeCells(worksheet, `B${row.number}:H${row.number}`);
        }
      });
      
      // Set column widths
      worksheet.getColumn(1).width = 20; // Field column
      worksheet.getColumn(2).width = 30; // Value column
      
      // Add cylinder performance section
      const emptyRow2 = worksheet.addRow([]);
      emptyRow2.height = 10;
      
      const performanceHeader = worksheet.addRow(['CYLINDER PERFORMANCE']);
      performanceHeader.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' };
      performanceHeader.height = 20;
      
      // Style performance header
      for (let i = 1; i <= 8; i++) {
        const cell = performanceHeader.getCell(i);
        Object.assign(cell, headerStyle);
      }
      
      // Merge and style performance header across columns A-H
      const performanceHeaderRow = worksheet.getRow(8);
      safeMergeCells(worksheet, 'A8:H8');
      
      // Clear any existing styling first
      for (let i = 1; i <= 100; i++) {
        try {
          const cell = performanceHeaderRow.getCell(i);
          cell.fill = { type: 'pattern', pattern: 'none' };
          // Set empty border instead of undefined to satisfy TypeScript
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
          };
        } catch (e) {
          break;
        }
      }
      
      // Style the merged header cell
      const performanceHeaderCell = performanceHeaderRow.getCell(1);
      // Remove background color and bold font from cell A8 and align left
      if (performanceHeaderCell.address === 'A8') {
        performanceHeaderCell.fill = {
          type: 'pattern',
          pattern: 'none'
        };
        performanceHeaderCell.font = { 
          bold: false, 
          color: { argb: 'FF000000' } // Black text
        };
        performanceHeaderCell.alignment = { horizontal: 'left' };
      } else {
        // Keep original styling for other cells in the header
        performanceHeaderCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF003366' }
        };
        performanceHeaderCell.font = { 
          bold: true, 
          color: { argb: 'FFFFFFFF' } 
        };
        performanceHeaderCell.alignment = { horizontal: 'center' };
      }
      
      // Add table headers - now exactly 8 columns to fit A-H
      const headers = ['Parameters', 'Cylinder (mm)', 'Area (cm²)', 'Speed (mm/s)', 'Inlet (lpm)', 'Outlet (lpm)', 'Pressure', 'Force (tons)'];
      const performanceTableHeaderRow = worksheet.addRow(headers);
      
      // First, clear any existing styling from all cells in the row
      for (let i = 1; i <= 100; i++) {
        try {
          const cell = performanceTableHeaderRow.getCell(i);
          cell.fill = { type: 'pattern', pattern: 'none' };
          // Set empty border instead of undefined to satisfy TypeScript
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
          };
        } catch (e) {
          break;
        }
      }
      
      // Style header cells (only columns A-H)
      for (let i = 1; i <= 8; i++) {
        const cell = performanceTableHeaderRow.getCell(i);
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
      
      // Add data rows - ensure we're only adding 8 columns of data
      const addCylinderRow = (stage: MainCylinderResult, description: string) => {
        const force = description === 'Fast Approach' ? 'N/A' : 
          (stage.force ? `${stage.force}` : 'N/A');
        const pressure = description === 'Fast Approach' ? 'Gravity' : 
          (stage.pressure ? `${stage.pressure} bar` : 'N/A');
          
        // Create the row data
        const rowData = [description, stage.cylinderSize, stage.area, stage.speed, stage.inletFlow, stage.outletFlow, pressure, force];
        const row = worksheet.addRow(rowData);
        
        // Add borders to the data row
        for (let i = 1; i <= 9; i++) {
          const cell = row.getCell(i);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
        // Align numeric cells to center
        for (let i = 2; i <= 8; i++) {
          row.getCell(i).alignment = { horizontal: 'center' };
        }
      };
      
      // Add cylinder rows
      addCylinderRow(results.fastApproach, 'Fast Approach');
      addCylinderRow(results.pressing, 'Pressing');
      addCylinderRow(results.reverse, 'Reverse');
      
      // ===== COMPONENT SIZING SECTION =====
      // Add empty row before section (row 16)
      worksheet.addRow([]);
      
      // Create and style the component header
      const createComponentHeader = () => {
        // 1. Create a row with the header text (row 17)
        const row = worksheet.addRow(['']);
        const rowNumber = row.number; // Get the actual row number

        // 2. Set the value and style for the first cell
        const headerCell = row.getCell(1);
        headerCell.value = 'COMPONENT SIZING';
        headerCell.fill = { 
          type: 'pattern', 
          pattern: 'solid',
          fgColor: { argb: 'FF003366' } // Dark blue background
        };
        headerCell.font = { 
          bold: true, 
          color: { argb: 'FFFFFFFF' } // White text
        };
        headerCell.alignment = { 
          horizontal: 'left',
          vertical: 'middle',
          indent: 2 // Add a small left padding
        };
        
        // 3. Clear background for all cells in the row beyond column I (9)
        for (let i = 10; i <= 100; i++) {
          try {
            const cell = row.getCell(i);
            if (cell.fill && cell.fill.type === 'pattern') {
              cell.fill = { type: 'pattern', pattern: 'none' };
            }
          } catch (e) {
            break; // Stop if we reach the end of the row
          }
        }

        // 4. Merge cells dynamically using row number
        safeMergeCells(worksheet, `A${rowNumber}:I${rowNumber}`);

        // 5. Apply borders to all cells in the merged range
        for (let i = 1; i <= 9; i++) {
          row.getCell(i).border = {
            top: { style: 'thin' as const },
            left: { style: 'thin' as const },
            bottom: { style: 'thin' as const },
            right: { style: 'thin' as const }
          };
        }
        
        // 6. Set row height to make the background visible
        row.height = 20;


        return row;
      };
      

      
      // Create the component header
      createComponentHeader();
      
      // Add component sizing headers - only 2 columns (row 18)
      const componentHeaders = ['Component', 'Size (mm)'];
      const componentHeaderRow = worksheet.addRow(componentHeaders);
      
      // Style the header row with light gray background
      componentHeaderRow.eachCell((cell: ExcelJS.Cell) => {
        cell.font = { bold: true };
        cell.border = {
          top: { style: 'thin' as const },
          left: { style: 'thin' as const },
          bottom: { style: 'thin' as const },
          right: { style: 'thin' as const }
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' } // Light gray background
        };
        cell.alignment = { horizontal: 'center' };
      });
      
      // Add component sizing data - only 2 columns
      const addComponentRow = (component: string, size: any) => {
        try {
          const row = worksheet.addRow([component, size]);
          
          // Add borders to each cell in the row up to column I
          for (let i = 1; i <= 9; i++) {
            const cell = row.getCell(i);
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          }
          // Only merge if we have a value and the cells aren't already part of a merge
          if (size && row && row.number) {
            const cell = worksheet.getCell(`B${row.number}`);
            if (cell && !cell.isMerged) {
              try {
                safeMergeCells(worksheet, `B${row.number}:I${row.number}`);
              } catch (mergeError) {
                console.warn('Failed to merge cells:', mergeError);
              }
            }
          }
        } catch (error) {
          console.warn('Error adding component row:', error);
        }
      };
      
      addComponentRow('Prefill Valve', results.prefillValveSize);
      addComponentRow('Cylinder Port', results.cylinderPortSize);
      addComponentRow('Pipe/Block', results.pipeBlockSize);
      
      // Add footer with signatures - each on its own row with space for signature
      worksheet.addRow([]); // Empty row
      
      // Add Authorization header
      const authHeaderRow = worksheet.addRow(['AUTHORIZATION']);
      if (authHeaderRow && authHeaderRow.number) {
        // Style the header cell
        const authCell = authHeaderRow.getCell(1);
        authCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        authCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF003366' } // Dark blue
        };
        authCell.alignment = { horizontal: 'left' };
        
        // Merge cells for the header
        safeMergeCells(worksheet, `A${authHeaderRow.number}:C${authHeaderRow.number}`);
      }
      
      // Add space after header
      worksheet.addRow([]);
      
      // Add Prepared By row
      const preparedByRow = worksheet.addRow(['Prepared by:']);
      if (preparedByRow && preparedByRow.number) {
        // Merge cells for signature line
        safeMergeCells(worksheet, `A${preparedByRow.number}:C${preparedByRow.number}`);
        
        // Add border for signature line
        for (let i = 1; i <= 3; i++) {
          const cell = preparedByRow.getCell(i);
          cell.border = { bottom: { style: 'thin' } };
        }
      }
      
      // Add Checked By row
      const checkedByRow = worksheet.addRow(['Checked by:']);
      if (checkedByRow && checkedByRow.number) {
        // Merge cells for signature line
        safeMergeCells(worksheet, `A${checkedByRow.number}:C${checkedByRow.number}`);
        
        // Add border for signature line
        for (let i = 1; i <= 3; i++) {
          const cell = checkedByRow.getCell(i);
          cell.border = { bottom: { style: 'thin' } };
        }
      }
      
      // Add Approved By row
      const approvedByRow = worksheet.addRow(['Approved by:']);
      if (approvedByRow && approvedByRow.number) {
        // Merge cells for signature line
        safeMergeCells(`A${approvedByRow.number}:C${approvedByRow.number}`);
        
        // Add border for signature line
        for (let i = 1; i <= 3; i++) {
          const cell = approvedByRow.getCell(i);
          cell.border = { bottom: { style: 'thin' } };
        }
      }
      
      // Add some space after the signature lines
      worksheet.addRow([]);
      worksheet.addRow([]);
      
      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `MainCylinder_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [results]);

  const handleDownloadPDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf((<MainCylinderPDF results={results} />)).toBlob();
      saveAs(blob, `MainCylinder_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [results]);

  if (!results) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        No results available. Please calculate first.
      </div>
    );
  }

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
          MAIN CYLINDER CALCULATOR
        </Typography>
        <Divider sx={{ my: 2, borderColor: '#90caf9' }} />
      </Paper>

      {/* Customer Details */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ color: '#003366', fontWeight: 'bold', mb: 3 }}>
          Customer Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DetailItem 
              label="Customer Name" 
              value={results.customerDetails?.customerName} 
              variant="body1"
            />
            <DetailItem 
              label="Machine Name" 
              value={results.customerDetails?.machineName} 
              variant="body1"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailItem 
              label="W.O. No" 
              value={results.customerDetails?.woNo} 
              variant="body1"
            />
            <DetailItem 
              label="Assembly Name" 
              value={results.customerDetails?.assemblyName} 
              variant="body1"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Cylinder Stages */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ color: '#003366', fontWeight: 'bold', mb: 3 }}>
          Cylinder Performance
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <CylinderStage title="Fast Approach" data={results.fastApproach} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CylinderStage title="Pressing" data={results.pressing} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CylinderStage title="Reverse" data={results.reverse} />
          </Grid>
        </Grid>
      </Paper>

      {/* Component Sizing */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ color: '#003366', fontWeight: 'bold', mb: 3 }}>
          Component Sizing
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                Prefill Valve
              </Typography>
              <DetailItem 
                label="Recommended Size" 
                value={results.prefillValveSize} 
                unit="mm"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                Cylinder Port
              </Typography>
              <DetailItem 
                label="Recommended Size" 
                value={results.cylinderPortSize} 
                unit="mm"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                Pipe/Block
              </Typography>
              <DetailItem 
                label="Recommended Size" 
                value={results.pipeBlockSize} 
                unit="mm"
              />
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Table */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ color: '#003366', fontWeight: 'bold', mb: 3 }}>
          Summary
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Parameter</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Fast Approach</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Pressing</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Reverse</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">Speed (mm/s)</TableCell>
                <TableCell align="right">{results.fastApproach?.speed || 'N/A'}</TableCell>
                <TableCell align="right">{results.pressing?.speed || 'N/A'}</TableCell>
                <TableCell align="right">{results.reverse?.speed || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Flow (lpm)</TableCell>
                <TableCell align="right">{safeToFixed(results.fastApproach?.inletFlow)}</TableCell>
                <TableCell align="right">{safeToFixed(results.pressing?.inletFlow)}</TableCell>
                <TableCell align="right">{safeToFixed(results.reverse?.inletFlow)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Pressure (bar)</TableCell>
                <TableCell align="right">{results.fastApproach?.pressure || 'N/A'}</TableCell>
                <TableCell align="right">{results.pressing?.pressure || 'N/A'}</TableCell>
                <TableCell align="right">{results.reverse?.pressure || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Force</TableCell>
                <TableCell align="right">N/A</TableCell>
                <TableCell align="right">
                  {results.pressing?.force ? `${results.pressing.force} Tons` : 'N/A'} 
                </TableCell>
                <TableCell align="right">
                  {results.reverse?.force ? `${results.reverse.force} Tons` : 'N/A'} 
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, flexWrap: 'wrap', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Calculator
        </Button>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<TableChartIcon />}
            onClick={handleExportCSV}
            disabled={isGenerating}
            sx={{ 
              backgroundColor: '#2196f3', 
              '&:hover': { 
                backgroundColor: '#1976d2' 
              },
              textTransform: 'none',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}
          >
            {isGenerating ? 'Generating...' : 'EXPORT AS CSV'}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<TableChartIcon />}
            onClick={handleExportExcel}
            disabled={isGenerating}
            sx={{ 
              backgroundColor: '#4caf50', 
              '&:hover': { 
                backgroundColor: '#388e3c' 
              },
              textTransform: 'none',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}
          >
            {isGenerating ? 'Generating...' : 'EXPORT AS EXCEL'}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdfIcon />}
            disabled={isGenerating}
            onClick={handleDownloadPDF}
            sx={{ 
              textTransform: 'none',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}
          >
            {isGenerating ? 'Generating...' : 'DOWNLOAD PDF'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const MainCylinderResultsPage: React.FC = () => {
  const location = useLocation();
  const [results, setResults] = useState<MainCylinderResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const state = location.state as { results: MainCylinderResults };
      if (!state?.results) {
        throw new Error('No results data available');
      }
      setResults(state.results);
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Failed to load results. Please try again.');
    }
  }, [location.state]);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4, color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.history.back()}
          sx={{ mt: 2 }}
        >
          Back to Calculator
        </Button>
      </Box>
    );
  }

  if (!results) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading results...</Typography>
      </Box>
    );
  }

  return <MainCylinderResultsComponent results={results} />;
};

// PDF Document Component
const MainCylinderPDF: React.FC<{ results: MainCylinderResults }> = ({ results }) => {
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
    componentBox: {
      borderWidth: 0.75,
      borderColor: '#000',
      borderStyle: 'solid',
      padding: 5,
      margin: 5,
      flex: 1,
    },
    componentTitle: {
      fontWeight: 'bold',
      marginBottom: 3,
      textAlign: 'center',
      fontSize: 9,
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

  const formatForce = (force: string) => {
    if (!force) return 'N/A';
    const match = force.match(/(\d+\.?\d*)/);
    return match ? `${match[0]} Tons` : 'N/A';
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
              <Text>MAIN CYLINDER CALCULATION REPORT</Text>
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

          {/* Cylinder Performance */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>CYLINDER PERFORMANCE</Text>
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellHeader, { width: '20%' }]}>Description</Text>
                <Text style={[styles.tableCellHeader, { width: '12%' }]}>Cylinder (mm)</Text>
                <Text style={[styles.tableCellHeader, { width: '12%' }]}>Area (cm²)</Text>
                <Text style={[styles.tableCellHeader, { width: '12%' }]}>Speed (mm/s)</Text>
                <Text style={[styles.tableCellHeader, { width: '12%' }]}>Inlet (lpm)</Text>
                <Text style={[styles.tableCellHeader, { width: '12%' }]}>Outlet (lpm)</Text>
                <Text style={[styles.tableCellHeader, { width: '10%' }]}>Pressure</Text>
                <Text style={[styles.tableCellHeader, { width: '10%' }]}>Force</Text>
              </View>
              
              {/* Fast Approach Row */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '20%' }]}>Fast Approach</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.fastApproach.cylinderSize)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.fastApproach.area)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.fastApproach.speed)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.fastApproach.inletFlow)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.fastApproach.outletFlow)}</Text>
                <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>Gravity</Text>
                <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>N/A</Text>
              </View>
              
              {/* Pressing Row */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '20%' }]}>Pressing</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.pressing.cylinderSize)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.pressing.area)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.pressing.speed)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.pressing.inletFlow)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.pressing.outletFlow)}</Text>
                <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>{formatValue(results.pressing.pressure, 'bar')}</Text>
                <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>{formatForce(results.pressing.force)}</Text>
              </View>
              
              {/* Reverse Row */}
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.tableCell, { width: '20%' }]}>Reverse</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.reverse.cylinderSize)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.reverse.area)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.reverse.speed)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.reverse.inletFlow)}</Text>
                <Text style={[styles.tableCell, { width: '12%', textAlign: 'center' }]}>{formatValue(results.reverse.outletFlow)}</Text>
                <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>{formatValue(results.reverse.pressure, 'bar')}</Text>
                <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>{formatForce(results.reverse.force)}</Text>
              </View>
            </View>
          </View>

          {/* Component Sizing */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>COMPONENT SIZING</Text>
            <View style={[styles.tableContainer, { marginBottom: 10 }]}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellHeader, { width: '50%' }]}>Component</Text>
                <Text style={[styles.tableCellHeader, { width: '50%', textAlign: 'center' }]}>Size (mm)</Text>
              </View>
              
              {/* Rows */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '50%' }]}>Prefill Valve</Text>
                <Text style={[styles.tableCell, { width: '50%', textAlign: 'center' }]}>{formatValue(results.prefillValveSize)}</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '50%' }]}>Cylinder Port</Text>
                <Text style={[styles.tableCell, { width: '50%', textAlign: 'center' }]}>{formatValue(results.cylinderPortSize)}</Text>
              </View>
              
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.tableCell, { width: '50%' }]}>Pipe/Block</Text>
                <Text style={[styles.tableCell, { width: '50%', textAlign: 'center' }]}>{formatValue(results.pipeBlockSize)}</Text>
              </View>
            </View>
          </View>

          {/* Footer with Signatures */}
          <View style={styles.footer}>
            <Text style={styles.signatureLabel}>Prepared by:</Text>
            <Text style={styles.signatureLabel}>Checked by:</Text>
            <Text style={styles.signatureLabel}>Approved by:</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MainCylinderResultsPage;