import { Link } from '@remix-run/react';


export default function Success() {

	return (
		<div>
			<h1>Success</h1>
			<p>Your message has been sent successfully!</p>
			<Link to="/">to Home</Link>
		</div>
	);
}
