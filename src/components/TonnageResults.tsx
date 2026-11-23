import React from 'react';
import { Button, Typography, Paper, Box, Grid, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import GridOnIcon from '@mui/icons-material/GridOn';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

// PDFDocument component as provided by user
const PDFDocument = ({ results }: { results: TonnageResults }) => {
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
            TONNAGE & CYLINDER WALL THICKNESS CALCULATIONS
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
            <Text style={styles.formulaTitle}>1. Area Calculation</Text>
            <Text style={styles.formulaText}>Area (cm²) = (Pi × D²) ÷ 4</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      D = Cylinder Bore Diameter (cm)</Text>
            <Text style={styles.formulaVariable}>      Pi = 3.14159</Text>
            <Text style={styles.formulaVariable}>      D² = D × D (Square of diameter)</Text>
            
            <Text style={styles.formulaTitle}>2. Tonnage Calculation</Text>
            <Text style={styles.formulaText}>Tonnage (T) = (P × A) ÷ 1000</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      P = Working Pressure (kg/cm²)</Text>
            <Text style={styles.formulaVariable}>      A = Cross-sectional Area (cm²)</Text>
            
            <Text style={styles.formulaTitle}>3. Working Stress Calculation</Text>
            <Text style={styles.formulaText}>Working Stress = Y ÷ F</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      Y = Material Yield Strength (kg/cm²)</Text>
            <Text style={styles.formulaVariable}>      F = Factor of Safety</Text>
            
            <Text style={styles.formulaTitle}>4. Wall Thickness Calculation</Text>
            <Text style={styles.formulaText}>Wall Thickness (t) = (D × P) ÷ S</Text>
            <Text style={styles.formulaVariable}>Where:</Text>
            <Text style={styles.formulaVariable}>      D = Cylinder Bore (cm)</Text>
            <Text style={styles.formulaVariable}>      P = Working Pressure (kg/cm²)</Text>
            <Text style={styles.formulaVariable}>      S = Working Stress (kg/cm²)</Text>
          </View>
        </View>

        {/* Input Parameters */}
        <View style={styles.section}>
          <Text style={styles.title}>INPUT PARAMETERS</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Parameter</Text></View>
              <View style={styles.tableCellRight}><Text>Value</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Cylinder Bore (cm)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.cylinderBore}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Pressure (kg/cm²)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.pressure}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Yield Strength (kg/cm²)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.yieldStrength}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Factor of Safety</Text></View>
              <View style={styles.tableCellRight}><Text>{results.inputValues.factorOfSafety}</Text></View>
            </View>
          </View>
        </View>

        {/* Results */}
        <View style={styles.section}>
          <Text style={styles.title}>CALCULATION RESULTS</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Parameter</Text></View>
              <View style={styles.tableCellRight}><Text>Value</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Area (cm²)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.area}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Tonnage (T)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.tons}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Working Stress (kg/cm²)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.workingStress}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellLeft}><Text>Wall Thickness (cm)</Text></View>
              <View style={styles.tableCellRight}><Text>{results.wallThickness}</Text></View>
            </View>
          </View>
        </View>

        {/* Reference Number */}
        <Text style={styles.referenceNumber}>322080/347</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureText}>Prepared By: __________</Text>
            <Text style={styles.signatureText}>Checked By: __________</Text>
            <Text style={styles.signatureText}>Approved By: __________</Text>
          </View>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureText}>Date: __________</Text>
            <Text style={styles.signatureText}>Date: __________</Text>
            <Text style={styles.signatureText}>Date: __________</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};


interface TonnageValues {
  customerName: string;
  machineName: string;
  woNo: string;
  assemblyName: string;
  cylinderBore: string;
  pressure: string;
  yieldStrength: string;
  factorOfSafety: string;
}

interface TonnageResults {
  area: string;
  tons: string;
  workingStress: string;
  wallThickness: string;
  inputValues: TonnageValues;
}

