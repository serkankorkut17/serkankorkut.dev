import { PiMapPinArea } from "react-icons/pi";
import { PiPhoneCall } from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";
import Card from "@/components/Contact/Card";


interface ContactSectionProps {
	title: string;
	subtitle: string;
	location: {
		title: string;
		link: string;
		address: string;
	};
	phone: {
		title: string;
		link: string;
		number: string;
	};
	email: {
		title: string;
		link: string;
		address: string;
	};
}

export default function ContactSection({title, subtitle, location, phone, email} : ContactSectionProps) {

	return (
		<section className={`flex flex-col py-8 px-8 md:px-40 bg-white text-black`}>
			<div className="text-start pb-12">
				<p className="text-orange-500 text-lg font-extrabold">
					{title}
				</p>
				<h2 className="text-6xl font-extrabold mt-2">{subtitle}</h2>
			</div>

			<div className="flex flex-col xl:flex-row justify-between items-center">
				<Card
					Icon={PiMapPinArea}
					title={location.title}
          // Use the link for the map location
					link={location.link}
					text={location.address}
				/>

				<Card
					Icon={PiPhoneCall}
					title={phone.title}
					link={phone.link}
					text={phone.number}
				/>

				<Card
					Icon={TfiEmail}
					title={email.title}
					link={email.link}
					text={email.address}
				/>
			</div>
		</section>
	);
}
