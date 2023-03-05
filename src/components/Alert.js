import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function Alert({
	position = 'top-center',
	theme = 'colored',
	hideProgressBar = true,
}) {
	return (
		<ToastContainer
			hideProgressBar={hideProgressBar}
			theme={theme}
			position={position}
		/>
	);
}
