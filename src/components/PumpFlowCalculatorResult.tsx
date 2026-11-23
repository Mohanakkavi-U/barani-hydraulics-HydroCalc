import React from 'react';
import { Typography, Button, Paper, Box, Grid, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import GridOnIcon from '@mui/icons-material/GridOn';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { Document, Page, Text, View, StyleSheet, Image, BlobProvider } from '@react-pdf/renderer';

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
  inputValues: {
    diameter: string;
    flowRate: string;
    head: string;
    efficiency: string;
    specificGravity: string;
    customerName: string;
    machineName: string;
    woNo: string;
    assemblyName: string;
  };
}

// PDFDocument updated to match TieRodCalculator's PDF style
const PDFDocument = ({ results }: { results: PumpCalculatorResults }) => {
  const styles = StyleSheet.create({
    page: {
      padding: '10 15',
      fontSize: 10,
      fontFamily: 'Helvetica',
    },
    header: {
      backgroundColor: '#003366',
      padding: 6,
      marginBottom: 6,
      flexDirection: 'row',
      alignItems: 'center',
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
      fontSize: 10,
      fontWeight: 'bold',
      flex: 1,
    },
    section: {
      marginBottom: 8,
    },
    title: {
      fontSize: 10,
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
      flex: 2.5,
      padding: '3 4',
      borderRightWidth: 1,
      borderRightColor: '#000',
      borderRightStyle: 'solid',
      justifyContent: 'center',
    },
    tableCellRight: {
      flex: 1.5,
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
            PUMP FLOW & MOTOR HP CALCULATIONS
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
            <View style={styles.tableCellLeft}><Text>Work Order No</Text></View>
            <View style={styles.tableCellRight}><Text>{results.inputValues.woNo || ''}</Text></View>
          </View>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <View style={styles.tableCellLeft}><Text>Assembly Name</Text></View>
            <View style={styles.tableCellRight}><Text>{results.inputValues.assemblyName || ''}</Text></View>
          </View>
        </View>

        {/* Pump Flow Calculations */}
        <View style={styles.section}>
          <Text style={styles.title}>PUMP FLOW CALCULATIONS</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Pipe Diameter</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.diameter || '0'} mm</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Flow Rate</Text></View>
              <View style={styles.tableCellRight}><Text>{results.pumpFlow?.flowRate || '0'} LPM</Text></View>
            </View>
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <View style={styles.tableCellLeft}><Text>Velocity</Text></View>
              <View style={styles.tableCellRight}><Text>{results.pumpFlow?.velocity || '0'} m/s</Text></View>
            </View>
          </View>
        </View>

        {/* Motor HP Calculations */}
        <View style={styles.section}>
          <Text style={styles.title}>MOTOR HP CALCULATIONS</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Head</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.head || '0'} m</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Efficiency</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.efficiency || '0'} %</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Specific Gravity</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.specificGravity || '1.0'}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Brake Horsepower</Text></View>
              <View style={styles.tableCellRight}><Text>{results.motorHP?.brakeHorsepower || '0'} HP</Text></View>
            </View>
            <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
              <View style={[styles.tableCellLeft, { fontWeight: 'bold' }]}><Text>Recommended HP</Text></View>
              <View style={[styles.tableCellRight, { fontWeight: 'bold' }]}><Text>{results.motorHP?.recommendedHP || '0'} HP</Text></View>
            </View>
          </View>
        </View>

        {/* Formulas Section */}
        <View style={styles.section}>
          <Text style={styles.title}>FORMULAS USED</Text>
          <View style={styles.formula}>
            <Text style={styles.formulaTitle}>1. Flow Rate Calculation</Text>
            <Text style={styles.formulaText}>Flow Rate (LPM) = Velocity (m/s) * Area (mm^2) * 60 / 1,000,000</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      Area = pi * (Diameter/2)^2</Text>
            <Text style={styles.formulaVariable}>      pi = 3.14159</Text>

            <Text style={styles.formulaTitle}>2. Motor HP Calculation</Text>
            <Text style={styles.formulaText}>Motor HP = (Flow Rate * Head * Specific Gravity) / (1714 * (Efficiency/100))</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      Flow Rate in LPM</Text>
            <Text style={styles.formulaVariable}>      Head in meters</Text>
            <Text style={styles.formulaVariable}>      Efficiency as a percentage</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureText}>Prepared By: ______________</Text>
            <Text style={styles.signatureText}>Checked By: ______________</Text>
            <Text style={styles.signatureText}>Approved By: ______________</Text>
          </View>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureText}>Date: ______________</Text>
            <Text style={styles.signatureText}>Date: ______________</Text>
            <Text style={styles.signatureText}>Date: ______________</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

