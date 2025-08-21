import React from "react";

interface ScrollingContainerProps {
  scrollingText: string[];
}

const ScrollingContainer = ({ scrollingText }: ScrollingContainerProps) => {

	const REPEAT_COUNT = 2;

	const textItems = scrollingText.map((text, index) => (
		<span
			key={index}
			className={`${
				index % 2 === 0 ? "text-white" : "text-orange-500"
			} scroll-item text-xl font-medium`}
		>
			{text}
		</span>
	));
	
	return (
		<div className="w-full bg-black py-4 overflow-hidden relative">
			<div className="scrolling-container">
				<div className="scrolling-text">
					{/* Duplicate the scrolling text for continuous scrolling effect */}
					{Array.from({ length: REPEAT_COUNT }).flatMap((_, i) =>
						textItems.map((item, index) => (
							<span key={`${i}-${index}`} className="inline-block">
								{item}
							</span>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default ScrollingContainer;
