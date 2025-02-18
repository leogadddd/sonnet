import React from 'react'
import { IconType } from 'react-icons';
import { HiDotsHorizontal } from "react-icons/hi";
import Link from 'next/link';

interface tabworkspace {
	title: string
	Icon: IconType
	link: string
}

const TabWorkspace = ({ title, Icon, link }: tabworkspace) => {

	

	return (
		<Link className="group flex items-center justify-between pl-3 pr-2 opacity-75 hover:bg-[--color-dark-accent-2] rounded-md transition-colors duration-200 text-left h-8" href={link}>
			<div className="flex items-center gap-2 overflow-hidden">
				<div>
					<Icon size={20} />
				</div> <h3 className="text-sm truncate">{title}</h3>
			</div>
			<div className="opacity-0 group-hover:opacity-100 hover:text-[--color-light] transition-opacity text-[--color-dark-accent-3]">
				<HiDotsHorizontal size={18} />
			</div>
		</Link>
	)
}

export default TabWorkspace