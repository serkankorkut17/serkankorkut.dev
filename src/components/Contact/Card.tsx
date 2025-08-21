import Link from 'next/link';

interface CardProps {
  Icon: React.ElementType;
  title: string;
  link: string;
  text: string;
}

const Card = ({ Icon, title, link, text }: CardProps) => {
  return (
    <div className="w-[90%] sm:w-[75%] xl:w-[31%] bg-gray-100 py-4 rounded-lg shadow-md flex flex-row mb-8">
      <Icon className="w-1/4 text-orange-500 text-6xl mb-4" />
      <div className="w-3/4 flex flex-col">
        <h3 className="text-xl font-bold">{title}</h3>
        <Link href={link} className="text-xs xs:text-sm md:text-base font-medium text-gray-600 hover:text-orange-500 transition-colors duration-300 mt-2">
          {text}
        </Link>
      </div>
    </div>
  );
};

export default Card;
