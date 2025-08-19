import React from "react";
import ContactData from "@/data/contact.json";

const ScrollingContainer = () => {
	const { scrollingText } = ContactData.scrollingContainer;
	return (
		<div className="w-full bg-black py-4 overflow-hidden relative">
			<div className="scrolling-container">
				<div className="scrolling-text">
					{/* Duplicate the scrolling text for continuous scrolling effect */}
					{Array.from({ length: 2 }).flatMap((_, i) =>
						scrollingText.map((text, index) => (
							<span
								key={`${index}-${i}`}
								className={`${
									index % 2 === 0
										? "text-white"
										: "text-orange-500"
								} scroll-item text-xl font-medium`}
							>
								{text}
							</span>
						))
					)}
					{/* {scrollingText.map((text, index) => (
            <span
              key={index}
              className={`${
                index % 2 == 0 ? "text-white" : "text-orange-500"
              } scroll-item text-xl font-medium`}
            >
              {text}
            </span>
          ))} */}
				</div>
			</div>
		</div>
	);
};

export default ScrollingContainer;
