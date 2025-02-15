import ProfileInfo from "../component/ProfileInfo";
import Search from "../component/Search";
import SortRepos from "../component/SortRepos";

const HomePage = () => {
    return (
        <div className='m-4'>
            <Search />
            <SortRepos />
            <div className='flex gap-4 flex-col lg:flex-row justify-center items-start'>
                <ProfileInfo />
                {/* <Repos /> */}
            </div>
        </div>
    );
};

export default HomePage;