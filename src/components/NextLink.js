import Link from 'next/link';
import cn from 'classnames';

export default function NextLink({ href = '', children, className }) {
	return (
		<Link
			href={href}
			className={cn('hover:underline', className)}
		>
			{children}
		</Link>
	);
}
