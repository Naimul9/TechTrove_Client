import { Helmet } from "react-helmet";
import Banner from "../../Component/Banner";
import Featured from "../../Component/Featured";
import Category from "../../Component/Category";


const Home = () => {
    return (
        <div className="container mx-auto">
           <Helmet> <title>Home</title></Helmet>
            <Banner/>
            <Featured/>
            <Category/>
        </div>
    );
};

export default Home;