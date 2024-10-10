import withCustomRouter from "../Components/withCustomRouter";

const UserLoginProvider = (props) => {    
    return <>{props.children}</>
}

export default withCustomRouter(UserLoginProvider);