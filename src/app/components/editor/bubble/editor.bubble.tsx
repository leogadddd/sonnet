import { useState } from "react";
import { Editor } from "@tiptap/react";
import { bubbleTools } from "@/components/editor/bubble/bubble.tools";

const colors = [
	{ name: "Default", color: "inherit" },
	{ name: "Purple", color: "purple" },
	{ name: "Red", color: "red" },
	{ name: "Yellow", color: "yellow" },
	{ name: "Blue", color: "blue" },
	{ name: "Green", color: "green" },
	{ name: "Orange", color: "orange" },
	{ name: "Pink", color: "pink" },
	{ name: "Gray", color: "gray" },
];

const EditorBubble = ({ editor }: { editor: Editor }) => {
	const [showColorPicker, setShowColorPicker] = useState(false);

	return (
		<div className="flex z-50 rounded-xl border border-gray-600 bg-gray-900 shadow-md transition-all drop-shadow-lg p-2">
			{bubbleTools.map((item) => {
				if (item.type === "color-picker") {
					return (
						<div key={item.name} className="relative">
							<button
								className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-700"
								onClick={() => setShowColorPicker(!showColorPicker)}
							>
								<item.icon className="w-4 h-4" />
							</button>
							{showColorPicker && (
								<div className="absolute left-0 mt-2 w-32 bg-gray-800 shadow-lg rounded-md">
									{colors.map((color) => (
										<button
											key={color.name}
											className="flex items-center w-full px-3 py-2 hover:bg-gray-700"
											style={{ color: color.color }}
											onClick={() => {
												editor.chain().focus().setColor(color.color).run();
												setShowColorPicker(false);
											}}
										>
											{color.name}
										</button>
									))}
								</div>
							)}
						</div>
					);
				}

				return (
					<button
						key={item.name}
						className={`flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-700 ${item.isActive(editor) ? "bg-gray-600" : ""
							}`}
						onClick={() => item.command?.(editor)}
					>
						<item.icon className="w-4 h-4" />
					</button>
				);
			})}
		</div>
	);
};

export default EditorBubble;