import { useLocation } from 'react-router-dom';

const PumpCalculatorResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Try to get results from navigation state
  const results = (location.state && (location.state as any).results) as PumpCalculatorResults | null;

  // Redirect to calculator if results are missing
  React.useEffect(() => {
    if (!results) {
      navigate('/calculator');
    }
  }, [results, navigate]);
  if (!results) {
    return null;
  }
  // Combined exportToExcel function using exceljs (generates both Excel and CSV)
  const exportToExcel = () => {
    if (!results || !results.inputValues) {
      throw new Error('No results data available for export');
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Pump Calculations');

      worksheet.columns = [
        { header: '', width: 40 },
        { header: '', width: 40 },
      ];

      // Add company title in row 1
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'BARANI HYDRAULICS INDIA PRIVATE LIMITED';
      titleCell.style = {
        font: { bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '003366' } }
      };
      worksheet.mergeCells('A1:B1');
      worksheet.getRow(1).height = 24;

      // Add date row in row 2 - leaving date empty for manual entry
      const dateRow = worksheet.addRow(['DATE:', '']);
      dateRow.getCell(1).style = {
        font: { name: 'Arial', size: 10, bold: true },
        alignment: { horizontal: 'left', vertical: 'middle' }
      };
      dateRow.getCell(2).style = {
        font: { name: 'Arial', size: 10 },
        alignment: { horizontal: 'left', vertical: 'middle' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
      };
      worksheet.getRow(2).height = 20;

      // Add calculator title in row 3
      const subtitleCell = worksheet.getCell('A3');
      subtitleCell.value = 'PUMP FLOW & MOTOR HP CALCULATIONS';
      subtitleCell.style = {
        font: { bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '003366' } }
      };
      worksheet.mergeCells('A3:B3');
      worksheet.getRow(3).height = 20;

      // Add two blank rows before customer details (rows 4 and 5)
      const row4 = worksheet.addRow(['', '']); // Row 4 with explicit empty cells
      const row5 = worksheet.addRow(['', '']); // Row 5 with explicit empty cells
      
      // Set white background for rows 4 and 5
      [row4, row5].forEach(row => {
        row.eachCell(cell => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' } // White background
          };
        });
      });
      
      // Customer Details Header - Row 6 (A6 and B6 with blue background)
      const customerHeaderRow = worksheet.addRow([]);
      customerHeaderRow.height = 20;
      
      // Set value and style for the first cell (A5)
      const customerCellA = customerHeaderRow.getCell(1);
      customerCellA.value = 'CUSTOMER DETAILS';
      customerCellA.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' },
        bgColor: { argb: 'FF003366' }
      };
      customerCellA.font = {
        name: 'Arial',
        bold: true,
        size: 11,
        color: { argb: 'FFFFFFFF' }
      };
      customerCellA.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      
      // Style the second cell (B5)
      const customerCellB = customerHeaderRow.getCell(2);
      customerCellB.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' },
        bgColor: { argb: 'FF003366' }
      };
      
      // Merge cells A6:B6 after styling
      worksheet.mergeCells('A6:B6');
      
      // Add empty row after customer details header
      worksheet.addRow([]);

      const customerData = [
        ['Customer Name', results.inputValues.customerName || '_'],
        ['Machine Name', results.inputValues.machineName || '_'],
        ['WO. NO', results.inputValues.woNo || '_'],
        ['Assembly Name', results.inputValues.assemblyName || '_'],
      ];

      customerData.forEach(([label, value]) => {
        const row = worksheet.addRow([label, value]);
        // Make column A labels bold
        row.getCell(1).style = {
          font: { name: 'Arial', bold: true, size: 10 },
        };
        // Keep column B values normal weight
        row.getCell(2).style = {
          font: { name: 'Arial', size: 10 },
        };
      });

      worksheet.addRow([]); // Empty row for spacing

      // PUMP FLOW CALCULATIONS - Row 12
      // Add a blank row first
      worksheet.addRow([]);
      
      // Create the header row with two cells
      const pumpHeaderRow = worksheet.addRow(['PUMP FLOW CALCULATIONS', '']);
      pumpHeaderRow.height = 20;
      
      // Style the first cell (A column)
      const cellA = pumpHeaderRow.getCell(1);
      cellA.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' }
      };
      cellA.font = {
        name: 'Arial',
        bold: true,
        size: 11,
        color: { argb: 'FFFFFFFF' }
      };
      cellA.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      
      // Style the second cell (B column)
      const cellB = pumpHeaderRow.getCell(2);
      cellB.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' }
      };
      
      // Merge the cells
      worksheet.mergeCells(pumpHeaderRow.number, 1, pumpHeaderRow.number, 2);
      worksheet.addRow([]);

      const pumpData = [
        ['Diameter (mm)', results.inputValues.diameter || '0'],
        ['Flow Rate (LPM)', results.pumpFlow?.flowRate || '0'],
        ['Velocity (m/s)', results.pumpFlow?.velocity || '0'],
      ];

      pumpData.forEach(([label, value]) => {
        const row = worksheet.addRow([label, value]);
        // Make column A labels bold and left-aligned
        row.getCell(1).style = {
          font: { name: 'Arial', bold: true, size: 10 },
          alignment: { horizontal: 'left', vertical: 'middle' }
        };
        // Keep column B values normal weight and left-aligned
        row.getCell(2).style = {
          font: { name: 'Arial', size: 10 },
          alignment: { horizontal: 'left', vertical: 'middle' }
        };
      });

      worksheet.addRow([]); // Empty row for spacing

      // MOTOR HP CALCULATIONS - Row 18
      const motorHeaderRow = worksheet.addRow(['MOTOR HP CALCULATIONS', '']);
      motorHeaderRow.height = 20;
      
      // Style the first cell (A column)
      const motorCellA = motorHeaderRow.getCell(1);
      motorCellA.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' }
      };
      motorCellA.font = {
        name: 'Arial',
        bold: true,
        size: 11,
        color: { argb: 'FFFFFFFF' }
      };
      motorCellA.alignment = {
        horizontal: 'left',
        vertical: 'middle',
        indent: 1
      };
      
      // Style the second cell (B column)
      const motorCellB = motorHeaderRow.getCell(2);
      motorCellB.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' }
      };
      
      // Merge the cells
      worksheet.mergeCells(motorHeaderRow.number, 1, motorHeaderRow.number, 2);
      worksheet.addRow([]);

      const motorData = [
        ['Head (m)', results.inputValues.head || '0'],
        ['Efficiency (%)', results.inputValues.efficiency || '0'],
        ['Specific Gravity', results.inputValues.specificGravity || '1.0'],
        ['Brake Horsepower (HP)', results.motorHP?.brakeHorsepower || '0'],
        ['Recommended HP', results.motorHP?.recommendedHP || '0'],
      ];

      motorData.forEach(([label, value]) => {
        const row = worksheet.addRow([label, value]);
        // Make column A labels bold and left-aligned
        row.getCell(1).style = {
          font: { name: 'Arial', bold: true, size: 10 },
          alignment: { horizontal: 'left', vertical: 'middle' }
        };
        // Keep column B values normal weight and left-aligned
        row.getCell(2).style = {
          font: { name: 'Arial', size: 10 },
          alignment: { horizontal: 'left', vertical: 'middle' }
        };
      });

      worksheet.addRow([]); // Empty row for spacing

      // FORMULAS USED - Row 26
      const formulasHeaderRow = worksheet.addRow(['FORMULAS USED', '']);
      formulasHeaderRow.height = 20;
      
      // Style the first cell (A column)
      const formulaCellA = formulasHeaderRow.getCell(1);
      formulaCellA.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' }
      };
      formulaCellA.font = {
        name: 'Arial',
        bold: true,
        size: 11,
        color: { argb: 'FFFFFFFF' }
      };
      formulaCellA.alignment = {
        horizontal: 'left', // Changed to left-aligned
        vertical: 'middle'
      };
      
      // Style the second cell (B column)
      const formulaCellB = formulasHeaderRow.getCell(2);
      formulaCellB.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' }
      };
      
      // Merge the cells
      worksheet.mergeCells(formulasHeaderRow.number, 1, formulasHeaderRow.number, 2);
      worksheet.addRow([]);

      const formulas = [
        ['Flow Rate (LPM) = Velocity (m/s) * Area (mm^2) * 60 / 1000000'],
        ['Motor HP = (Flow Rate * Head * Specific Gravity) / (1714 * Efficiency)'],
      ];

      formulas.forEach(formula => {
        const row = worksheet.addRow(formula);
        // Make all formula text bold and left-aligned
        row.getCell(1).style = {
          font: { name: 'Arial', bold: true, size: 10 },
          alignment: { horizontal: 'left', vertical: 'middle' }
        };
        // Also style the second cell in case it's needed
        row.getCell(2).style = {
          font: { name: 'Arial', bold: true, size: 10 },
          alignment: { horizontal: 'left', vertical: 'middle' }
        };
        // Merge cells for each formula row to ensure it spans both columns
        worksheet.mergeCells(row.number, 1, row.number, 2);
      });

      worksheet.addRow([]); // Empty row for spacing
      worksheet.addRow([]); // Additional empty row to move everything down

      // AUTHORIZATION header
      const authHeaderRow = worksheet.addRow(['AUTHORIZATION', '']);
      authHeaderRow.height = 20;
      
      // Style the first cell (A column)
      const authCellA = authHeaderRow.getCell(1);
      authCellA.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' }
      };
      authCellA.font = {
        name: 'Arial',
        bold: true,
        size: 11,
        color: { argb: 'FFFFFFFF' }
      };
      authCellA.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      
      // Style the second cell (B column)
      const authCellB = authHeaderRow.getCell(2);
      authCellB.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF003366' }
      };
      
      // Merge the cells
      worksheet.mergeCells(authHeaderRow.number, 1, authHeaderRow.number, 2);

      const signatureLines = [
        { label: 'Prepared By:', entry: '' },
        { label: 'Checked By:', entry: '' },
        { label: 'Approved By:', entry: '' },
        { label: 'Date:', entry: '' },
      ];

      signatureLines.forEach((item) => {
        const row = worksheet.addRow([item.label, item.entry]);
        
        // Style the label cell (A column)
        const labelCell = row.getCell(1);
        labelCell.style = {
          font: { name: 'Arial', bold: true, size: 10 },
          alignment: { horizontal: 'left', vertical: 'middle' },
          border: { right: { style: 'thin' } }
        };
        
        // Style the entry cell (B column)
        const entryCell = row.getCell(2);
        entryCell.style = {
          font: { name: 'Arial', size: 10 },
          alignment: { horizontal: 'left', vertical: 'middle' },
          border: { left: { style: 'thin' } }
        };
      });

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

      worksheet.getRow(5).getCell(1).style = {
        font: { name: 'Arial', bold: true, size: 11 },
        alignment: { horizontal: 'center', vertical: 'middle' }
      };

      worksheet.getRow(12).getCell(1).style = {
        font: { name: 'Arial', bold: true, size: 11 },
        alignment: { horizontal: 'center', vertical: 'middle' },
      };

      worksheet.getRow(18).getCell(1).style = {
        font: { name: 'Arial', bold: true, size: 11 },
        alignment: { horizontal: 'left', vertical: 'middle' },
      };

      worksheet.getRow(26).getCell(1).style = {
        font: { name: 'Arial', bold: true, size: 11 },
        alignment: { horizontal: 'left', vertical: 'middle' },
      };

      workbook.xlsx.writeBuffer().then((buffer) => {
        const excelBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelBlob, 'pump_calculations.xlsx');

        // CSV generation moved to exportToCSV
      });
    } catch (error) {
      console.error('Error generating Excel file:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

  // Updated exportToCSV to match Excel format
  const exportToCSV = () => {
    try {
      const csvData = [
        ['BARANI HYDRAULICS INDIA PRIVATE LIMITED', ''], // Mimics A1:B1 merge
        [''],                                           // Empty row
        ['PUMP FLOW & MOTOR HP CALCULATIONS', ''],      // Mimics A3:B3 merge
        [''],                                           // Empty row
        ['Customer Details', ''],                      // Mimics A5:B5 merge
        ['Customer Name', results.inputValues.customerName || '_'],
        ['Machine Name', results.inputValues.machineName || '_'],
        ['WO. NO', results.inputValues.woNo || '_'],
        ['Assembly Name', results.inputValues.assemblyName || '_'],
        [''],                                           // Empty row
        ['PUMP FLOW CALCULATIONS', ''],                // Mimics A11:B11 merge
        ['Diameter (mm)', results.inputValues.diameter],
        ['Flow Rate (LPM)', results.pumpFlow?.flowRate || 'N/A'],
        ['Velocity (m/s)', results.pumpFlow?.velocity || 'N/A'],
        [''],                                           // Empty row
        ['MOTOR HP CALCULATIONS', ''],                 // Mimics A17:B17 merge
        ['Head (m)', results.inputValues.head],
        ['Efficiency (%)', results.inputValues.efficiency],
        ['Specific Gravity', results.inputValues.specificGravity],
        ['Brake Horsepower', results.motorHP?.brakeHorsepower || 'N/A'],
        ['Recommended HP', results.motorHP?.recommendedHP || 'N/A'],
        [''],                                           // Empty row
        ['FORMULAS USED', ''],                         // Mimics A25:B25 merge
        ['Flow Rate (LPM) = Velocity (m/s) * Area (mm^2) * 60 / 1000000', ''],
        ['Motor HP = (Flow Rate * Head * Specific Gravity) / (1714 * Efficiency)', ''],
        [''],                                           // Empty row
        ['Prepared By: ______________', ''],
        ['Checked By: ______________', ''],
        ['Approved By: ______________', ''],
        ['Date: ______________', ''],
      ];

      const csvString = csvData.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? 
            "${cell}" : 
            cell
        ).join(',')
      ).join('\n');

      const csvBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, 'pump_calculations.csv');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export to CSV. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 3 }}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f5f7fa' }}>
        <Typography variant="h5" align="center" sx={{ color: '#1a237e', fontWeight: 'bold', mb: 1 }}>
          BARANI HYDRAULICS INDIA PRIVATE LIMITED
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: '#303f9f', fontWeight: 'medium', mb: 2 }}>
          PUMP FLOW & MOTOR HP CALCULATIONS
        </Typography>
        <Divider sx={{ my: 2, borderColor: '#90caf9' }} />

        {/* Customer Details Card */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'white' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
            CUSTOMER DETAILS
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Customer Name</Typography>
              <Typography>{results.inputValues.customerName || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Machine Name</Typography>
              <Typography>{results.inputValues.machineName || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>WO. NO</Typography>
              <Typography>{results.inputValues.woNo || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Assembly Name</Typography>
              <Typography>{results.inputValues.assemblyName || '-'}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Calculations Cards */}
        <Grid container spacing={3}>
          {/* Pump Flow Calculations */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%', backgroundColor: 'white' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                PUMP FLOW CALCULATIONS
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Diameter</Typography>
              <Typography>{results.inputValues.diameter} mm</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Flow Rate</Typography>
              <Typography>{results.pumpFlow?.flowRate} LPM</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Velocity</Typography>
              <Typography>{results.pumpFlow?.velocity} ft/s</Typography>
            </Paper>
          </Grid>

          {/* Motor HP Calculations */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%', backgroundColor: 'white' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                MOTOR HP CALCULATIONS
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Brake Horsepower</Typography>
              <Typography>{results.motorHP?.brakeHorsepower} HP</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Recommended HP</Typography>
              <Typography>{results.motorHP?.recommendedHP} HP</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Efficiency</Typography>
              <Typography>{results.motorHP?.efficiency}%</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Export Options */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f5f7fa' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, textAlign: 'center' }}>
              EXPORT OPTIONS
            </Typography>
            <Grid container alignItems="center" justifyContent="space-between">
              {/* Back Button Left */}
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    borderColor: '#1976d2', color: '#1976d2',
                    minWidth: '140px', height: '34px', fontSize: '13px', textTransform: 'none',
                    '&:hover': { borderColor: '#115293', backgroundColor: '#e3eafc' }
                  }}
                  onClick={() => navigate('/calculator') }
                >
                  Back to Calculator
                </Button>
              </Grid>
              {/* Export Buttons Right */}
              <Grid item>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-end', '& > *': { flex: '1 1 120px', maxWidth: '140px' } }}>
                  {/* PDF Export Button */}
                  <BlobProvider document={<PDFDocument results={results} />}>
                    {({ loading, url }: { loading: boolean, url: string | null }) => (
                      <Button
                        variant="contained"
                        startIcon={<PictureAsPdfIcon />}
                        disabled={loading}
                        href={url || '#'}
                        download="pump_flow_calculations.pdf"
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
                        Download PDF
                      </Button>
                    )}
                  </BlobProvider>
                  {/* Excel Export Button */}
                  <Button
                    variant="contained"
                    startIcon={<TableChartIcon />}
                    onClick={exportToExcel}
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
                    Download Excel
                  </Button>
                  {/* CSV Export Button */}
                  <Button
                    variant="contained"
                    startIcon={<GridOnIcon />}
                    onClick={exportToCSV}
                    sx={{
                      backgroundColor: '#f9a825',
                      color: 'white',
                      width: '120px',
                      height: '34px',
                      textTransform: 'none',
                      fontSize: '13px',
                      '&:hover': { backgroundColor: '#c17900' }
                    }}
                  >
                    Download CSV
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

export default PumpCalculatorResults;