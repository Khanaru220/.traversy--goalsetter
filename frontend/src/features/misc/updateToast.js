import { toast } from 'react-toastify';

export const updateToast = ({ toastId, type, message, ...bodyObj }) => {
	// (!) toast.isActive() not always work as expected
	// -(some cases) notifcation no display but still count as 'active'
	// -cause missing notification
	// (?) (updated) my solutions also miss notification but unlikely

	// (!) (my solution) is duplicated - can affected perfomance
	// -but works stable with lots of notification call in once
	if (type === 'loading') {
		// 0. (loading is special) there're no TYPE.LOADING
		// -trigger by update prop 'isLoading:true'
		// -(will ignore current TYPE, in toast.update)
		toast.loading(message, {
			toastId,
			isLoading: true,
			...bodyObj,
		});
		toast.update(toastId, {
			render: message,
			isLoading: true,
			...bodyObj,
		});
		return;
	}

	toast(message, {
		toastId,
		type: toast.TYPE[type.toUpperCase()],
		// might be: 'autoClose:false' from loading
		// -overwrite: closeOnClick of Toastcontainer
		// -(confirmed) My assume is right
		closeOnClick: true,
		...bodyObj,
	});
	toast.update(toastId, {
		render: message,
		type: toast.TYPE[type.toUpperCase()],
		closeOnClick: true,
		...bodyObj,
	});
};
