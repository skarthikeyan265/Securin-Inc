 import React, { useState } from "react";
import { Container } from "@mui/material";
import RecipeTable from "./RecipeTable";
import DrawerDetails from "./DrawerDetails";
import "./index.css";

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <Container maxWidth="lg" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <RecipeTable onSelect={(r) => setSelected(r)} />
      <DrawerDetails
        open={!!selected}
        onClose={() => setSelected(null)}
        recipe={selected}
      />
    </Container>
    
  );
}
