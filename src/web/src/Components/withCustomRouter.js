import { useNavigate } from "react-router-dom";

const withCustomRouter = (Component) => {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  };
  
  export default withCustomRouter;