import { AppBar, Toolbar, Typography, Container, Grid, TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card } from "@mui/material";

const CylinderCalculations = () => {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 2 }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: "#003366", mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BARANI HYDRAULICS INDIA PRIVATE LIMITED
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: "bold" }}>
          TONNAGE & CYLINDER WALL THICKNESS CALCULATIONS
        </Typography>

        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Customer & Machine Details */}
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField size="small" label="Customer Name" fullWidth /></Grid>
                <Grid item xs={6}><TextField size="small" label="Machine Name" fullWidth /></Grid>
                <Grid item xs={6}><TextField size="small" label="WO. NO" fullWidth /></Grid>
                <Grid item xs={6}><TextField size="small" label="Assembly Name" fullWidth /></Grid>
              </Grid>
            </Card>

            {/* Formulas Section */}
            <Card variant="outlined" sx={{ p: 2, mb: 2, bgcolor: "#f5f5f5" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>Formulas:</Typography>
              <Typography variant="body2" sx={{ mb: 1, p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
                Area (cm²) = (π × D²) ÷ 4
              </Typography>
              <Typography variant="body2" sx={{ p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
                Tonnage (Tons) = (P × A) ÷ 1000
              </Typography>
            </Card>

            {/* Cylinder Bore & Tonnage Calculation */}
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell><b>Parameter</b></TableCell>
                      <TableCell><b>Value</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow><TableCell>Bore Diameter (cm)</TableCell><TableCell>45</TableCell></TableRow>
                    <TableRow><TableCell>Area (cm²)</TableCell><TableCell>1589.025</TableCell></TableRow>
                    <TableRow><TableCell>Pressure (kg/cm²)</TableCell><TableCell>190</TableCell></TableRow>
                    <TableRow><TableCell>Tonnage (Tons)</TableCell><TableCell>302.029</TableCell></TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* Wall Thickness Formulas */}
            <Card variant="outlined" sx={{ p: 2, mb: 2, bgcolor: "#f5f5f5" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>Wall Thickness Formulas:</Typography>
              <Typography variant="body2" sx={{ mb: 1, p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
                Working Stress = σy ÷ FOS
              </Typography>
              <Typography variant="body2" sx={{ p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
                Wall Thickness (T) = (D × P) ÷ (2 × σ)
              </Typography>
            </Card>

            {/* Wall Thickness Calculation */}
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>CYLINDER WALL THICKNESS</Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow><TableCell>Yield Strength (kg/cm²)</TableCell><TableCell>3600</TableCell></TableRow>
                    <TableRow><TableCell>Factor of Safety</TableCell><TableCell>6</TableCell></TableRow>
                    <TableRow><TableCell>Working Stress (kg/cm²)</TableCell><TableCell>600</TableCell></TableRow>
                    <TableRow><TableCell>Wall Thickness (T) cm</TableCell><TableCell>7.125</TableCell></TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Footer */}
            <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    Prepared By: __________ Checked By: __________ Approved By: __________
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    Date: __________ Date: __________ Date: __________
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CylinderCalculations;