const DetailItem: React.FC<{ label: string; value: string | number; variant?: 'body1' | 'h6' }> = ({ label, value, variant = 'body1' }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
      {label}
    </Typography>
    <Typography variant={variant} sx={{ fontWeight: variant === 'h6' ? 'bold' : 'normal', color: variant === 'h6' ? '#1976d2' : 'inherit' }}>
      {value || '-'}
    </Typography>
  </Box>
);

const exportToExcel = async (results: TonnageResults) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tonnage Calculations');
    worksheet.columns = [
      { header: '', width: 40 },
      { header: '', width: 40 },
    ];

    // --- STYLES ---
    const blue = 'FF003366';
    const white = 'FFFFFFFF';
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' as ExcelJS.BorderStyle },
      left: { style: 'thin' as ExcelJS.BorderStyle },
      bottom: { style: 'thin' as ExcelJS.BorderStyle },
      right: { style: 'thin' as ExcelJS.BorderStyle },
    };
    const sectionTitleFont = { name: 'Arial', bold: true, size: 11, color: { argb: white } };
    const cellFont = { name: 'Arial', size: 10 };
    const cellFontBold = { name: 'Arial', size: 10, bold: true };

    // --- COMPANY TITLE (A1:B1) ---
    worksheet.mergeCells('A1:B1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'BARANI HYDRAULICS INDIA PRIVATE LIMITED';
    titleCell.style = {
      font: { name: 'Arial', bold: true, size: 14, color: { argb: white } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } },
    };
    worksheet.getRow(1).height = 24;

    // --- DATE ROW (A2:B2) ---
    const dateRow = worksheet.addRow(['DATE:', '']);
    dateRow.getCell(1).style = {
      font: cellFontBold,
      alignment: { horizontal: 'left', vertical: 'middle' },
    };
    dateRow.getCell(2).style = {
      font: cellFont,
      alignment: { horizontal: 'left', vertical: 'middle' },
      border: borderStyle,
    };
    worksheet.getRow(2).height = 20;

    // --- TITLE (A3:B3) ---
    worksheet.mergeCells('A3:B3');
    const subtitleCell = worksheet.getCell('A3');
    subtitleCell.value = 'TONNAGE & CYLINDER WALL THICKNESS CALCULATIONS';
    subtitleCell.style = {
      font: { name: 'Arial', bold: true, size: 12, color: { argb: white } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } },
    };
    worksheet.getRow(3).height = 20;

    // --- BLANK ROWS (A4:B5) ---
    const row4 = worksheet.addRow(['', '']);
    const row5 = worksheet.addRow(['', '']);
    [row4, row5].forEach(row => {
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: white } };
      });
    });

    // --- CUSTOMER DETAILS HEADER (A6:B6) ---
    const customerHeaderRow = worksheet.addRow([]);
    customerHeaderRow.height = 20;
    const customerCellA = customerHeaderRow.getCell(1);
    customerCellA.value = 'CUSTOMER DETAILS';
    customerCellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue }, bgColor: { argb: blue } };
    customerCellA.font = sectionTitleFont;
    customerCellA.alignment = { horizontal: 'center', vertical: 'middle' };
    const customerCellB = customerHeaderRow.getCell(2);
    customerCellB.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue }, bgColor: { argb: blue } };
    worksheet.mergeCells(customerHeaderRow.number, 1, customerHeaderRow.number, 2);

    worksheet.addRow([]); // Blank row after header

    // --- CUSTOMER DETAILS DATA ---
    const customerData = [
      ['Customer Name', results.inputValues.customerName || '_'],
      ['Machine Name', results.inputValues.machineName || '_'],
      ['WO. NO', results.inputValues.woNo || '_'],
      ['Assembly Name', results.inputValues.assemblyName || '_'],
    ];
    customerData.forEach(([label, value]) => {
      const row = worksheet.addRow([label, value]);
      row.getCell(1).style = { font: cellFontBold, alignment: { horizontal: 'left', vertical: 'middle' } };
      row.getCell(2).style = { font: cellFont, alignment: { horizontal: 'left', vertical: 'middle' } };
    });
    worksheet.addRow([]); // Blank row

    // --- TONNAGE CALCULATIONS HEADER ---
    const tonnageHeaderRow = worksheet.addRow(['TONNAGE CALCULATIONS', '']);
    tonnageHeaderRow.height = 20;
    const tonnageCellA = tonnageHeaderRow.getCell(1);
    tonnageCellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
    tonnageCellA.font = sectionTitleFont;
    tonnageCellA.alignment = { horizontal: 'center', vertical: 'middle' };
    const tonnageCellB = tonnageHeaderRow.getCell(2);
    tonnageCellB.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
    worksheet.mergeCells(tonnageHeaderRow.number, 1, tonnageHeaderRow.number, 2);
    worksheet.addRow([]);

    // --- TONNAGE DATA ---
    const tonnageData = [
      ['Cylinder Bore (D)', `${results.inputValues.cylinderBore || '0'} cm`],
      ['Area', `${results.area || '0'} cm²`],
      ['Pressure', `${results.inputValues.pressure || '0'} kg/cm²`],
      ['Tonnage', `${results.tons || '0'} T`],
    ];
    tonnageData.forEach(([label, value]) => {
      const row = worksheet.addRow([label, value]);
      row.getCell(1).style = { font: cellFontBold, alignment: { horizontal: 'left', vertical: 'middle' } };
      row.getCell(2).style = { font: cellFont, alignment: { horizontal: 'left', vertical: 'middle' } };
    });
    worksheet.addRow([]);

    // --- CYLINDER WALL THICKNESS HEADER ---
    const wallHeaderRow = worksheet.addRow(['CYLINDER WALL THICKNESS', '']);
    wallHeaderRow.height = 20;
    const wallCellA = wallHeaderRow.getCell(1);
    wallCellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
    wallCellA.font = sectionTitleFont;
    wallCellA.alignment = { horizontal: 'center', vertical: 'middle' };
    const wallCellB = wallHeaderRow.getCell(2);
    wallCellB.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
    worksheet.mergeCells(wallHeaderRow.number, 1, wallHeaderRow.number, 2);
    worksheet.addRow([]);

    // --- WALL THICKNESS DATA ---
    const thicknessData = [
      ['Cylinder Yield Strength', `${results.inputValues.yieldStrength || '0'} kg/cm²`],
      ['Factor of Safety', results.inputValues.factorOfSafety || ''],
      ['Working Stress', `${results.workingStress || '0'} kg/cm²`],
      ['Wall Thickness', `${results.wallThickness || '0'} cm`],
    ];
    thicknessData.forEach(([label, value]) => {
      const row = worksheet.addRow([label, value]);
      row.getCell(1).style = { font: cellFontBold, alignment: { horizontal: 'left', vertical: 'middle' } };
      row.getCell(2).style = { font: cellFont, alignment: { horizontal: 'left', vertical: 'middle' } };
    });
    worksheet.addRow([]);

    // --- FORMULAS HEADER ---
    const formulasHeaderRow = worksheet.addRow(['FORMULAS USED', '']);
    formulasHeaderRow.height = 20;
    const formulaCellA = formulasHeaderRow.getCell(1);
    formulaCellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
    formulaCellA.font = sectionTitleFont;
    formulaCellA.alignment = { horizontal: 'left', vertical: 'middle' };
    const formulaCellB = formulasHeaderRow.getCell(2);
    formulaCellB.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
    worksheet.mergeCells(formulasHeaderRow.number, 1, formulasHeaderRow.number, 2);
    worksheet.addRow([]);

    // --- FORMULAS DATA ---
    const formulas = [
      ['Area (cm²) = (π × D²) ÷ 4'],
      ['Tonnage (T) = (P × A) ÷ 1000'],
      ['Working Stress = Y ÷ F'],
      ['Wall Thickness (t) = (D × P) ÷ S'],
    ];
    formulas.forEach(([formula]) => {
      const row = worksheet.addRow([formula]);
      row.getCell(1).font = { name: 'Arial', italic: true, size: 10 };
      row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
      worksheet.mergeCells(row.number, 1, row.number, 2);
    });
    worksheet.addRow([]);

    // --- AUTHORIZATION HEADER ---
    const authHeaderRow = worksheet.addRow(['AUTHORIZATION', '']);
    authHeaderRow.height = 20;
    const authCellA = authHeaderRow.getCell(1);
    authCellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
    authCellA.font = sectionTitleFont;
    authCellA.alignment = { horizontal: 'center', vertical: 'middle' };
    const authCellB = authHeaderRow.getCell(2);
    authCellB.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
    worksheet.mergeCells(authHeaderRow.number, 1, authHeaderRow.number, 2);

    // --- SIGNATURE LINES ---
    const signatureLines = [
      { label: 'Prepared By:', entry: '' },
      { label: 'Checked By:', entry: '' },
      { label: 'Approved By:', entry: '' },
      { label: 'Date:', entry: '' },
    ];
    signatureLines.forEach((item) => {
      const row = worksheet.addRow([item.label, item.entry]);
      row.getCell(1).font = cellFontBold;
      row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell(1).border = { right: { style: 'thin' as ExcelJS.BorderStyle } };
      row.getCell(2).font = cellFont;
      row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell(2).border = { left: { style: 'thin' as ExcelJS.BorderStyle } };
    });

    // --- BORDERS FOR ALL CELLS ---
    for (let i = 1; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      row.eachCell((cell) => {
        cell.border = borderStyle;
      });
    }

    // --- SAVE ---
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'tonnage_calculations.xlsx');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export to Excel. Please try again.');
  }
};

