import ProfileInfo from "../component/ProfileInfo.jsx";
import Repos from "../component/Repos.jsx";
import Search from "../component/Search.jsx";
import SortRepos from "../component/SortRepos.jsx";
import Spinner from "../component/Spinner.jsx";


const HomePage = () => {
    return (
        <div className='m-4'>
            <Search />
            <SortRepos />
            <div className='flex gap-4 flex-col lg:flex-row justify-center items-start overflow-hidden'>
                <ProfileInfo />
                <Repos />
                <Spinner />

            </div>
        </div>
    );
};

export default HomePage;
