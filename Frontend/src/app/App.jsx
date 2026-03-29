import React, { useState } from "react";
import AppRoutes from "../app/routes";
import SplashScreen from "../features/welcome/components/SplashScreen";

function App(){

  const [loading,setLoading] = useState(true);

  return (
    <>
      {loading
        ? <SplashScreen finishLoading={() => setLoading(false)} />
        : <AppRoutes />}
    </>
  );
}

export default App;