const exportToCSV = (results: TonnageResults) => {
  try {
    const csvData: string[][] = [];

    // Title
    csvData.push(["BARANI HYDRAULICS INDIA PRIVATE LIMITED"]);
    csvData.push(["TONNAGE & CYLINDER WALL THICKNESS CALCULATIONS"]);
    csvData.push([""]);

    // Customer Details
    csvData.push(["CUSTOMER DETAILS"]);
    csvData.push(["Parameter", "Value"]);
    csvData.push(["Customer Name", results.inputValues.customerName || "-"]);
    csvData.push(["Machine Name", results.inputValues.machineName || "-"]);
    csvData.push(["WO. NO", results.inputValues.woNo || "-"]);
    csvData.push(["Assembly Name", results.inputValues.assemblyName || "-"]);
    csvData.push([""]);

    // Tonnage Calculations
    csvData.push(["TONNAGE CALCULATIONS"]);
    csvData.push(["Parameter", "Value"]);
    csvData.push(["Cylinder Bore (D)", `${results.inputValues.cylinderBore || "-"} cm`]);
    csvData.push(["Area", `${results.area || "-"} cm2`]);
    csvData.push(["Pressure", `${results.inputValues.pressure || "-"} kg/cm2`]);
    csvData.push(["Tonnage", `${results.tons || "-"} T`]);
    csvData.push([""]);

    // Cylinder Wall Thickness
    csvData.push(["CYLINDER WALL THICKNESS"]);
    csvData.push(["Parameter", "Value"]);
    csvData.push(["Cylinder Yield Strength", `${results.inputValues.yieldStrength || "-"} kg/cm2`]);
    csvData.push(["Factor of Safety", results.inputValues.factorOfSafety || "-"]);
    csvData.push(["Working Stress", `${results.workingStress || "-"} kg/cm2`]);
    csvData.push(["Wall Thickness", `${results.wallThickness || "-"} cm`]);
    csvData.push([""]);

    // Formulas Used
    csvData.push(["FORMULAS USED"]);
    csvData.push(["Area (cm2) = (Pi x D^2) / 4"]);
    csvData.push(["Tonnage (T) = (P x A) / 1000"]);
    csvData.push(["Working Stress = Y / F"]);
    csvData.push(["Wall Thickness (t) = (D x P) / S"]);
    csvData.push([""]);

    // Authorization
    csvData.push(["AUTHORIZATION"]);
    csvData.push(["Prepared By:", ""]);
    csvData.push(["Checked By:", ""]);
    csvData.push(["Approved By:", ""]);
    csvData.push(["Date:", ""]);

    const csv = csvData.map(row => row.map(item => `"${item ?? ''}"`).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "tonnage_calculations.csv");
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    alert("Failed to export to CSV. Please try again.");
  }
};

