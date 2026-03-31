"use client";

import { Controller } from "react-hook-form";

type InputFieldProps = {
	name: string;
	label?: string;
	placeholder?: string;
	className?: string;
	type?: "text" | "number" | "email" | "password";
	required?: boolean | string;
	control: any;
	watch: any;
	setValue: any;
	errors: any;
	clearErrors: any;
	autoFillFirst?: string;
};

export default function InputField({
	name,
	label,
	placeholder,
	className,
	type = "text",
	required = false,
	control,
	watch,
	setValue,
	errors,
	clearErrors,
	autoFillFirst,
}: InputFieldProps) {
	return (
		<Controller
			name={name}
			control={control}
			rules={{
				validate: () => {
					if (!required) return true;
					const value = watch(name);
					return value
						? true
						: typeof required === "string"
						? required
						: "এই ফিল্ডটি প্রয়োজন";
				},
			}}
			render={({ field }) => {
				const value = field.value ?? autoFillFirst ?? "";

				return (
					<div className="flex flex-col w-full gap-1">
						{label && (
							<span className="text-start font-medium text-secondary">
								{label}
							</span>
						)}

						<input
							type={type}
							placeholder={placeholder}
							value={value}
							onChange={(e) => {
								setValue(name, e.target.value);
								clearErrors(name);
							}}
							className={`w-full px-4 py-[9px] border rounded-lg text-[16px] focus:ring-2 focus:ring-cyan-900 ${
								errors[name]
									? "border-red-500"
									: "border-gray-300"
							} ${className}`}
						/>

						{errors[name] && (
							<p className="text-red-500 text-sm mt-1">
								{(errors[name] as any)?.message ||
									"এই ফিল্ডটি প্রয়োজন"}
							</p>
						)}
					</div>
				);
			}}
		/>
	);
}
