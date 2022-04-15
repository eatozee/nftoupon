import * as React from "react";
import { Input } from "@nextui-org/react";

export interface ButtonProps {
	children: React.ReactNode;
}

export function Button(props: ButtonProps) {
	return (
		<>
			<Input placeholder="Next UI" />
			<button>{props.children}</button>
		</>
	);
}

Button.displayName = "Button";
