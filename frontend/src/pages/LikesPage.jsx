import { FaHeart } from "react-icons/fa";
import PropTypes from 'prop-types';

/**
 * Displays a table of users who liked the profile
 * @param {Object} props - Component props
 * @param {Array} props.likes - Array of like objects
 */
const LikesPage = ({ likes = [] }) => {

	return (
		<div className='relative overflow-x-auto shadow-md rounded-lg px-4'>
			<table className='w-full text-sm text-left rtl:text-right bg-glass overflow-hidden'>
				<thead className='text-xs uppercase bg-glass'>
					<tr>
						<th scope='col' className='p-4'>
							<div className='flex items-center'>No</div>
						</th>
						<th scope='col' className='px-6 py-3'>
							Username
						</th>
						<th scope='col' className='px-6 py-3'>
							Date
						</th>
						<th scope='col' className='px-6 py-3'>
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{likes.map((like, index) => (
						<tr key={like.id} className='bg-glass border-b'>
							<td className='w-4 p-4'>
								<div className='flex items-center'>
									<span>{index + 1}</span>
								</div>
							</td>
							<th scope='row' className='flex items-center px-6 py-4 whitespace-nowrap '>
								<img
									className='w-10 h-10 rounded-full'
									src={like.avatar}
									alt={`Profile picture of ${like.username}`}
								/>
								<div className='ps-3'>
									<div className='text-base font-semibold'>{like.username}</div>
								</div>
							</th>
							<td className='px-6 py-4'>{new Date(like.date).toLocaleDateString()}</td>
							<td className='px-6 py-4'>
								<div className='flex items-center'>
									<FaHeart size={22} className='text-red-500 mx-2' />
									Liked your profile
								</div>
							</td>
						</tr>
					))}

				</tbody>
			</table>
		</div>
	);
};

LikesPage.propTypes = {
  likes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    })
  ),
};

export default LikesPage;