import { useNavigate } from 'react-router-dom';

interface TonnageResultsProps {
  results: TonnageResults;
  setShowResults?: (show: boolean) => void;
}

const TonnageResults: React.FC<TonnageResultsProps> = ({ results, setShowResults }) => {
  const navigate = useNavigate();
  if (!results) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          No Results Available
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 3 }}>
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f5f7fa' }}>
        <Typography variant="h5" align="center" sx={{ color: '#1a237e', fontWeight: 'bold', mb: 1 }}>
          BARANI HYDRAULICS INDIA PRIVATE LIMITED
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: '#303f9f', fontWeight: 'medium', mb: 2 }}>
          TONNAGE & CYLINDER WALL THICKNESS CALCULATIONS
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
          {/* Tonnage Calculations */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%', backgroundColor: 'white' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                TONNAGE CALCULATIONS
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Cylinder Bore (D)</Typography>
              <Typography>{results.inputValues.cylinderBore} cm</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Area</Typography>
              <Typography>{results.area} cm²</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Pressure</Typography>
              <Typography>{results.inputValues.pressure} kg/cm²</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Tonnage</Typography>
              <Typography>{results.tons} T</Typography>
            </Paper>
          </Grid>
          {/* Cylinder Wall Thickness Calculations */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%', backgroundColor: 'white' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                CYLINDER WALL THICKNESS
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Cylinder Yield Strength</Typography>
              <Typography>{results.inputValues.yieldStrength} kg/cm²</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Factor of Safety</Typography>
              <Typography>{results.inputValues.factorOfSafety}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Working Stress</Typography>
              <Typography>{results.workingStress} kg/cm²</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>Wall Thickness</Typography>
              <Typography>{results.wallThickness} cm</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Export Section */}
        <Box sx={{ mt: 4 }}>
          <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f5f7fa' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, textAlign: 'center' }}>
              EXPORT OPTIONS
            </Typography>
            <Grid container alignItems="center" justifyContent="space-between">
              {/* Back Button Left */}
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    borderColor: '#1976d2', color: '#1976d2',
                    minWidth: '140px', height: '34px', fontSize: '13px', textTransform: 'none',
                    '&:hover': { borderColor: '#115293', backgroundColor: '#e3eafc' }
                  }}
                  onClick={() => {
  if (typeof setShowResults === 'function') {
    setShowResults(false);
  } else {
    navigate('/tonnage');
  }
}}
                >
                  Back to Calculator
                </Button>
              </Grid>
              {/* Export Buttons Right */}
              <Grid item>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-end', '& > *': { flex: '1 1 120px', maxWidth: '140px' } }}>
                  <PDFDownloadLink document={<PDFDocument results={results} />} fileName="Tonnage_Calculation.pdf">
                    {({ loading }) => (
                      <Button
                        variant="contained"
                        startIcon={<PictureAsPdfIcon />}
                        disabled={loading}
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
                  </PDFDownloadLink>
                  <Button
                    variant="contained"
                    startIcon={<TableChartIcon />}
                    onClick={() => exportToExcel(results)}
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
                  <Button
                    variant="contained"
                    startIcon={<GridOnIcon />}
                    onClick={() => exportToCSV(results)}
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
        </Box>
      </Paper>
    </Box>
  );
};

export default TonnageResults;