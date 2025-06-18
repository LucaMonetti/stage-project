import { Outlet } from "react-router";
import TopBar from "../components/TopBar/TopBar";

const BaseLayout = () => {
    return (
		<div className='bg-gray-900 min-h-screen text-white'>
			<TopBar />
			<div className='max-w-8xl mx-auto px-8 py-4'>
				<Outlet />
			</div>
		</div>
    );
};

export default BaseLayout;