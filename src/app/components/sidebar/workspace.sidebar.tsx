"use client";

import { MouseEventHandler, ReactNode, useState } from "react";
import { FaPlus } from "react-icons/fa6";

interface workspacecontainer {
	children?: ReactNode;
	title: string;
	handleAddAction: () => void;
}

const WorkspaceContainer = ({ title, children, handleAddAction }: workspacecontainer) => {
	const [isOpen, setIsOpen] = useState<boolean>(true);

	return (
		<div className="flex flex-col gap-0.5 pt-4">
			<button
				className="group hover:bg-[--color-dark-accent-2] rounded-md transition-colors duration-200 text-left h-8 flex justify-between items-center px-2"
				onClick={() => setIsOpen(!isOpen)}
			>
				<h1 className="text-xs opacity-75 ml-1">{title}</h1>
				{/* Fix: Replace button with a div */}
				<div
					className="opacity-0 group-hover:opacity-100 hover:text-[--color-light] transition-opacity text-[--color-dark-accent-3] cursor-pointer"
					role="button"
					onClick={(e) => {
						e.stopPropagation(); // Prevent click from triggering parent button
						handleAddAction();
					}}
				>
					<FaPlus size={14} />
				</div>
			</button>
			{isOpen && children}
			{!children && <p className="text-[--color-light]">No {title}</p>}
		</div>
	);
};

export default WorkspaceContainer;
