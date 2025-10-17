import Alert from "@mui/material/Alert";
import { useContext } from "react";
import { MyContext } from "../../App";

const FlashComponent = ({ severity }) => {
  const { flashMessage } = useContext(MyContext);
  return (
    <div className="flex-container d-flex justify-content-center mt-3 mb-3">
      {flashMessage && (
        <Alert
          severity={severity}
          style={{ width: "1050px", fontSize: "medium" }}
        >
          {flashMessage}
        </Alert>
      )}
    </div>
  );
};

export default FlashComponent;
